import { authWebShellClasses } from '@funcup/shared';

/**
 * Style strony /coffee-bank (roaster-app, Tailwind — pełne literały dla JIT).
 */
export const coffeeBankStyles = {
  pageShell: `${authWebShellClasses.page} pb-12`,
  contentInner: 'mx-auto w-full max-w-6xl px-4 pt-2',
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

  twoColumnGrid:
    'grid grid-cols-1 gap-8 min-[900px]:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)] min-[900px]:items-start',
  leftColumn: 'min-w-0',
  rightColumn: 'min-w-0 min-[900px]:sticky min-[900px]:top-4',

  tableTitle: 'mb-3 text-sm font-semibold text-[#111]',
  tableScroll: 'overflow-x-auto rounded-[10px] border border-[#ccc] bg-white shadow-sm',
  table: 'w-full min-w-[320px] border-collapse text-left text-sm',
  tableHeadRow: 'border-b border-[#e0e0e0] bg-[#f5f5f5]',
  tableTh: 'px-3 py-2.5 font-semibold text-[#111]',
  tableThBtn:
    'inline-flex w-full items-center gap-1 text-left font-semibold text-[#111] hover:underline focus:outline-none focus:ring-2 focus:ring-[#111] focus:ring-offset-1 rounded',
  /** Łącz z {@link tableThBtn} gdy kolumna jest aktywna w sortowaniu */
  tableThBtnActive: 'text-[#0d47a1]',
  sortIcon: 'text-xs text-[#555]',
  tableBody: 'bg-white',
  tableTr: 'border-b border-[#eee] last:border-0',
  tableTrSelected: 'bg-[#e3f2fd]',
  tableTd: 'px-3 py-2.5 align-middle text-[#1a1a1a]',
  nameLink:
    'text-left font-medium text-[#0d47a1] underline decoration-[#0d47a1] hover:text-[#0a3d8a] focus:outline-none focus:ring-2 focus:ring-[#0d47a1] focus:ring-offset-1 rounded',

  loadingText: 'text-sm text-[#555]',
  errorBox: 'mb-4 rounded-[10px] border-2 border-[#b00020] bg-[#ffebee] p-3',
  errorText: 'text-sm text-[#7f1010]',
  emptyText: 'text-sm text-[#666]',

  productCard: 'rounded-[10px] border border-[#ccc] bg-white p-4 shadow-sm',
  productCardTitle: 'mb-3 text-base font-bold text-[#111]',
  productImageWrap: 'mb-4',
  productImage: 'max-h-64 w-full rounded-[8px] object-contain',
  productSection: 'mb-3 text-[13px] leading-relaxed text-[#1a1a1a]',
  productStrong: 'font-semibold text-[#111]',
  productEmpty: 'text-sm text-[#666]',

  qrBlock: 'mt-6 border-t border-[#e0e0e0] pt-4',
  qrTitle: 'mb-2 text-sm font-semibold text-[#111]',
  qrCard: 'rounded-[10px] border border-[#ccc] bg-[#fafafa] p-3',
  qrImage: 'mx-auto block h-auto w-full max-w-[240px]',
  qrImagePng: 'mx-auto mt-3 block h-auto w-full max-w-[240px] min-[900px]:hidden',
  qrUrl: 'mt-2 break-all text-[11px] text-[#555]',
  qrDownloadBtn:
    'mt-3 w-full rounded-lg border-2 border-[#111] bg-white px-3 py-2 text-sm font-semibold text-[#111] hover:bg-[#f5f5f5]',
  qrLoading: 'text-sm text-[#555]',
  qrError: 'mt-2 text-sm text-[#b00020]',

  devApiNote: 'mt-4 text-[11px] leading-relaxed text-[#555]',
} as const;
