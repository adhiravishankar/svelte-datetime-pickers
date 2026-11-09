import {
  CalendarDateTime,
  endOfMonth,
  endOfWeek,
  endOfYear,
  getLocalTimeZone,
  getDayOfWeek,
  isSameDay,
  isSameMonth,
  isSameYear,
  now,
  parseDate,
  parseDateTime,
  parseZonedDateTime,
  startOfMonth,
  startOfWeek,
  startOfYear,
  toCalendarDateTime,
  type DateValue,
} from '@internationalized/date';
import type { DateAdapter } from './types.js';

const WEEKDAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;
const invalidValues = new WeakSet<object>();

export interface AdapterInternationalizedDateOptions {
  /** Locale used for week rules and formatting. Defaults to the user's locale. */
  locale?: string;
  /** First day of the week, 0 (Sunday) to 6 (Saturday). Defaults to the locale's first day. */
  weekStartsOn?: number;
  /** Time zone used to create and convert dates. Defaults to the system time zone. */
  timeZone?: string;
}

/** Adapter for `@internationalized/date`. Values are its immutable CalendarDate types. */
export class AdapterInternationalizedDate implements DateAdapter<DateValue> {
  public readonly lib = '@internationalized/date';
  public readonly locale: string;
  public readonly timeZone: string;
  private readonly weekStartsOn?: (typeof WEEKDAYS)[number];

  constructor({ locale, weekStartsOn, timeZone }: AdapterInternationalizedDateOptions = {}) {
    this.locale = locale ?? (typeof navigator === 'undefined' ? 'en-US' : navigator.language);
    this.timeZone = timeZone ?? getLocalTimeZone();
    if (weekStartsOn !== undefined) {
      if (!Number.isInteger(weekStartsOn) || weekStartsOn < 0 || weekStartsOn > 6) {
        throw new RangeError('weekStartsOn must be an integer from 0 to 6.');
      }
      this.weekStartsOn = WEEKDAYS[weekStartsOn];
    }
  }

  public date = (value?: string): DateValue => {
    if (value === undefined) return toCalendarDateTime(now(this.timeZone));
    try {
      if (/T.*(?:Z|[+-]\d{2}:?\d{2})$/.test(value)) return parseZonedDateTime(value);
      return value.includes('T') ? parseDateTime(value) : parseDate(value);
    } catch {
      return this.getInvalidDate();
    }
  };
  public getInvalidDate = (): DateValue => {
    const value = new CalendarDateTime(1, 1, 1);
    invalidValues.add(value);
    return value;
  };
  public isValid = (value: DateValue | null | undefined): value is DateValue =>
    value != null && !invalidValues.has(value);
  public toJsDate = (value: DateValue) =>
    'timeZone' in value ? value.toDate() : value.toDate(this.timeZone);

  private asDateTime = (value: DateValue) => toCalendarDateTime(value);
  private startDay = (value: DateValue): DateValue =>
    'hour' in value ? value.set({ hour: 0, minute: 0, second: 0, millisecond: 0 }) : value;
  public formatByString = (value: DateValue, format: string) => {
    const pad = (number: number, size = 2) => String(number).padStart(size, '0');
    const tokens: Record<string, string> = {
      yyyy: pad(value.year, 4),
      MM: pad(value.month),
      dd: pad(value.day),
      HH: pad(this.getHours(value)),
      mm: pad(this.getMinutes(value)),
      ss: pad(this.getSeconds(value)),
      SSS: pad(this.getMilliseconds(value), 3),
    };
    return format.replace(/yyyy|SSS|MM|dd|HH|mm|ss/g, (token) => tokens[token] ?? token);
  };

  public parse = (value: string, format: string): DateValue | null => {
    if (value === '') return null;
    const order: string[] = [];
    const source = format
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/yyyy|SSS|MM|dd|HH|mm|ss/g, (token) => {
        order.push(token);
        return `(\\d{${token.length}})`;
      });
    const match = new RegExp(`^${source}$`).exec(value);
    if (!match) return this.getInvalidDate();
    const part = (token: string, fallback: number) => {
      const index = order.indexOf(token);
      return index === -1 ? fallback : Number(match[index + 1]);
    };
    try {
      const year = part('yyyy', 1970);
      const month = part('MM', 1);
      const day = part('dd', 1);
      return order.some((token) => ['HH', 'mm', 'ss', 'SSS'].includes(token))
        ? new CalendarDateTime(
            year,
            month,
            day,
            part('HH', 0),
            part('mm', 0),
            part('ss', 0),
            part('SSS', 0),
          )
        : parseDate(
            `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
          );
    } catch {
      return this.getInvalidDate();
    }
  };

  public isEqual = (value: DateValue | null, comparing: DateValue | null) =>
    value === null || comparing === null ? value === comparing : value.compare(comparing) === 0;
  public isSameYear = (value: DateValue, comparing: DateValue) => isSameYear(value, comparing);
  public isSameMonth = (value: DateValue, comparing: DateValue) => isSameMonth(value, comparing);
  public isSameDay = (value: DateValue, comparing: DateValue) => isSameDay(value, comparing);
  public isAfter = (value: DateValue, comparing: DateValue) => value.compare(comparing) > 0;
  public isBefore = (value: DateValue, comparing: DateValue) => value.compare(comparing) < 0;
  public isWithinRange = (value: DateValue, [start, end]: [DateValue, DateValue]) =>
    value.compare(start) >= 0 && value.compare(end) <= 0;

  public startOfYear = (value: DateValue) => startOfYear(value);
  public startOfMonth = (value: DateValue) => startOfMonth(value);
  public startOfWeek = (value: DateValue) => startOfWeek(value, this.locale, this.weekStartsOn);
  public startOfDay = (value: DateValue) => this.startDay(value);
  public endOfYear = (value: DateValue) => endOfYear(value);
  public endOfMonth = (value: DateValue) => endOfMonth(value);
  public endOfWeek = (value: DateValue) => endOfWeek(value, this.locale, this.weekStartsOn);
  public endOfDay = (value: DateValue) =>
    'hour' in value ? this.startDay(value).add({ days: 1 }).subtract({ milliseconds: 1 }) : value;

  public addYears = (value: DateValue, amount: number) => value.add({ years: amount });
  public addMonths = (value: DateValue, amount: number) => value.add({ months: amount });
  public addWeeks = (value: DateValue, amount: number) => value.add({ weeks: amount });
  public addDays = (value: DateValue, amount: number) => value.add({ days: amount });
  public addHours = (value: DateValue, amount: number) =>
    'hour' in value ? value.add({ hours: amount }) : this.asDateTime(value).add({ hours: amount });
  public addMinutes = (value: DateValue, amount: number) =>
    'hour' in value
      ? value.add({ minutes: amount })
      : this.asDateTime(value).add({ minutes: amount });
  public addSeconds = (value: DateValue, amount: number) =>
    'hour' in value
      ? value.add({ seconds: amount })
      : this.asDateTime(value).add({ seconds: amount });

  public getYear = (value: DateValue) => value.year;
  public getMonth = (value: DateValue) => value.month - 1;
  public getDate = (value: DateValue) => value.day;
  public getHours = (value: DateValue) => ('hour' in value ? value.hour : 0);
  public getMinutes = (value: DateValue) => ('minute' in value ? value.minute : 0);
  public getSeconds = (value: DateValue) => ('second' in value ? value.second : 0);
  public getMilliseconds = (value: DateValue) => ('millisecond' in value ? value.millisecond : 0);

  public setYear = (value: DateValue, year: number) => value.set({ year });
  public setMonth = (value: DateValue, month: number) => value.set({ month: month + 1 });
  public setDate = (value: DateValue, day: number) => value.set({ day });
  public setHours = (value: DateValue, hour: number) =>
    'hour' in value ? value.set({ hour }) : this.asDateTime(value).set({ hour });
  public setMinutes = (value: DateValue, minute: number) =>
    'hour' in value ? value.set({ minute }) : this.asDateTime(value).set({ minute });
  public setSeconds = (value: DateValue, second: number) =>
    'hour' in value ? value.set({ second }) : this.asDateTime(value).set({ second });
  public setMilliseconds = (value: DateValue, millisecond: number) =>
    'hour' in value ? value.set({ millisecond }) : this.asDateTime(value).set({ millisecond });

  public getDaysInMonth = (value: DateValue) => value.calendar.getDaysInMonth(value);
  public getWeekArray = (value: DateValue) => {
    const start = this.startOfWeek(this.startOfMonth(value));
    const end = this.endOfWeek(this.endOfMonth(value));
    const weeks: DateValue[][] = [];
    let current = start;
    for (let count = 0; current.compare(end) <= 0; count += 1) {
      (weeks[Math.floor(count / 7)] ??= []).push(current);
      current = current.add({ days: 1 });
    }
    return weeks;
  };
  public getWeekNumber = (value: DateValue) => {
    const yearStart = this.startOfWeek(this.startOfYear(value));
    const weekStart = this.startOfWeek(value);
    const nextYearStart = this.startOfWeek(this.startOfYear(value.add({ years: 1 })));
    if (weekStart.compare(nextYearStart) >= 0) return 1;
    return Math.round((+this.toJsDate(weekStart) - +this.toJsDate(yearStart)) / 604_800_000) + 1;
  };
  public getDayOfWeek = (value: DateValue) =>
    getDayOfWeek(value, this.locale, this.weekStartsOn) + 1;
}
