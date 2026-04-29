import { authWebShellClasses } from '@funcup/shared';

/** Style ekranu profilu palarni (web). Łańcuchy Tailwind dosłowne — JIT. */
export const roasterProfileStyles = {
  pageWithPad: `${authWebShellClasses.page} pb-12`,
  narrowContent: 'mx-auto w-full max-w-4xl px-4 pt-4',
  narrowContentMain: 'mx-auto w-full max-w-4xl px-4 pt-2',
  mutedSmall: 'text-sm text-[#444]',
  errorSmall: 'text-sm text-[#b00020]',
  pageTitle: 'mb-2 mt-2 text-[22px] font-bold text-[#111]',
  backToHub: 'mb-5 inline-block text-sm font-semibold text-[#111] underline',
  viewCard: 'rounded-[10px] border-2 border-[#2a2a2a] bg-[#f3f3f3] p-4',
  viewModeHint: 'mb-3 text-sm text-[#444]',
  dlRoot: 'space-y-2 text-sm text-[#111]',
  dlTerm: 'font-semibold',
  incompleteBanner:
    'mt-4 rounded-[8px] border border-[#b00020] bg-[#ffebee] p-2 text-xs text-[#7f1010]',
  editCta: `${authWebShellClasses.socialButton} mt-5 mb-0 w-full max-w-[480px]`,
  ctaText: authWebShellClasses.socialButtonText,
  formCard: 'max-w-[480px] rounded-[10px] border-2 border-[#2a2a2a] bg-[#f3f3f3] p-4',
  formIntro: 'mb-4 text-sm text-[#444]',
  submitError: 'mt-1 mb-3 text-xs text-[#b00020]',
  saveCta: `${authWebShellClasses.socialButton} mt-2 mb-0 w-full max-w-[480px]`,
  cancelButton:
    'mt-3 w-full rounded-[5px] border border-[#1f1f1f] bg-transparent px-3 py-2 text-sm font-medium text-[#171717]',
  fieldWrap: 'mb-3',
  fieldLabel: authWebShellClasses.fieldLabel,
  fieldInput: `${authWebShellClasses.input} mb-1`,
  fieldError: '-mt-1 mb-1 text-xs text-[#b00020]',
} as const;
