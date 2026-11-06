import {
  getCenturyEnd,
  getCenturyStart,
  getDayEnd,
  getDayStart,
  getDecadeEnd,
  getDecadeStart,
  getMonthEnd,
  getMonthStart,
  getYearEnd,
  getYearStart,
} from '@wojtekmaj/date-utils';

import type { CalendarType, DateType, LooseValue, LooseValuePiece, Range, View } from './types.js';

export const views = ['century', 'decade', 'year', 'month'] as const satisfies readonly View[];

/** Type of date represented by a single tile in a given view. */
export const tileTypes: Record<View, DateType> = {
  century: 'decade',
  decade: 'year',
  year: 'month',
  month: 'day',
};

const dayInMs = 24 * 60 * 60 * 1000;

const gregoryRegions = new Set(
  'AG AS AU BD BR BS BT BW BZ CA CO DM DO ET GT GU HK HN ID IN JM JP KE KH KR LA MH MM MO MT MX MZ NI NP PA PE PH PK PR PT PY SA SG SV TH TT TW UM US VE VI WS YE ZA ZW'.split(
    ' ',
  ),
);
const islamicRegions = new Set('AE AF BH DJ DZ EG IQ IR JO KW LY OM QA SD SY'.split(' '));

export function getCalendarType(locale: string): CalendarType {
  let region: string | undefined;

  try {
    region = new Intl.Locale(locale).maximize().region;
  } catch {
    region = locale.split('-')[1]?.toUpperCase();
  }

  if (region === 'IL') {
    return 'hebrew';
  }

  if (region && islamicRegions.has(region)) {
    return 'islamic';
  }

  if (region && gregoryRegions.has(region)) {
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

export function isWeekend(date: Date, calendarType: CalendarType): boolean {
  const day = date.getDay();

  return calendarType === 'islamic' || calendarType === 'hebrew'
    ? day === 5 || day === 6
    : day === 0 || day === 6;
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

export function getBeginOfWeek(date: Date, calendarType: CalendarType): Date {
  const offset = (date.getDay() - weekStartDays[calendarType] + 7) % 7;

  return addDays(date, -offset);
}

export function getDaysBetween(from: Date, to: Date): number {
  const fromDay = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const toDay = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());

  return Math.round((toDay - fromDay) / dayInMs);
}

export function getWeekNumber(date: Date, calendarType: CalendarType): number {
  if (calendarType === 'iso8601') {
    const thursday = addDays(date, 4 - (date.getDay() || 7));
    const yearStart = new Date(thursday.getFullYear(), 0, 1);

    return Math.ceil((getDaysBetween(yearStart, thursday) + 1) / 7);
  }

  const weekStart = getBeginOfWeek(date, calendarType);

  // The week containing January 1st is week 1
  if (addDays(weekStart, 6).getFullYear() > weekStart.getFullYear()) {
    return 1;
  }

  const firstWeekStart = getBeginOfWeek(new Date(weekStart.getFullYear(), 0, 1), calendarType);

  return Math.round(getDaysBetween(firstWeekStart, weekStart) / 7) + 1;
}

export function getBegin(type: DateType, date: Date): Date {
  switch (type) {
    case 'century':
      return getCenturyStart(date);
    case 'decade':
      return getDecadeStart(date);
    case 'year':
      return getYearStart(date);
    case 'month':
      return getMonthStart(date);
    case 'day':
      return getDayStart(date);
  }
}

export function getEnd(type: DateType, date: Date): Date {
  switch (type) {
    case 'century':
      return getCenturyEnd(date);
    case 'decade':
      return getDecadeEnd(date);
    case 'year':
      return getYearEnd(date);
    case 'month':
      return getMonthEnd(date);
    case 'day':
      return getDayEnd(date);
  }
}

export function getRange(type: DateType, date: Date): Range<Date> {
  return [getBegin(type, date), getEnd(type, date)];
}

const stepInYears: Record<View, number> = { century: 100, decade: 10, month: 0, year: 1 };
const bigStepInYears: Record<View, number> = { century: 0, decade: 100, month: 1, year: 10 };

/**
 * Moves a date by one unit of the given view (`double` = false), or by one unit of the next
 * bigger view (`double` = true), and returns the beginning of the resulting period.
 */
export function shiftDate(view: View, date: Date, amount: number, double = false): Date {
  const year = date.getFullYear();
  const month = date.getMonth();

  if (!double) {
    return view === 'month'
      ? new Date(year, month + amount, 1)
      : getBegin(view, new Date(year + amount * stepInYears[view], 0, 1));
  }

  return getBegin(
    view,
    new Date(year + amount * bigStepInYears[view], view === 'month' ? month : 0, 1),
  );
}

export function isRangeWithinRange(greater: Range<Date>, smaller: Range<Date>): boolean {
  return (
    greater[0].getTime() <= smaller[0].getTime() && greater[1].getTime() >= smaller[1].getTime()
  );
}

export function toDate(value: LooseValuePiece | undefined): Date | null {
  if (value === null || value === undefined) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

export function normalizeValue(value: LooseValue | undefined): Range<Date | null> {
  if (Array.isArray(value)) {
    return [toDate(value[0]), toDate(value[1])];
  }

  return [toDate(value), null];
}
