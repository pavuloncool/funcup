import { visualSystemTokens } from '@funcup/shared';
import { StyleSheet } from 'react-native';

const { colors, spacing, radius, typography } = visualSystemTokens;

/** Shared auth / form shell styles. */
export const authScreenStyles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topSection: {
    width: '100%',
    maxWidth: 340,
    marginTop: spacing.xxl,
    alignItems: 'center',
  },
  separatorRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderSubtle,
  },
  separatorText: {
    marginHorizontal: spacing.sm,
    fontSize: typography.bodyMD,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  socialButton: {
    width: '100%',
    height: 46,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceElevated,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  socialButtonText: {
    fontSize: typography.bodyMD,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    height: 46,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.sm,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  fieldLabel: {
    width: '100%',
    fontSize: typography.bodySM,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  fieldHint: {
    width: '100%',
    fontSize: typography.caption,
    color: colors.textSecondary,
    marginTop: -6,
    marginBottom: spacing.sm,
  },
  loginAction: {
    width: '100%',
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentPrimary,
    paddingHorizontal: spacing.md,
    marginTop: spacing.xs,
  },
  loginActionText: {
    fontSize: typography.bodyLG,
    fontWeight: '700',
    color: colors.textOnPrimary,
  },
  registerPrompt: {
    marginBottom: spacing.lg,
    fontSize: typography.bodySM,
    color: colors.textSecondary,
  },
  registerLink: {
    color: colors.accentPrimary,
    fontWeight: '700',
  },
  errorText: {
    width: '100%',
    color: colors.danger,
    marginBottom: spacing.xs,
  },
  infoText: {
    width: '100%',
    color: colors.success,
    marginBottom: spacing.xs,
  },
  centered: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
