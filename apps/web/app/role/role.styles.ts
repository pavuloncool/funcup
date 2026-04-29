import { authWebShellClasses } from '@funcup/shared';

/** Ekran wyboru roli — rozszerza wspólną powłokę auth o lokalny wrapper linku logowania. */
export const roleStyles = {
  ...authWebShellClasses,
  registerLinkWrapper: 'mt-6 mb-12',
} as const;
