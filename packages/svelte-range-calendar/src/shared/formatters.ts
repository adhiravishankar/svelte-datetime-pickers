const formatterCache = new Map<string, Intl.DateTimeFormat>();

function getFormatter(locale: string | undefined, options: Intl.DateTimeFormatOptions) {
  const key = `${locale ?? ''}|${JSON.stringify(options)}`;
  let formatter = formatterCache.get(key);

  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, options);
    formatterCache.set(key, formatter);
  }

  return formatter;
}

export type Formatter = (locale: string | undefined, date: Date) => string;

export const formatDay: Formatter = (locale, date) =>
  getFormatter(locale, { day: 'numeric' }).format(date);

export const formatLongDate: Formatter = (locale, date) =>
  getFormatter(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(date);

export const formatMonth: Formatter = (locale, date) =>
  getFormatter(locale, { month: 'long' }).format(date);

export const formatMonthYear: Formatter = (locale, date) =>
  getFormatter(locale, { month: 'long', year: 'numeric' }).format(date);

export const formatShortWeekday: Formatter = (locale, date) =>
  getFormatter(locale, { weekday: 'short' }).format(date);

export const formatWeekday: Formatter = (locale, date) =>
  getFormatter(locale, { weekday: 'long' }).format(date);

export const formatYear: Formatter = (locale, date) =>
  getFormatter(locale, { year: 'numeric' }).format(date);
