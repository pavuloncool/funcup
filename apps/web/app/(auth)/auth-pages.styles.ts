/** Wspólne style ekranów (auth): logowanie, rejestracja, pending (Tailwind). */
export const authPagesStyles = {
  main420: 'mx-auto max-w-[420px] px-4 py-10 font-sans text-neutral-900',
  main620: 'mx-auto max-w-[620px] px-4 py-10 font-sans text-neutral-900',
  title: 'mb-4 text-2xl font-semibold text-neutral-900',
  form: 'grid gap-3',
  input: 'w-full rounded border border-neutral-400 px-2 py-1.5 text-sm',
  submitBtn: 'rounded bg-neutral-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50',
  error: 'text-sm text-red-600',
  footer: 'mt-4 text-sm text-neutral-600',
} as const;
