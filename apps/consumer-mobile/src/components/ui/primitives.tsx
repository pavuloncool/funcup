import { visualSystemTokens } from '@funcup/shared';
import { HeaderShownContext } from '@react-navigation/elements';
import { useContext } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, type ScrollViewProps, type TextInputProps, type TextProps, type ViewProps } from 'react-native';
import { SafeAreaView, type Edge, type SafeAreaViewProps } from 'react-native-safe-area-context';

const { colors, spacing, radius, typography, recipes } = visualSystemTokens;

type TextVariant = 'hero' | 'h1' | 'h2' | 'h3' | 'body' | 'bodySm' | 'caption';
type TextTone = 'primary' | 'secondary' | 'muted' | 'onPrimary' | 'danger' | 'success';

type ButtonVariant = 'primary' | 'secondary';

const toneColor: Record<TextTone, string> = {
  primary: colors.textPrimary,
  secondary: colors.textSecondary,
  muted: colors.textMuted,
  onPrimary: colors.textOnPrimary,
  danger: colors.danger,
  success: colors.success,
};

const textSize: Record<TextVariant, number> = {
  hero: typography.hero,
  h1: typography.headingXL,
  h2: typography.headingLG,
  h3: typography.headingSM,
  body: typography.bodyMD,
  bodySm: typography.bodySM,
  caption: typography.caption,
};

const SAFE_AREA_EDGES_ALL: Edge[] = ['top', 'right', 'bottom', 'left'];
const SAFE_AREA_EDGES_UNDER_HEADER: Edge[] = ['right', 'bottom', 'left'];

function resolveSafeAreaEdges(edges: SafeAreaViewProps['edges'], headerShown: boolean): SafeAreaViewProps['edges'] {
  if (edges != null) return edges;
  return headerShown ? SAFE_AREA_EDGES_UNDER_HEADER : SAFE_AREA_EDGES_ALL;
}

export function AppScreen(props: SafeAreaViewProps) {
  const headerShown = useContext(HeaderShownContext);
  const edges = resolveSafeAreaEdges(props.edges, Boolean(headerShown));
  return <SafeAreaView {...props} edges={edges} style={[primitives.safeArea, props.style]} />;
}

export function AppScrollScreen(props: ScrollViewProps & { safeAreaProps?: SafeAreaViewProps }) {
  const headerShown = useContext(HeaderShownContext);
  const { safeAreaProps, style, ...scrollProps } = props;
  const edges = resolveSafeAreaEdges(safeAreaProps?.edges, Boolean(headerShown));
  return (
    <SafeAreaView {...safeAreaProps} edges={edges} style={[primitives.safeArea, safeAreaProps?.style]}>
      <ScrollView {...scrollProps} style={[primitives.scroll, style]} />
    </SafeAreaView>
  );
}

export function AppPanel(props: ViewProps & { padded?: boolean }) {
  return <View {...props} style={[primitives.panel, props.padded !== false && primitives.panelPadded, props.style]} />;
}

export function AppText(props: TextProps & { variant?: TextVariant; tone?: TextTone; weight?: '400' | '500' | '600' | '700' | '800' }) {
  const variant = props.variant ?? 'body';
  const tone = props.tone ?? 'primary';
  const weight = props.weight ?? '500';
  return (
    <Text
      {...props}
      style={[
        primitives.text,
        { fontSize: textSize[variant], color: toneColor[tone], fontWeight: weight },
        props.style,
      ]}
    />
  );
}

export function AppCard(props: ViewProps & { elevated?: boolean }) {
  return (
    <View
      {...props}
      style={[primitives.card, props.elevated && primitives.cardElevated, props.style]}
    />
  );
}

export function AppButton(props: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: ButtonVariant;
  accessibilityLabel?: string;
}) {
  const variant = props.variant ?? 'primary';
  const pressedStyle = variant === 'primary' ? primitives.buttonPrimaryPressed : primitives.buttonSecondaryPressed;
  return (
    <Pressable
      onPress={props.onPress}
      disabled={props.disabled}
      accessibilityRole="button"
      accessibilityLabel={props.accessibilityLabel ?? props.label}
      style={({ pressed }) => [
        primitives.buttonBase,
        variant === 'primary' ? primitives.buttonPrimary : primitives.buttonSecondary,
        pressed && !props.disabled ? pressedStyle : null,
        props.disabled ? primitives.buttonDisabled : null,
      ]}
    >
      <AppText variant="body" weight="700" tone={variant === 'primary' ? 'onPrimary' : 'primary'}>
        {props.label}
      </AppText>
    </Pressable>
  );
}

export function AppInput(props: TextInputProps & { hasError?: boolean }) {
  return (
    <TextInput
      {...props}
      placeholderTextColor={colors.textSecondary}
      style={[primitives.input, props.hasError && primitives.inputError, props.style]}
    />
  );
}

export function AppChip(props: { label: string }) {
  return (
    <View style={primitives.chip}>
      <AppText variant="bodySm" tone="secondary">
        {props.label}
      </AppText>
    </View>
  );
}

export const primitives = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: recipes.screen.background,
  },
  scroll: {
    flex: 1,
    width: '100%',
  },
  panel: {
    flex: 1,
    width: '100%',
  },
  panelPadded: {
    paddingHorizontal: recipes.screen.paddingHorizontal,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  text: {
    includeFontPadding: false,
  },
  card: {
    backgroundColor: recipes.card.background,
    borderColor: recipes.card.borderColor,
    borderRadius: recipes.card.borderRadius,
    borderWidth: recipes.card.borderWidth,
    padding: spacing.sm,
    gap: spacing.xs,
  },
  cardElevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonBase: {
    minHeight: 48,
    borderRadius: recipes.button.primary.radius,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  buttonPrimary: {
    backgroundColor: recipes.button.primary.background,
  },
  buttonPrimaryPressed: {
    backgroundColor: recipes.button.primary.backgroundPressed,
  },
  buttonSecondary: {
    backgroundColor: recipes.button.secondary.background,
    borderWidth: 1,
    borderColor: recipes.button.secondary.borderColor,
  },
  buttonSecondaryPressed: {
    backgroundColor: recipes.button.secondary.backgroundPressed,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  input: {
    height: recipes.input.height,
    borderWidth: recipes.input.borderWidth,
    borderColor: recipes.input.borderColor,
    borderRadius: recipes.input.borderRadius,
    backgroundColor: recipes.input.background,
    paddingHorizontal: spacing.sm,
    color: recipes.input.text,
    width: '100%',
  },
  inputError: {
    borderColor: recipes.input.borderColorError,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    backgroundColor: colors.surfaceElevated,
  },
});
