import type { DateAdapter } from './types.js';

export interface AdapterDateOptions {
  /** First day of the week, 0 (Sunday) to 6 (Saturday). Defaults to 0. */
  weekStartsOn?: number;
}

const copy = (value: Date) => new Date(value.getTime());

/** Adapter for the native `Date`, with no dependency. The default adapter of the package. */
export class AdapterDate implements DateAdapter<Date> {
  public readonly lib = 'native';

  private readonly weekStartsOn: number;

  constructor({ weekStartsOn = 0 }: AdapterDateOptions = {}) {
    this.weekStartsOn = weekStartsOn;
  }

  public date = (value?: string) => (value === undefined ? new Date() : new Date(value));
  public getInvalidDate = () => new Date('Invalid Date');
  public isValid = (value: Date | null | undefined): value is Date =>
    value instanceof Date && !Number.isNaN(value.getTime());
  public toJsDate = (value: Date) => value;

  public formatByString = (value: Date, format: string): string => {
    const pad = (n: number, length = 2) => String(n).padStart(length, '0');
    const tokens: Record<string, string> = {
      yyyy: pad(value.getFullYear(), 4),
      MM: pad(value.getMonth() + 1),
      dd: pad(value.getDate()),
      HH: pad(value.getHours()),
      mm: pad(value.getMinutes()),
      ss: pad(value.getSeconds()),
      SSS: pad(value.getMilliseconds(), 3),
    };
    return format.replace(/yyyy|MM|dd|HH|mm|ss|SSS/g, (token) => tokens[token] ?? token);
  };

  /** Parses the numeric tokens `yyyy MM dd HH mm ss`. Use another adapter for locale formats. */
  public parse = (value: string, format: string): Date | null => {
    if (value === '') return null;
    const order: string[] = [];
    const source = format
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/yyyy|MM|dd|HH|mm|ss/g, (token) => {
        order.push(token);
        return `(\\d{${token.length}})`;
      });
    const match = new RegExp(`^${source}$`).exec(value);
    if (!match) return this.getInvalidDate();
    const part = (token: string, fallback: number) => {
      const index = order.indexOf(token);
      return index === -1 ? fallback : Number(match[index + 1]);
    };
    const result = new Date(
      part('yyyy', 1970),
      part('MM', 1) - 1,
      part('dd', 1),
      part('HH', 0),
      part('mm', 0),
      part('ss', 0),
    );
    // new Date(99, ...) means 1999: keep the year as written
    result.setFullYear(part('yyyy', 1970));
    return result;
  };

  public isEqual = (value: Date | null, comparing: Date | null) =>
    value === null || comparing === null ? value === comparing : +value === +comparing;
  public isSameYear = (value: Date, comparing: Date) =>
    value.getFullYear() === comparing.getFullYear();
  public isSameMonth = (value: Date, comparing: Date) =>
    this.isSameYear(value, comparing) && value.getMonth() === comparing.getMonth();
  public isSameDay = (value: Date, comparing: Date) =>
    this.isSameMonth(value, comparing) && value.getDate() === comparing.getDate();
  public isAfter = (value: Date, comparing: Date) => value > comparing;
  public isBefore = (value: Date, comparing: Date) => value < comparing;
  public isWithinRange = (value: Date, [start, end]: [Date, Date]) =>
    value >= start && value <= end;

  public startOfYear = (value: Date) => {
    const result = new Date(0);
    result.setFullYear(value.getFullYear(), 0, 1);
    result.setHours(0, 0, 0, 0);
    return result;
  };
  public startOfMonth = (value: Date) => this.startOfDay(this.setDate(value, 1));
  public startOfWeek = (value: Date) => {
    const diff = (value.getDay() - this.weekStartsOn + 7) % 7;
    return this.startOfDay(this.addDays(value, -diff));
  };
  public startOfDay = (value: Date) => {
    const result = copy(value);
    result.setHours(0, 0, 0, 0);
    return result;
  };
  public endOfYear = (value: Date) => {
    const result = copy(value);
    result.setMonth(11, 31);
    result.setHours(23, 59, 59, 999);
    return result;
  };
  public endOfMonth = (value: Date) => {
    const result = this.setDate(value, this.getDaysInMonth(value));
    result.setHours(23, 59, 59, 999);
    return result;
  };
  public endOfWeek = (value: Date) => this.endOfDay(this.addDays(this.startOfWeek(value), 6));
  public endOfDay = (value: Date) => {
    const result = copy(value);
    result.setHours(23, 59, 59, 999);
    return result;
  };

  public addYears = (value: Date, amount: number) => this.addMonths(value, amount * 12);
  /** Clamps to the last day of the target month, like date-fns and Luxon: Jan 31 + 1 month is Feb 28. */
  public addMonths = (value: Date, amount: number) => {
    const result = copy(value);
    result.setDate(1);
    result.setMonth(result.getMonth() + amount);
    result.setDate(Math.min(value.getDate(), this.getDaysInMonth(result)));
    return result;
  };
  public addWeeks = (value: Date, amount: number) => this.addDays(value, amount * 7);
  public addDays = (value: Date, amount: number) => {
    const result = copy(value);
    result.setDate(result.getDate() + amount);
    return result;
  };
  public addHours = (value: Date, amount: number) => new Date(value.getTime() + amount * 3_600_000);
  public addMinutes = (value: Date, amount: number) => new Date(value.getTime() + amount * 60_000);
  public addSeconds = (value: Date, amount: number) => new Date(value.getTime() + amount * 1000);

  public getYear = (value: Date) => value.getFullYear();
  public getMonth = (value: Date) => value.getMonth();
  public getDate = (value: Date) => value.getDate();
  public getHours = (value: Date) => value.getHours();
  public getMinutes = (value: Date) => value.getMinutes();
  public getSeconds = (value: Date) => value.getSeconds();
  public getMilliseconds = (value: Date) => value.getMilliseconds();

  /** Clamps the day when the target month is shorter (Feb 29 to a common year is Feb 28). */
  public setYear = (value: Date, year: number) => {
    const result = copy(value);
    result.setFullYear(year, value.getMonth(), 1);
    result.setDate(Math.min(value.getDate(), this.getDaysInMonth(result)));
    return result;
  };
  public setMonth = (value: Date, month: number) => {
    const result = copy(value);
    result.setMonth(month, 1);
    result.setDate(Math.min(value.getDate(), this.getDaysInMonth(result)));
    return result;
  };
  public setDate = (value: Date, date: number) => {
    const result = copy(value);
    result.setDate(date);
    return result;
  };
  public setHours = (value: Date, hours: number) => {
    const result = copy(value);
    result.setHours(hours);
    return result;
  };
  public setMinutes = (value: Date, minutes: number) => {
    const result = copy(value);
    result.setMinutes(minutes);
    return result;
  };
  public setSeconds = (value: Date, seconds: number) => {
    const result = copy(value);
    result.setSeconds(seconds);
    return result;
  };
  public setMilliseconds = (value: Date, milliseconds: number) => {
    const result = copy(value);
    result.setMilliseconds(milliseconds);
    return result;
  };

  public getDaysInMonth = (value: Date) =>
    new Date(value.getFullYear(), value.getMonth() + 1, 0).getDate();

  public getWeekArray = (value: Date) => {
    const start = this.startOfWeek(this.startOfMonth(value));
    const end = this.endOfWeek(this.endOfMonth(value));
    const weeks: Date[][] = [];
    let current = start;
    for (let count = 0; current < end; count += 1) {
      const week = (weeks[Math.floor(count / 7)] ??= []);
      week.push(current);
      current = this.addDays(current, 1);
    }
    return weeks;
  };

  /** Week of the year, where week 1 holds January 1 (the date-fns default for `getWeek`). */
  public getWeekNumber = (value: Date) => {
    const yearStart = this.startOfWeek(this.startOfYear(value));
    const weekStart = this.startOfWeek(value);
    const nextYearStart = this.startOfWeek(this.startOfYear(this.addYears(value, 1)));
    // the last days of December can belong to week 1 of the next year
    if (weekStart >= nextYearStart) return 1;
    return Math.round((weekStart.getTime() - yearStart.getTime()) / (7 * 86_400_000)) + 1;
  };

  public getDayOfWeek = (value: Date) => ((value.getDay() - this.weekStartsOn + 7) % 7) + 1;
}
