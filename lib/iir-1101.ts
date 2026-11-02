/** Pages of TGI-IIR-2026-1101-001 shown on the Intel reader. */
export const IIR_1101_PAGES = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
  31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44,
] as const;

export function iir1101PageSrc(page: number): string {
  return `/intel/iphone-11/page-${String(page).padStart(2, "0")}.jpg?v=6`;
}
