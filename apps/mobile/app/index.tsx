import { MobileEntrySplash } from '../src/components/entry/MobileEntrySplash';

/**
 * FR-012 entry (Phase 010-003): fingerprint → tap → confetti → bean → login.
 * Reduced motion uses AccessibilityInfo.isReduceMotionEnabled() + shortened/static motion.
 */
export default function Index() {
  return <MobileEntrySplash />;
}
