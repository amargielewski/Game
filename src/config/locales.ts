export const LOCALES = ['pl', 'en'] as const;

export type Locale = (typeof LOCALES)[number];

export function isLocale(value: string | null): value is Locale {
  return LOCALES.some((locale) => locale === value);
}
