// A dependency-free replacement for `get-user-locale` (and its `memoize` dependency).

export interface UserLocaleOptions {
  /** Add `fallbackLocale` at the end of the list. Defaults to true. */
  useFallbackLocale?: boolean;
  /** Defaults to `en-US`. */
  fallbackLocale?: string;
}

const splitCommas = (locale: string) => (locale.includes(',') ? locale.split(',') : [locale]);

/** Turns `en-us` into `en-US`, `en-US.UTF-8` and `en-US@posix` into `en-US`, and `C` into `en-US`. */
function normalizeLocale(locale: string): string {
  if (!locale) return locale;
  if (locale === 'C' || locale === 'posix' || locale === 'POSIX') return 'en-US';
  // "en-US.UTF-8": keep the part before the dot
  if (locale.includes('.')) return normalizeLocale(locale.split('.')[0] ?? '');
  // "en-US@posix": keep the part before the at sign
  if (locale.includes('@')) return normalizeLocale(locale.split('@')[0] ?? '');
  // already "en-US", or has no region
  if (!locale.includes('-') || locale.toLowerCase() !== locale) return locale;
  const [language, region = ''] = locale.split('-');
  return `${language}-${region.toUpperCase()}`;
}

/** The locales of the browser, most preferred first, without duplicates. */
export function getUserLocales({
  useFallbackLocale = true,
  fallbackLocale = 'en-US',
}: UserLocaleOptions = {}): string[] {
  const list: unknown[] = [];

  if (typeof navigator !== 'undefined') {
    for (const language of navigator.languages ?? []) list.push(...splitCommas(language));
    if (navigator.language) list.push(...splitCommas(navigator.language));
  }
  if (useFallbackLocale) list.push(fallbackLocale);

  return list
    .filter((locale): locale is string => typeof locale === 'string')
    .map(normalizeLocale)
    .filter((locale, index, all) => all.indexOf(locale) === index);
}

/** The most preferred locale of the browser. With `useFallbackLocale: false` there may be none. */
export function getUserLocale(options?: UserLocaleOptions & { useFallbackLocale?: true }): string;
export function getUserLocale(options: UserLocaleOptions): string | undefined;
export function getUserLocale(options?: UserLocaleOptions): string | undefined {
  return getUserLocales(options)[0];
}
