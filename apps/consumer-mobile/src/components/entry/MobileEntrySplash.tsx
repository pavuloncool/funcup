import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Dimensions,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  Vibration,
  View,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { HOME_BEAN_XML, HOME_PRINT_XML } from './entrySvgXml';
import { useFingerprintConfetti } from './useFingerprintConfetti';

const PRINT_SIZE = 128;
const BEAN_SIZE = 128;

function useReduceMotionPreference(): boolean {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((v) => {
        if (!cancelled) setEnabled(v);
      })
      .catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', (v) => {
      setEnabled(v);
    });
    return () => {
      cancelled = true;
      sub.remove();
    };
  }, []);
  return enabled;
}

type Timings = {
  white: number;
  fpIn: number;
  confettiIn: number;
  confettiOut: number;
  /** Bean fade-in starts at this fraction of (confettiIn + confettiOut). */
  beanEntryAtConfettiPhase: number;
  beanHold: number;
  beanIn: number;
  beanOut: number;
  mainDelay: number;
};

function useEntryTimings(reduceMotion: boolean): Timings {
  return useMemo(
    () =>
      reduceMotion
        ? {
            white: 200,
            fpIn: 220,
            confettiIn: 80,
            confettiOut: 100,
            beanEntryAtConfettiPhase: 0.8,
            beanHold: 280,
            beanIn: 200,
            beanOut: 200,
            mainDelay: 120,
          }
        : {
            white: 400,
            fpIn: 720,
            confettiIn: 200,
            confettiOut: 320,
            beanEntryAtConfettiPhase: 0.8,
            beanHold: 900,
            beanIn: 900,
            beanOut: 520,
            mainDelay: 380,
          },
    [reduceMotion]
  );
}

/**
 * FR-012 entry for Expo: same semantic beats as web (white → fingerprint → tap → confetti → bean → dissolve → shell).
 * Reduced motion: shorter fades, no pulse, static bean rise (no travel), no particle confetti.
 */
export function MobileEntrySplash() {
  const router = useRouter();
  const reduceMotion = useReduceMotionPreference();
  const timings = useEntryTimings(reduceMotion);

  const [stage, setStage] = useState<'boot' | 'tap' | 'done'>('boot');
  const tappedRef = useRef(false);
  const pulseLoopRef = useRef<Animated.CompositeAnimation | null>(null);
  const printMeasureRef = useRef<View>(null);
  const beanEntryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [burstKey, setBurstKey] = useState(0);
  const [burstOriginX, setBurstOriginX] = useState(0);
  const [burstOriginY, setBurstOriginY] = useState(0);

  const confettiParticles = useFingerprintConfetti({
    burstKey,
    originX: burstOriginX,
    originY: burstOriginY,
    reduceMotion,
  });

  const fpOpacity = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  const pressScale = useRef(new Animated.Value(1)).current;
  const confettiOpacity = useRef(new Animated.Value(0)).current;
  const beanOpacity = useRef(new Animated.Value(0)).current;
  const beanTranslate = useRef(new Animated.Value(reduceMotion ? 0 : 72)).current;

  useEffect(() => {
    beanTranslate.setValue(reduceMotion ? 0 : 72);
  }, [reduceMotion, beanTranslate]);

  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled()
      .then((sr) => {
        if (sr) {
          AccessibilityInfo.announceForAccessibility('funcup');
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const afterWhite = setTimeout(() => {
      Animated.timing(fpOpacity, {
        toValue: 1,
        duration: timings.fpIn,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setStage('tap');
      });
    }, timings.white);
    return () => clearTimeout(afterWhite);
  }, [fpOpacity, timings.white, timings.fpIn]);

  useEffect(() => {
    if (stage !== 'tap' || reduceMotion) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.05,
          duration: 950,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 950,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoopRef.current = loop;
    loop.start();
    return () => {
      loop.stop();
      pulseLoopRef.current = null;
    };
  }, [stage, reduceMotion, pulse]);

  useEffect(() => {
    return () => {
      if (beanEntryTimerRef.current != null) {
        clearTimeout(beanEntryTimerRef.current);
        beanEntryTimerRef.current = null;
      }
    };
  }, []);

  const finishToLogin = useCallback(() => {
    setStage('done');
    router.replace('/(auth)/login');
  }, [router]);

  const onFingerprintTap = useCallback(() => {
    if (stage !== 'tap' || tappedRef.current) return;
    tappedRef.current = true;
    pulseLoopRef.current?.stop?.();

    try {
      Vibration.vibrate(14);
    } catch {
      /* optional */
    }

    Animated.sequence([
      Animated.timing(pressScale, {
        toValue: 0.86,
        duration: reduceMotion ? 100 : 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(pressScale, {
        toValue: 1,
        duration: reduceMotion ? 90 : 160,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      const afterMeasure = (ox: number, oy: number) => {
        setBurstOriginX(ox);
        setBurstOriginY(oy);
        if (!reduceMotion) {
          requestAnimationFrame(() => setBurstKey((k) => k + 1));
        }

        const confettiPhaseMs = timings.confettiIn + timings.confettiOut;
        const beanEnterDelayMs = Math.round(timings.beanEntryAtConfettiPhase * confettiPhaseMs);

        Animated.sequence([
          Animated.timing(confettiOpacity, {
            toValue: reduceMotion ? 0.18 : 0.06,
            duration: timings.confettiIn,
            useNativeDriver: true,
          }),
          Animated.timing(confettiOpacity, {
            toValue: 0,
            duration: timings.confettiOut,
            useNativeDriver: true,
          }),
        ]).start();

        if (beanEntryTimerRef.current != null) {
          clearTimeout(beanEntryTimerRef.current);
        }

        const runBeanSequence = () => {
          beanTranslate.setValue(reduceMotion ? 0 : 72);
          beanOpacity.setValue(0);
          Animated.parallel([
            Animated.timing(fpOpacity, {
              toValue: 0,
              duration: reduceMotion ? 120 : 220,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(beanOpacity, {
              toValue: 1,
              duration: timings.beanIn,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(beanTranslate, {
              toValue: 0,
              duration: reduceMotion ? 1 : timings.beanIn,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
          ]).start(() => {
            setTimeout(() => {
              Animated.timing(beanOpacity, {
                toValue: 0,
                duration: timings.beanOut,
                easing: Easing.inOut(Easing.quad),
                useNativeDriver: true,
              }).start(() => {
                setTimeout(finishToLogin, timings.mainDelay);
              });
            }, timings.beanHold);
          });
        };

        beanEntryTimerRef.current = setTimeout(runBeanSequence, beanEnterDelayMs);
      };

      if (printMeasureRef.current) {
        printMeasureRef.current.measureInWindow((x, y, w, h) => {
          afterMeasure(x + w / 2, y + h / 2);
        });
      } else {
        const { width: winW, height: winH } = Dimensions.get('window');
        afterMeasure(winW / 2, winH / 2);
      }
    });
  }, [
    stage,
    reduceMotion,
    pressScale,
    confettiOpacity,
    fpOpacity,
    beanOpacity,
    beanTranslate,
    timings,
    finishToLogin,
  ]);

  if (stage === 'done') {
    return <View style={styles.fill} />;
  }

  return (
    <View
      style={styles.fill}
      accessibilityViewIsModal
      importantForAccessibility="yes"
      accessibilityElementsHidden={false}
    >
      <View style={styles.white}>
        <Animated.View
          style={[
            styles.centerContent,
            {
              opacity: fpOpacity,
              transform: [{ scale: Animated.multiply(pulse, pressScale) }],
            },
          ]}
        >
          <Pressable
            onPress={onFingerprintTap}
            disabled={stage !== 'tap'}
            accessibilityRole="button"
            accessibilityLabel="funcup"
            accessibilityHint="Double tap to continue the intro"
            style={styles.hit}
          >
            <View ref={printMeasureRef} collapsable={false}>
              <SvgXml xml={HOME_PRINT_XML} width={PRINT_SIZE} height={PRINT_SIZE} />
            </View>
            <Text style={styles.wordmark} accessible={false}>
              funcup
            </Text>
          </Pressable>
        </Animated.View>

        <Animated.View
          pointerEvents="none"
          style={[styles.confettiFlash, { opacity: confettiOpacity }]}
          accessibilityElementsHidden
          importantForAccessibility="no"
        />
        <View style={styles.particleHost} pointerEvents="none" accessibilityElementsHidden>
          {!reduceMotion &&
            confettiParticles.map((p, i) => (
              <View
                key={`${burstKey}-${i}`}
                style={{
                  position: 'absolute',
                  left: p.x,
                  top: p.y,
                  width: Math.max(2.5, p.size * 2.2),
                  height: Math.max(2, p.size),
                  backgroundColor: '#0a0a0a',
                  opacity: Math.max(0, p.life * 0.9),
                  transform: [{ rotate: `${p.rot}rad` }],
                }}
              />
            ))}
        </View>

        <Animated.View
          style={[
            styles.beanWrap,
            {
              opacity: beanOpacity,
              transform: [{ translateY: beanTranslate }],
            },
          ]}
          pointerEvents="none"
          accessibilityElementsHidden
          importantForAccessibility="no"
        >
          <SvgXml xml={HOME_BEAN_XML} width={BEAN_SIZE} height={BEAN_SIZE} />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    backgroundColor: '#fff',
  },
  white: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  hit: {
    minWidth: 160,
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  wordmark: {
    marginTop: 16,
    fontSize: 28,
    letterSpacing: 1.2,
    color: '#1a1a1a',
    fontWeight: '400',
  },
  /** Brief dim pulse — particle opacity is independent (matches web canvas read). */
  confettiFlash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26,26,26,0.12)',
  },
  particleHost: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
  beanWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
