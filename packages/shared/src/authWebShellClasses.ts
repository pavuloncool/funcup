/**
 * Pełne literały klas Tailwind dla powłoki auth / formularzy (web).
 * Muszą pozostać dosłowne stringi — JIT Tailwinda skanuje ten plik (patrz apps/web/tailwind.config.ts).
 * Wartości są zsynchronizowane z {@link visualTokens}.
 */
export const authWebShellClasses = {
  page: 'min-h-screen bg-[#e9e9e9] text-[#111]',
  screen: 'flex min-h-screen flex-col items-center px-4',
  topSection: 'mt-20 flex w-full max-w-[312px] flex-col items-center',
  title: 'mb-2 text-[28px] font-semibold text-[#111]',
  subtitle: 'mb-7 text-center text-[15px] text-[#444]',
  socialButton:
    'mb-[30px] flex h-11 w-full cursor-pointer items-center justify-center rounded-[5px] border border-[#1f1f1f] bg-[#f3f3f3] text-[15px] font-medium text-[#171717]',
  socialButtonText: 'text-[15px] font-medium text-[#171717]',
  input:
    'mb-[18px] h-[42px] w-full max-w-[480px] rounded-[10px] border-2 border-[#2a2a2a] bg-[#f3f3f3] px-3 text-[#111] placeholder:text-neutral-500',
  registerLink: 'font-bold text-[#111] underline',
  fieldLabel: 'mb-1.5 self-stretch text-[13px] font-semibold text-[#1a1a1a]',
  err: '-mt-2.5 mb-2 text-xs text-[#b00020]',
} as const;
