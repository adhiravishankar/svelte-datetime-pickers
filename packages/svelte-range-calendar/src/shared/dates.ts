import { createDateUtils } from 'svelte-date-utils';
import type { DateAdapter } from 'svelte-date-utils';

import type { CalendarType, DateType, LooseValue, LooseValuePiece, Range, View } from './types.js';

export const views = ['century', 'decade', 'year', 'month'] as const satisfies readonly View[];

export const tileTypes: Record<View, DateType> = {
  century: 'decade',
  decade: 'year',
  year: 'month',
  month: 'day',
};

export function getCalendarType(locale: string): CalendarType {
  let region: string | undefined;
  try {
    region = new Intl.Locale(locale).maximize().region;
  } catch {
    region = locale.split('-')[1]?.toUpperCase();
  }
  if (region === 'IL') return 'hebrew';
  if (region && 'AE AF BH DJ DZ EG IQ IR JO KW LY OM QA SD SY'.split(' ').includes(region)) {
    return 'islamic';
  }
  if (
    region &&
    'AG AS AU BD BR BS BT BW BZ CA CO DM DO ET GT GU HK HN ID IN JM JP KE KH KR LA MH MM MO MT MX MZ NI NP PA PE PH PK PR PT PY SA SG SV TH TT TW UM US VE VI WS YE ZA ZW'
      .split(' ')
      .includes(region)
  ) {
    return 'gregory';
  }
  return 'iso8601';
}

const weekStartDays: Record<CalendarType, number> = {
  gregory: 0,
  hebrew: 0,
  iso8601: 1,
  islamic: 6,
};

export function isWeekend<T>(
  adapter: DateAdapter<T>,
  date: T,
  calendarType: CalendarType,
): boolean {
  const day = adapter.toJsDate(date).getDay();
  return calendarType === 'islamic' || calendarType === 'hebrew'
    ? day === 5 || day === 6
    : day === 0 || day === 6;
}

export function addDays<T>(adapter: DateAdapter<T>, date: T, days: number): T {
  return adapter.startOfDay(adapter.addDays(date, days));
}

export function getBeginOfWeek<T>(adapter: DateAdapter<T>, date: T, calendarType: CalendarType): T {
  const day = adapter.toJsDate(date).getDay();
  const offset = (day - weekStartDays[calendarType] + 7) % 7;
  return addDays(adapter, date, -offset);
}

export function getDaysBetween<T>(adapter: DateAdapter<T>, from: T, to: T): number {
  const a = adapter.toJsDate(from);
  const b = adapter.toJsDate(to);
  const fromDay = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const toDay = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((toDay - fromDay) / 86_400_000);
}

export function getWeekNumber<T>(
  adapter: DateAdapter<T>,
  date: T,
  calendarType: CalendarType,
): number {
  const jsDate = adapter.toJsDate(date);
  if (calendarType === 'iso8601') {
    const day = jsDate.getDay() || 7;
    const thursday = addDays(adapter, date, 4 - day);
    const year = adapter.getYear(thursday);
    const yearStart = adapter.setDate(
      adapter.setMonth(adapter.setYear(adapter.date(), year), 0),
      1,
    );
    return Math.ceil((getDaysBetween(adapter, yearStart, thursday) + 1) / 7);
  }
  const weekStart = getBeginOfWeek(adapter, date, calendarType);
  if (adapter.getYear(addDays(adapter, weekStart, 6)) > adapter.getYear(weekStart)) return 1;
  const year = adapter.getYear(weekStart);
  const firstDate = adapter.setDate(adapter.setMonth(adapter.setYear(adapter.date(), year), 0), 1);
  const firstWeekStart = getBeginOfWeek(adapter, firstDate, calendarType);
  return Math.round(getDaysBetween(adapter, firstWeekStart, weekStart) / 7) + 1;
}

export function getBegin<T>(adapter: DateAdapter<T>, type: DateType, date: T): T {
  const utils = createDateUtils(adapter);
  switch (type) {
    case 'century':
      return utils.getCenturyStart(date);
    case 'decade':
      return utils.getDecadeStart(date);
    case 'year':
      return utils.getYearStart(date);
    case 'month':
      return utils.getMonthStart(date);
    case 'day':
      return utils.getDayStart(date);
  }
}

export function getEnd<T>(adapter: DateAdapter<T>, type: DateType, date: T): T {
  const utils = createDateUtils(adapter);
  switch (type) {
    case 'century':
      return utils.getCenturyEnd(date);
    case 'decade':
      return utils.getDecadeEnd(date);
    case 'year':
      return utils.getYearEnd(date);
    case 'month':
      return utils.getMonthEnd(date);
    case 'day':
      return utils.getDayEnd(date);
  }
}

export function getRange<T>(adapter: DateAdapter<T>, type: DateType, date: T): Range<T> {
  return [getBegin(adapter, type, date), getEnd(adapter, type, date)];
}

const stepInYears: Record<View, number> = { century: 100, decade: 10, month: 0, year: 1 };
const bigStepInYears: Record<View, number> = { century: 0, decade: 100, month: 1, year: 10 };

function makeDate<T>(adapter: DateAdapter<T>, year: number, month: number, day = 1): T {
  const date = adapter.setYear(adapter.date(), year);
  return adapter.setDate(adapter.setMonth(date, month), day);
}

export function shiftDate<T>(
  adapter: DateAdapter<T>,
  view: View,
  date: T,
  amount: number,
  double = false,
): T {
  const year = adapter.getYear(date);
  const month = adapter.getMonth(date);
  if (!double) {
    return view === 'month'
      ? makeDate(adapter, year, month + amount)
      : getBegin(adapter, view, makeDate(adapter, year + amount * stepInYears[view], 0));
  }
  return getBegin(
    adapter,
    view,
    makeDate(adapter, year + amount * bigStepInYears[view], view === 'month' ? month : 0),
  );
}

export function isRangeWithinRange<T>(
  adapter: DateAdapter<T>,
  greater: Range<T>,
  smaller: Range<T>,
): boolean {
  return !adapter.isAfter(smaller[0], greater[0]) && !adapter.isBefore(smaller[1], greater[1]);
}

export function toDate<T>(
  adapter: DateAdapter<T>,
  value: LooseValuePiece<T> | undefined,
): T | null {
  if (value === null || value === undefined) return null;
  const date = typeof value === 'string' ? adapter.date(value) : value;
  return adapter.isValid(date) ? date : null;
}

export function normalizeValue<T>(
  adapter: DateAdapter<T>,
  value: LooseValue<T> | undefined,
): Range<T | null> {
  if (Array.isArray(value)) return [toDate(adapter, value[0]), toDate(adapter, value[1])];
  return [toDate(adapter, value), null];
}
