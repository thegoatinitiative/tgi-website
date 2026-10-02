/** Pages of FER-2026-0906-TECNO-CH6i shown on the public Intel reader. */
export const FER_PUBLIC_PAGES = [
  1, 2, 3, 4, 5, 6, 7, 8, 9,
  11, 12, 13,
  16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
  33, 34, 35, 36, 37, 38, 39, 40,
  42,
  46, 47, 48, 49, 50,
  57,
] as const;

export function ferPageSrc(page: number): string {
  return `/intel/tecno-ch6i/page-${String(page).padStart(2, "0")}.jpg`;
}
