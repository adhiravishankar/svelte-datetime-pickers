import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import localeData from 'dayjs/plugin/localeData.js';

import type { Dayjs } from 'dayjs';
import type { DateAdapter } from './types.js';

dayjs.extend(customParseFormat);
dayjs.extend(localeData);

const FORMAT_TOKENS: Record<string, string> = {
  yyyy: 'YYYY',
  yy: 'YY',
  y: 'YYYY',
  MMMM: 'MMMM',
  MMM: 'MMM',
  MM: 'MM',
  M: 'M',
  dd: 'DD',
  d: 'D',
  HH: 'HH',
  H: 'H',
  hh: 'hh',
  h: 'h',
  mm: 'mm',
  m: 'm',
  ss: 'ss',
  s: 's',
  SSS: 'SSS',
  a: 'a',
};

const FORMAT_TOKEN_PATTERN = /yyyy|MMMM|MMM|yy|y|MM|M|dd|d|HH|H|hh|h|mm|m|ss|s|SSS|a/g;

export interface AdapterDayjsOptions {
  /** Locale such as `de` or `en-gb`. Import the matching Day.js locale before using it. */
  locale?: string;
  /** First day of the week, 0 (Sunday) to 6 (Saturday). Defaults to the locale's first day. */
  weekStartsOn?: number;
}

/** Adapter for Day.js. Values are immutable Day.js `Dayjs` objects. */
export class AdapterDayjs implements DateAdapter<Dayjs> {
  public readonly lib = 'dayjs';
  public readonly locale: string;
  private readonly weekStartsOn?: number;

  constructor({ locale = 'en', weekStartsOn }: AdapterDayjsOptions = {}) {
    if (
      weekStartsOn !== undefined &&
      (!Number.isInteger(weekStartsOn) || weekStartsOn < 0 || weekStartsOn > 6)
    ) {
      throw new RangeError('weekStartsOn must be an integer from 0 to 6.');
    }
    this.locale = locale.toLowerCase();
    this.weekStartsOn = weekStartsOn;
  }

  private withLocale = (value: Dayjs) => value.locale(this.locale);
  private getWeekStart = (value: Dayjs) =>
    this.weekStartsOn ?? this.withLocale(value).localeData().firstDayOfWeek();
  private formatForDayjs = (format: string) =>
    format.replace(FORMAT_TOKEN_PATTERN, (token) => FORMAT_TOKENS[token] ?? token);

  public date = (value?: string) =>
    value === undefined ? this.withLocale(dayjs()) : this.withLocale(dayjs(value));
  public getInvalidDate = () => this.withLocale(dayjs(Number.NaN));
  public isValid = (value: Dayjs | null | undefined): value is Dayjs =>
    value != null && value.isValid();
  public toJsDate = (value: Dayjs) => value.toDate();

  public formatByString = (value: Dayjs, format: string) =>
    this.withLocale(value).format(this.formatForDayjs(format));
  public parse = (value: string, format: string) =>
    value === ''
      ? null
      : this.withLocale(dayjs(value, this.formatForDayjs(format), this.locale, true));

  public isEqual = (value: Dayjs | null, comparing: Dayjs | null) =>
    value === null || comparing === null
      ? value === comparing
      : value.valueOf() === comparing.valueOf();
  public isSameYear = (value: Dayjs, comparing: Dayjs) => value.isSame(comparing, 'year');
  public isSameMonth = (value: Dayjs, comparing: Dayjs) => value.isSame(comparing, 'month');
  public isSameDay = (value: Dayjs, comparing: Dayjs) => value.isSame(comparing, 'day');
  public isAfter = (value: Dayjs, comparing: Dayjs) => value.isAfter(comparing);
  public isBefore = (value: Dayjs, comparing: Dayjs) => value.isBefore(comparing);
  public isWithinRange = (value: Dayjs, [start, end]: [Dayjs, Dayjs]) =>
    !value.isBefore(start) && !value.isAfter(end);

  public startOfYear = (value: Dayjs) => value.startOf('year');
  public startOfMonth = (value: Dayjs) => value.startOf('month');
  public startOfWeek = (value: Dayjs) =>
    value.startOf('day').subtract((value.day() - this.getWeekStart(value) + 7) % 7, 'day');
  public startOfDay = (value: Dayjs) => value.startOf('day');
  public endOfYear = (value: Dayjs) => value.endOf('year');
  public endOfMonth = (value: Dayjs) => value.endOf('month');
  public endOfWeek = (value: Dayjs) => this.startOfWeek(value).add(6, 'day').endOf('day');
  public endOfDay = (value: Dayjs) => value.endOf('day');

  public addYears = (value: Dayjs, amount: number) => this.addMonths(value, amount * 12);
  public addMonths = (value: Dayjs, amount: number) => {
    const day = value.date();
    const result = value.date(1).add(amount, 'month');
    return result.date(Math.min(day, result.daysInMonth()));
  };
  public addWeeks = (value: Dayjs, amount: number) => value.add(amount, 'week');
  public addDays = (value: Dayjs, amount: number) => value.add(amount, 'day');
  public addHours = (value: Dayjs, amount: number) => value.add(amount, 'hour');
  public addMinutes = (value: Dayjs, amount: number) => value.add(amount, 'minute');
  public addSeconds = (value: Dayjs, amount: number) => value.add(amount, 'second');

  public getYear = (value: Dayjs) => value.year();
  public getMonth = (value: Dayjs) => value.month();
  public getDate = (value: Dayjs) => value.date();
  public getHours = (value: Dayjs) => value.hour();
  public getMinutes = (value: Dayjs) => value.minute();
  public getSeconds = (value: Dayjs) => value.second();
  public getMilliseconds = (value: Dayjs) => value.millisecond();

  public setYear = (value: Dayjs, year: number) => {
    const day = value.date();
    const result = value.date(1).year(year);
    return result.date(Math.min(day, result.daysInMonth()));
  };
  public setMonth = (value: Dayjs, month: number) => {
    const day = value.date();
    const result = value.date(1).month(month);
    return result.date(Math.min(day, result.daysInMonth()));
  };
  public setDate = (value: Dayjs, date: number) => value.date(date);
  public setHours = (value: Dayjs, hours: number) => value.hour(hours);
  public setMinutes = (value: Dayjs, minutes: number) => value.minute(minutes);
  public setSeconds = (value: Dayjs, seconds: number) => value.second(seconds);
  public setMilliseconds = (value: Dayjs, milliseconds: number) => value.millisecond(milliseconds);

  public getDaysInMonth = (value: Dayjs) => value.daysInMonth();
  public getWeekArray = (value: Dayjs) => {
    const start = this.startOfWeek(this.startOfMonth(value));
    const end = this.endOfWeek(this.endOfMonth(value));
    const weeks: Dayjs[][] = [];
    let current = start;
    for (let count = 0; !current.isAfter(end); count += 1) {
      (weeks[Math.floor(count / 7)] ??= []).push(current);
      current = this.addDays(current, 1);
    }
    return weeks;
  };

  /** Week number where week 1 contains January 1, matching the other adapters. */
  public getWeekNumber = (value: Dayjs) => {
    const yearStart = this.startOfWeek(this.startOfYear(value));
    const weekStart = this.startOfWeek(value);
    const nextYearStart = this.startOfWeek(this.startOfYear(this.addYears(value, 1)));
    if (!weekStart.isBefore(nextYearStart)) return 1;
    return Math.round(weekStart.diff(yearStart, 'day') / 7) + 1;
  };
  public getDayOfWeek = (value: Dayjs) => ((value.day() - this.getWeekStart(value) + 7) % 7) + 1;
}
