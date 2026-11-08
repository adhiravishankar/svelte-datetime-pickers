import type { DateAdapter } from './types.js';

/** A date, or a year given as a number or numeric string. */
export type YearLike<T> = T | number | string;
/** A date, or a time string such as `10:30`, `10:30:15` or `10:30:15.5`. */
export type TimeLike<T> = T | string;

const padStart = (value: number | string, length = 2) => String(value).padStart(length, '0');

const isDateString = (value: unknown): value is string => typeof value === 'string';

/** Piece `index` (0 hours, 1 minutes, 2 seconds) of a time string that has at least `hh:mm`. */
const timePiece = (value: string, index: number) => {
  const pieces = value.split(':');
  return pieces.length >= 2 ? pieces[index] || (index === 0 ? undefined : '0') : undefined;
};

const parseTimePiece = (piece: string | undefined, name: string, value: string) => {
  const parsed = Number.parseInt(piece ?? '', 10);
  if (Number.isNaN(parsed)) throw new Error(`Failed to get ${name} from date: ${value}.`);
  return parsed;
};

/**
 * Builds the helpers of `@wojtekmaj/date-utils` (start, end, previous, next and range of a century,
 * decade, year, month and day, plus ISO-like local formatting) on top of any `DateAdapter`.
 */
export function createDateUtils<T>(adapter: DateAdapter<T>) {
  const ops = adapter;

  const yearOf = (value: YearLike<T>): number => {
    if (typeof value === 'number') return value;
    if (isDateString(value)) {
      const year = Number.parseInt(value, 10);
      if (!Number.isNaN(year)) return year;
      throw new Error(`Failed to get year from date: ${value}.`);
    }
    return ops.getYear(value);
  };

  /** A date to start from: the given one, or today moved to the given year. */
  const dateOf = (value: YearLike<T>): T =>
    typeof value === 'number' || isDateString(value)
      ? ops.setYear(ops.date(), yearOf(value))
      : value;

  // ---- getters

  const getYear = yearOf;
  const getMonth = (date: T) => ops.getMonth(date);
  const getMonthHuman = (date: T) => ops.getMonth(date) + 1;
  const getDate = (date: T) => ops.getDate(date);
  const getHours = (date: TimeLike<T>) =>
    isDateString(date) ? parseTimePiece(timePiece(date, 0), 'hours', date) : ops.getHours(date);
  const getMinutes = (date: TimeLike<T>) =>
    isDateString(date) ? parseTimePiece(timePiece(date, 1), 'minutes', date) : ops.getMinutes(date);
  const getSeconds = (date: TimeLike<T>) =>
    isDateString(date) ? parseTimePiece(timePiece(date, 2), 'seconds', date) : ops.getSeconds(date);
  const getMilliseconds = (date: TimeLike<T>) =>
    isDateString(date)
      ? parseTimePiece(
          timePiece(date, 2) === undefined ? undefined : timePiece(date, 2)!.split('.')[1] || '0',
          'milliseconds',
          date,
        )
      : ops.getMilliseconds(date);

  // ---- edges of a period

  type Edge = (date: YearLike<T>) => T;
  type Neighbor = (date: YearLike<T>, offset?: number) => T;

  const range = (start: Edge, end: Edge) => (date: YearLike<T>) =>
    [start(date), end(date)] as [T, T];

  /** Builds start, end, previous, next and range helpers of a period measured in `unit`s. */
  const period = (
    unit: number,
    startOf: (date: T) => T,
    endOf: (date: T) => T,
    shift: (date: T, amount: number) => T,
    alignStart: (date: T) => T = startOf,
  ) => {
    const start: Edge = (date) => alignStart(dateOf(date));
    const end: Edge = (date) => endOf(alignStart(dateOf(date)));
    const previous = (edge: Edge, offset: number): Neighbor => {
      return (date, amount = offset) => edge(shift(alignStart(dateOf(date)), amount));
    };
    return {
      start,
      end,
      previousStart: previous(start, -unit),
      nextStart: previous(start, unit),
      previousEnd: previous(end, -unit),
      nextEnd: previous(end, unit),
      range: range(start, end),
    };
  };

  // A century runs from year 1 to 100, 101 to 200, ...: 2001 to 2100 is the 21st. Same for decades.
  const alignedYear = (year: number, size: number) => year + ((-year + 1) % size);
  const alignedStart = (size: number) => (date: T) =>
    ops.startOfYear(ops.setYear(date, alignedYear(ops.getYear(date), size)));
  const alignedEnd = (size: number) => (date: T) =>
    ops.endOfYear(ops.addYears(ops.setYear(date, alignedYear(ops.getYear(date), size)), size - 1));

  const century = period(100, alignedStart(100), alignedEnd(100), ops.addYears, alignedStart(100));
  const decade = period(10, alignedStart(10), alignedEnd(10), ops.addYears, alignedStart(10));
  const year = period(1, ops.startOfYear, ops.endOfYear, ops.addYears);
  const month = period(1, ops.startOfMonth, ops.endOfMonth, ops.addMonths);
  const day = period(1, ops.startOfDay, ops.endOfDay, ops.addDays);

  const getDaysInMonth = (date: T) => ops.getDaysInMonth(date);

  // ---- ISO-like local formatting

  const getHoursMinutes = (date: TimeLike<T>) =>
    `${padStart(getHours(date))}:${padStart(getMinutes(date))}`;
  const getHoursMinutesSeconds = (date: TimeLike<T>) =>
    `${getHoursMinutes(date)}:${padStart(getSeconds(date))}`;
  const getISOLocalMonth = (date: T) =>
    `${padStart(ops.getYear(date), 4)}-${padStart(getMonthHuman(date))}`;
  const getISOLocalDate = (date: T) => `${getISOLocalMonth(date)}-${padStart(ops.getDate(date))}`;
  const getISOLocalDateTime = (date: T) =>
    `${getISOLocalDate(date)}T${getHoursMinutesSeconds(date)}`;

  return {
    adapter,

    getYear,
    getMonth,
    getMonthHuman,
    getDate,
    getHours,
    getMinutes,
    getSeconds,
    getMilliseconds,

    getCenturyStart: century.start,
    getPreviousCenturyStart: century.previousStart,
    getNextCenturyStart: century.nextStart,
    getCenturyEnd: century.end,
    getPreviousCenturyEnd: century.previousEnd,
    getNextCenturyEnd: century.nextEnd,
    getCenturyRange: century.range,

    getDecadeStart: decade.start,
    getPreviousDecadeStart: decade.previousStart,
    getNextDecadeStart: decade.nextStart,
    getDecadeEnd: decade.end,
    getPreviousDecadeEnd: decade.previousEnd,
    getNextDecadeEnd: decade.nextEnd,
    getDecadeRange: decade.range,

    getYearStart: year.start,
    getPreviousYearStart: year.previousStart,
    getNextYearStart: year.nextStart,
    getYearEnd: year.end,
    getPreviousYearEnd: year.previousEnd,
    getNextYearEnd: year.nextEnd,
    getYearRange: year.range,

    getMonthStart: month.start,
    getPreviousMonthStart: month.previousStart,
    getNextMonthStart: month.nextStart,
    getMonthEnd: month.end,
    getPreviousMonthEnd: month.previousEnd,
    getNextMonthEnd: month.nextEnd,
    getMonthRange: month.range,

    getDayStart: day.start,
    getPreviousDayStart: day.previousStart,
    getNextDayStart: day.nextStart,
    getDayEnd: day.end,
    getPreviousDayEnd: day.previousEnd,
    getNextDayEnd: day.nextEnd,
    getDayRange: day.range,

    getDaysInMonth,
    getHoursMinutes,
    getHoursMinutesSeconds,
    getISOLocalMonth,
    getISOLocalDate,
    getISOLocalDateTime,
  };
}

export type DateUtils<T> = ReturnType<typeof createDateUtils<T>>;
