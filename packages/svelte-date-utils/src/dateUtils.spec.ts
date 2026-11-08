import { DateTime } from 'luxon';
import { describe, expect, it, vi } from 'vite-plus/test';

import { AdapterDate, createDateUtils, dateUtils, getUserLocale, getUserLocales } from './index.js';
import { AdapterDateFns } from './date-fns.js';
import { AdapterLuxon } from './luxon.js';

const date = new Date(2026, 10, 8, 13, 45, 30, 123); // 8 November 2026

describe('native Date', () => {
  it('gets the edges of a day, month and year', () => {
    expect(dateUtils.getDayStart(date)).toEqual(new Date(2026, 10, 8));
    expect(dateUtils.getDayEnd(date)).toEqual(new Date(2026, 10, 8, 23, 59, 59, 999));
    expect(dateUtils.getMonthStart(date)).toEqual(new Date(2026, 10, 1));
    expect(dateUtils.getMonthEnd(date)).toEqual(new Date(2026, 10, 30, 23, 59, 59, 999));
    expect(dateUtils.getYearStart(date)).toEqual(new Date(2026, 0, 1));
    expect(dateUtils.getYearEnd(date)).toEqual(new Date(2026, 11, 31, 23, 59, 59, 999));
  });

  it('gets the previous and next periods', () => {
    expect(dateUtils.getPreviousMonthStart(new Date(2026, 0, 31))).toEqual(new Date(2025, 11, 1));
    expect(dateUtils.getNextMonthEnd(new Date(2026, 0, 31))).toEqual(
      new Date(2026, 1, 28, 23, 59, 59, 999),
    );
    expect(dateUtils.getPreviousYearStart(date)).toEqual(new Date(2025, 0, 1));
    expect(dateUtils.getNextDayStart(new Date(2026, 11, 31))).toEqual(new Date(2027, 0, 1));
    expect(dateUtils.getPreviousDayEnd(date, -2)).toEqual(new Date(2026, 10, 6, 23, 59, 59, 999));
  });

  it('gets the decade and century, counting from year 1', () => {
    expect(dateUtils.getDecadeStart(date)).toEqual(new Date(2021, 0, 1));
    expect(dateUtils.getDecadeEnd(date)).toEqual(new Date(2030, 11, 31, 23, 59, 59, 999));
    expect(dateUtils.getCenturyStart(date)).toEqual(new Date(2001, 0, 1));
    expect(dateUtils.getCenturyEnd(date)).toEqual(new Date(2100, 11, 31, 23, 59, 59, 999));
    expect(dateUtils.getPreviousCenturyStart(date)).toEqual(new Date(1901, 0, 1));
    expect(dateUtils.getNextDecadeStart(date)).toEqual(new Date(2031, 0, 1));
  });

  it('accepts a year as a number or a string', () => {
    expect(dateUtils.getYearStart(2020)).toEqual(new Date(2020, 0, 1));
    expect(dateUtils.getDecadeStart('2020')).toEqual(new Date(2011, 0, 1));
    expect(() => dateUtils.getYear('abc')).toThrow();
  });

  it('formats ISO-like local dates', () => {
    expect(dateUtils.getISOLocalMonth(date)).toBe('2026-11');
    expect(dateUtils.getISOLocalDate(date)).toBe('2026-11-08');
    expect(dateUtils.getISOLocalDateTime(date)).toBe('2026-11-08T13:45:30');
    expect(dateUtils.getHoursMinutes(new Date(2026, 0, 1, 9, 5))).toBe('09:05');
  });

  it('reads hours, minutes, seconds and milliseconds from a time string', () => {
    expect(dateUtils.getHours('10:30')).toBe(10);
    expect(dateUtils.getMinutes('10:30')).toBe(30);
    expect(dateUtils.getSeconds('10:30')).toBe(0);
    expect(dateUtils.getSeconds('10:30:15.5')).toBe(15);
    expect(dateUtils.getMilliseconds('10:30:15.5')).toBe(5);
    expect(() => dateUtils.getHours('10')).toThrow();
  });

  it('counts the days in a month', () => {
    expect(dateUtils.getDaysInMonth(new Date(2024, 1, 10))).toBe(29);
    expect(dateUtils.getDaysInMonth(new Date(2026, 1, 10))).toBe(28);
  });
});

describe('adapters agree', () => {
  const native = new AdapterDate();
  const dateFns = new AdapterDateFns();
  const luxon = new AdapterLuxon();

  it('on the weeks of a month', () => {
    const expected = native.getWeekArray(date).map((week) => week.map((day) => +day));
    expect(dateFns.getWeekArray(date).map((week) => week.map((day) => +day))).toEqual(expected);
    expect(
      luxon
        .getWeekArray(DateTime.fromJSDate(date))
        .map((week) => week.map((day) => day.toMillis())),
    ).toEqual(expected);
  });

  it('on the utilities', () => {
    const fns = createDateUtils(dateFns);
    const lux = createDateUtils(luxon);
    const luxDate = DateTime.fromJSDate(date);

    for (const name of [
      'getMonthStart',
      'getMonthEnd',
      'getPreviousMonthStart',
      'getNextMonthEnd',
      'getYearEnd',
      'getDecadeStart',
      'getCenturyEnd',
      'getNextDayStart',
      'getPreviousDayEnd',
    ] as const) {
      const expected = +dateUtils[name](date);
      expect(+fns[name](date), `date-fns ${name}`).toBe(expected);
      expect(+lux[name](luxDate).toMillis(), `luxon ${name}`).toBe(expected);
    }

    expect(lux.getISOLocalDateTime(luxDate)).toBe(dateUtils.getISOLocalDateTime(date));
    expect(lux.getMonth(luxDate)).toBe(10);
    expect(fns.getDaysInMonth(date)).toBe(30);
  });

  it('on the week number and day of the week', () => {
    expect(dateFns.getWeekNumber(date)).toBe(native.getWeekNumber(date));
    expect(dateFns.getDayOfWeek(date)).toBe(native.getDayOfWeek(date));
  });
});

describe('native adapter', () => {
  const native = new AdapterDate();

  it('clamps the day when adding months or setting the year', () => {
    expect(native.addMonths(new Date(2026, 0, 31), 1)).toEqual(new Date(2026, 1, 28));
    expect(native.setYear(new Date(2024, 1, 29), 2026)).toEqual(new Date(2026, 1, 28));
  });

  it('starts weeks on the configured day', () => {
    const monday = new AdapterDate({ weekStartsOn: 1 });
    expect(monday.startOfWeek(date)).toEqual(new Date(2026, 10, 2));
    expect(native.startOfWeek(date)).toEqual(new Date(2026, 10, 8));
  });

  it('parses and formats numeric formats', () => {
    expect(native.formatByString(date, 'yyyy-MM-dd HH:mm')).toBe('2026-11-08 13:45');
    expect(native.parse('2026-11-08', 'yyyy-MM-dd')).toEqual(new Date(2026, 10, 8));
    expect(native.isValid(native.parse('nope', 'yyyy-MM-dd'))).toBe(false);
  });
});

describe('getUserLocale', () => {
  it('returns the first of the locales', () => {
    expect(getUserLocale()).toBe(getUserLocales()[0]);
    expect(getUserLocales()).toEqual([...new Set(getUserLocales())]);
  });

  it('adds the fallback locale only when asked', () => {
    expect(getUserLocales({ fallbackLocale: 'xx-YY' })).toContain('xx-YY');
    expect(getUserLocales({ useFallbackLocale: false, fallbackLocale: 'xx-YY' })).not.toContain(
      'xx-YY',
    );
  });

  it('normalizes the locales of the browser', () => {
    const languages = vi.spyOn(navigator, 'languages', 'get');
    const language = vi.spyOn(navigator, 'language', 'get');
    languages.mockReturnValue(['en-us', 'fr-FR,de', 'C', 'pl_PL'.replace('_', '-')]);
    language.mockReturnValue('en-US.UTF-8');
    try {
      expect(getUserLocales({ useFallbackLocale: false })).toEqual([
        'en-US',
        'fr-FR',
        'de',
        'pl-PL',
      ]);
      expect(getUserLocale()).toBe('en-US');
    } finally {
      languages.mockRestore();
      language.mockRestore();
    }
  });
});
