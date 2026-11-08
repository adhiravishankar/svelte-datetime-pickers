// Adapted from AdapterDateFns in @mui/x-date-pickers, which is based on @date-io/date-fns.
// MIT License, Copyright (c) 2017 Dmitriy Kovalenko. See LICENSE.
import { addDays } from 'date-fns/addDays';
import { addHours } from 'date-fns/addHours';
import { addMinutes } from 'date-fns/addMinutes';
import { addMonths } from 'date-fns/addMonths';
import { addSeconds } from 'date-fns/addSeconds';
import { addWeeks } from 'date-fns/addWeeks';
import { addYears } from 'date-fns/addYears';
import { endOfDay } from 'date-fns/endOfDay';
import { endOfMonth } from 'date-fns/endOfMonth';
import { endOfWeek } from 'date-fns/endOfWeek';
import { endOfYear } from 'date-fns/endOfYear';
import { format } from 'date-fns/format';
import { getDate } from 'date-fns/getDate';
import { getDay } from 'date-fns/getDay';
import { getDaysInMonth } from 'date-fns/getDaysInMonth';
import { getHours } from 'date-fns/getHours';
import { getMilliseconds } from 'date-fns/getMilliseconds';
import { getMinutes } from 'date-fns/getMinutes';
import { getMonth } from 'date-fns/getMonth';
import { getSeconds } from 'date-fns/getSeconds';
import { getWeek } from 'date-fns/getWeek';
import { getYear } from 'date-fns/getYear';
import { isAfter } from 'date-fns/isAfter';
import { isBefore } from 'date-fns/isBefore';
import { isEqual } from 'date-fns/isEqual';
import { isSameDay } from 'date-fns/isSameDay';
import { isSameMonth } from 'date-fns/isSameMonth';
import { isSameYear } from 'date-fns/isSameYear';
import { isValid } from 'date-fns/isValid';
import { isWithinInterval } from 'date-fns/isWithinInterval';
import { enUS } from 'date-fns/locale/en-US';
import { parse } from 'date-fns/parse';
import { setDate } from 'date-fns/setDate';
import { setHours } from 'date-fns/setHours';
import { setMilliseconds } from 'date-fns/setMilliseconds';
import { setMinutes } from 'date-fns/setMinutes';
import { setMonth } from 'date-fns/setMonth';
import { setSeconds } from 'date-fns/setSeconds';
import { setYear } from 'date-fns/setYear';
import { startOfDay } from 'date-fns/startOfDay';
import { startOfMonth } from 'date-fns/startOfMonth';
import { startOfWeek } from 'date-fns/startOfWeek';
import { startOfYear } from 'date-fns/startOfYear';

import type { Locale } from 'date-fns/locale';

import type { DateAdapter } from './types.js';

export interface AdapterDateFnsOptions {
  /** A date-fns locale, for example `import { de } from 'date-fns/locale/de'`. Defaults to en-US. */
  locale?: Locale;
}

/** Adapter for date-fns v3 and v4. Values are native `Date` objects. */
export class AdapterDateFns implements DateAdapter<Date> {
  public readonly lib = 'date-fns';

  public readonly locale: Locale;

  constructor({ locale }: AdapterDateFnsOptions = {}) {
    this.locale = locale ?? enUS;
  }

  public date = (value?: string) => (value === undefined ? new Date() : new Date(value));
  public getInvalidDate = () => new Date('Invalid Date');
  public isValid = (value: Date | null | undefined): value is Date =>
    value != null && isValid(value);
  public toJsDate = (value: Date) => value;

  public formatByString = (value: Date, formatString: string) =>
    format(value, formatString, { locale: this.locale });
  public parse = (value: string, formatString: string) =>
    value === '' ? null : parse(value, formatString, new Date(), { locale: this.locale });

  public isEqual = (value: Date | null, comparing: Date | null) =>
    value === null || comparing === null ? value === comparing : isEqual(value, comparing);
  public isSameYear = (value: Date, comparing: Date) => isSameYear(value, comparing);
  public isSameMonth = (value: Date, comparing: Date) => isSameMonth(value, comparing);
  public isSameDay = (value: Date, comparing: Date) => isSameDay(value, comparing);
  public isAfter = (value: Date, comparing: Date) => isAfter(value, comparing);
  public isBefore = (value: Date, comparing: Date) => isBefore(value, comparing);
  public isWithinRange = (value: Date, [start, end]: [Date, Date]) =>
    isWithinInterval(value, { start, end });

  public startOfYear = (value: Date) => startOfYear(value);
  public startOfMonth = (value: Date) => startOfMonth(value);
  public startOfWeek = (value: Date) => startOfWeek(value, { locale: this.locale });
  public startOfDay = (value: Date) => startOfDay(value);
  public endOfYear = (value: Date) => endOfYear(value);
  public endOfMonth = (value: Date) => endOfMonth(value);
  public endOfWeek = (value: Date) => endOfWeek(value, { locale: this.locale });
  public endOfDay = (value: Date) => endOfDay(value);

  public addYears = (value: Date, amount: number) => addYears(value, amount);
  public addMonths = (value: Date, amount: number) => addMonths(value, amount);
  public addWeeks = (value: Date, amount: number) => addWeeks(value, amount);
  public addDays = (value: Date, amount: number) => addDays(value, amount);
  public addHours = (value: Date, amount: number) => addHours(value, amount);
  public addMinutes = (value: Date, amount: number) => addMinutes(value, amount);
  public addSeconds = (value: Date, amount: number) => addSeconds(value, amount);

  public getYear = (value: Date) => getYear(value);
  public getMonth = (value: Date) => getMonth(value);
  public getDate = (value: Date) => getDate(value);
  public getHours = (value: Date) => getHours(value);
  public getMinutes = (value: Date) => getMinutes(value);
  public getSeconds = (value: Date) => getSeconds(value);
  public getMilliseconds = (value: Date) => getMilliseconds(value);

  public setYear = (value: Date, year: number) => setYear(value, year);
  public setMonth = (value: Date, month: number) => setMonth(value, month);
  public setDate = (value: Date, date: number) => setDate(value, date);
  public setHours = (value: Date, hours: number) => setHours(value, hours);
  public setMinutes = (value: Date, minutes: number) => setMinutes(value, minutes);
  public setSeconds = (value: Date, seconds: number) => setSeconds(value, seconds);
  public setMilliseconds = (value: Date, milliseconds: number) =>
    setMilliseconds(value, milliseconds);

  public getDaysInMonth = (value: Date) => getDaysInMonth(value);

  public getWeekArray = (value: Date) => {
    const start = this.startOfWeek(this.startOfMonth(value));
    const end = this.endOfWeek(this.endOfMonth(value));

    const weeks: Date[][] = [];
    let current = start;
    for (let count = 0; this.isBefore(current, end); count += 1) {
      const week = (weeks[Math.floor(count / 7)] ??= []);
      week.push(current);
      current = this.addDays(current, 1);
    }
    return weeks;
  };

  public getWeekNumber = (value: Date) => getWeek(value, { locale: this.locale });

  public getDayOfWeek = (value: Date) =>
    ((getDay(value) - (this.locale.options?.weekStartsOn ?? 0) + 7) % 7) + 1;
}
