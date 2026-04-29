import { visualTokens } from '@funcup/shared';
import { StyleSheet } from 'react-native';

const { colors, layout, radius, fontSize, fontWeight } = visualTokens;

/** Shared auth / form shell styles (from login screen). */
export const authScreenStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.screenBackground,
  },
  screen: {
    flex: 1,
    paddingHorizontal: layout.screenPaddingHorizontal,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topSection: {
    width: '100%',
    maxWidth: layout.topSectionMaxWidth,
    marginTop: layout.topSectionMarginTop,
    alignItems: 'center',
  },
  socialButton: {
    width: '100%',
    height: layout.socialButtonHeight,
    borderWidth: 1,
    borderColor: colors.borderButton,
    borderRadius: radius.socialButton,
    backgroundColor: colors.surfaceButton,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: layout.socialButtonMarginBottom,
    gap: layout.socialButtonGap,
  },
  googleIconWrap: {
    width: layout.googleIconSize,
    height: layout.googleIconSize,
    borderRadius: layout.googleIconRadius,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIconText: {
    fontSize: fontSize.googleIcon,
    fontWeight: fontWeight.bold,
    color: colors.googleBlue,
  },
  appleIcon: {
    fontSize: fontSize.appleIcon,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  socialButtonText: {
    fontSize: fontSize.socialButtonText,
    color: colors.textOnButton,
    fontWeight: fontWeight.medium,
  },
  separatorRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: layout.socialButtonMarginBottom,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.separatorLine,
  },
  separatorText: {
    marginHorizontal: layout.separatorMarginHorizontal,
    fontSize: fontSize.separatorText,
    color: colors.separatorText,
  },
  input: {
    width: '100%',
    height: layout.inputHeight,
    borderWidth: layout.inputBorderWidth,
    borderColor: colors.borderInput,
    borderRadius: layout.inputBorderRadius,
    backgroundColor: colors.surfaceButton,
    paddingHorizontal: layout.inputPaddingHorizontal,
    marginBottom: layout.inputMarginBottom,
  },
  fieldLabel: {
    width: '100%',
    fontSize: 14,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
    marginBottom: 6,
  },
  fieldHint: {
    width: '100%',
    fontSize: 12,
    color: colors.separatorText,
    marginTop: -8,
    marginBottom: 12,
  },
  loginAction: {
    paddingVertical: layout.loginActionPaddingVertical,
    paddingHorizontal: layout.loginActionPaddingHorizontal,
  },
  loginActionText: {
    fontSize: fontSize.loginAction,
    fontWeight: fontWeight.extrabold,
    color: colors.loginActionText,
  },
  registerPrompt: {
    marginBottom: layout.registerPromptMarginBottom,
    fontSize: fontSize.registerPrompt,
    color: colors.registerPrompt,
  },
  registerLink: {
    color: colors.registerLink,
    fontWeight: fontWeight.bold,
  },
});
