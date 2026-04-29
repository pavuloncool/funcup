import { authWebShellClasses } from '@funcup/shared';

/**
 * Style strony /tag (Tailwind — pełne literały dla JIT).
 * Pola formularza używają tej samej powłoki co {@link authWebShellClasses}.
 */
export const tagStyles = {
  pageShell: `${authWebShellClasses.page} pb-12`,
  contentInner: 'mx-auto w-full max-w-4xl px-4 pt-2',
  pageTitle: 'mb-2 mt-2 text-[22px] font-bold text-[#111]',
  backToHub: 'mb-5 inline-block text-sm font-semibold text-[#111] underline',

  authGateBox: 'mb-4 rounded-[10px] border-2 border-[#856404] bg-[#fff3cd] p-3',
  authGateTitle: 'text-sm font-semibold text-[#533f03]',
  authGateBody: 'mt-1 text-[13px] text-[#1a1a1a]',
  authGateLink: 'font-semibold underline',

  roasterGateBox: 'mb-4 rounded-[10px] border-2 border-[#b00020] bg-[#ffebee] p-3',
  roasterGateTitle: 'text-sm font-semibold text-[#7f1010]',
  roasterGateBody: 'mt-1 text-[13px] text-[#1a1a1a]',
  roasterGateCode: 'text-xs',
  roasterGateLinkPrimary: 'mt-2 inline-block text-sm font-semibold underline',
  roasterGateLinkSecondary: 'mt-2 ml-4 inline-block text-sm font-semibold text-[#444] underline',

  qrPanelWrap: 'min-[480px]:pt-10',
  qrPanelTitle: 'mb-2 text-sm font-semibold text-[#111]',
  qrCard: 'rounded-[10px] border border-[#ccc] bg-white p-3 shadow-sm',
  qrImage: 'mx-auto block h-auto w-full max-w-[240px]',
  qrImagePng: 'mx-auto mt-3 block h-auto w-full max-w-[240px] md:hidden',
  qrUrl: 'mt-2 break-all text-[11px] text-[#555]',
  qrDownloadBtn:
    'mt-3 w-full rounded-lg border-2 border-[#111] bg-white px-3 py-2 text-sm font-semibold text-[#111] hover:bg-[#f5f5f5]',
  qrHint: 'text-[13px] leading-relaxed text-[#666]',
  qrError: 'mt-2 text-sm text-[#b00020]',

  successBox: 'mb-4 rounded-[10px] border-2 border-[#1a7f37] bg-[#e8f5e9] p-3',
  successTitle: 'mb-1 text-sm font-bold text-[#0d3b16]',
  successBody: 'text-[13px] leading-relaxed text-[#1a1a1a]',
  successCode: 'text-xs',
  successDevNote: 'mt-2 text-[11px] text-[#2e5c32]',
  successDevMono: 'font-mono text-xs',
  successCta: 'mt-3 rounded-lg bg-[#111] px-3.5 py-2 text-sm font-semibold text-white',

  errorBox: 'mb-4 rounded-[10px] border-2 border-[#b00020] bg-[#ffebee] p-3',
  errorTitle: 'mb-2 text-sm font-bold text-[#7f1010]',
  errorBody: 'text-[13px] leading-relaxed text-[#1a1a1a]',

  formGrid: 'grid grid-cols-1 gap-8 min-[480px]:grid-cols-[minmax(0,1fr)_260px]',
  formColumn: 'min-w-0 max-w-[480px]',
  formRoot: 'space-y-0',

  filepondWrap: 'mb-[18px]',
  dateRow: 'mb-[18px] flex flex-wrap items-center gap-2',
  datePickerTrigger: `${authWebShellClasses.input} mb-0 flex h-[42px] flex-1 min-w-[200px] justify-between text-left font-normal`,
  datePlaceholder: 'text-[#888]',
  calendarIcon: 'h-4 w-4 shrink-0 opacity-60',
  todayBtn:
    'h-[42px] shrink-0 rounded-[10px] border-2 border-[#2a2a2a] bg-[#e0e0e0] px-3.5 font-bold text-[#111] hover:bg-[#d5d5d5]',

  saveBtn: `${authWebShellClasses.socialButton} mt-2 mb-4 w-full max-w-[480px]`,
  saveBtnSpinner: 'text-[#111]',
  qrGenerateWrap: 'mb-6',
  qrGenerateBtn: `${authWebShellClasses.socialButton} w-full max-w-[480px]`,
  qrGenerateSpinner: 'text-[#111]',

  devApiNote: 'mt-4 text-[11px] leading-relaxed text-[#555]',

  input: authWebShellClasses.input,
  /** Wartość ze skrótu palarni (profil) — tylko odczyt, bez pola edycyjnego */
  readOnlyRoasterName:
    'mb-[18px] min-h-[42px] rounded-[10px] border border-[#d4d4d4] bg-[#f5f5f5] px-3 py-2.5 text-[15px] font-medium leading-snug text-[#111]',
  fieldLabel: authWebShellClasses.fieldLabel,
  err: authWebShellClasses.err,
  socialButtonText: authWebShellClasses.socialButtonText,
} as const;
