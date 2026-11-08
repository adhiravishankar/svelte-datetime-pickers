/**
 * The date operations the utilities need, over any date type `T` (`Date`, a date-fns `Date`, a
 * Luxon `DateTime`, ...). The shape follows `MuiPickersAdapter` from `@mui/x-date-pickers`, cut
 * down to what a calendar and a date input use. Months are 0-based in every adapter.
 */
export interface DateAdapter<T> {
  /** Name of the library behind the adapter. */
  readonly lib: string;

  /** The current time, or the date parsed from an ISO string. */
  date(value?: string): T;
  getInvalidDate(): T;
  isValid(value: T | null | undefined): value is T;
  toJsDate(value: T): Date;

  formatByString(value: T, format: string): string;
  parse(value: string, format: string): T | null;

  isEqual(value: T | null, comparing: T | null): boolean;
  isSameYear(value: T, comparing: T): boolean;
  isSameMonth(value: T, comparing: T): boolean;
  isSameDay(value: T, comparing: T): boolean;
  isAfter(value: T, comparing: T): boolean;
  isBefore(value: T, comparing: T): boolean;
  isWithinRange(value: T, range: [T, T]): boolean;

  startOfYear(value: T): T;
  startOfMonth(value: T): T;
  startOfWeek(value: T): T;
  startOfDay(value: T): T;
  endOfYear(value: T): T;
  endOfMonth(value: T): T;
  endOfWeek(value: T): T;
  endOfDay(value: T): T;

  addYears(value: T, amount: number): T;
  addMonths(value: T, amount: number): T;
  addWeeks(value: T, amount: number): T;
  addDays(value: T, amount: number): T;
  addHours(value: T, amount: number): T;
  addMinutes(value: T, amount: number): T;
  addSeconds(value: T, amount: number): T;

  getYear(value: T): number;
  /** 0-based month. */
  getMonth(value: T): number;
  getDate(value: T): number;
  getHours(value: T): number;
  getMinutes(value: T): number;
  getSeconds(value: T): number;
  getMilliseconds(value: T): number;

  setYear(value: T, year: number): T;
  /** 0-based month. */
  setMonth(value: T, month: number): T;
  setDate(value: T, date: number): T;
  setHours(value: T, hours: number): T;
  setMinutes(value: T, minutes: number): T;
  setSeconds(value: T, seconds: number): T;
  setMilliseconds(value: T, milliseconds: number): T;

  getDaysInMonth(value: T): number;
  /** Weeks of the month of `value`, padded with days of the neighboring months. */
  getWeekArray(value: T): T[][];
  getWeekNumber(value: T): number;
  /** 1 to 7, from the first day of the week of the locale. */
  getDayOfWeek(value: T): number;
}
