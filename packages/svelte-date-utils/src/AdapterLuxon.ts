// Adapted from AdapterLuxon in @mui/x-date-pickers, which is based on @date-io/luxon.
// MIT License, Copyright (c) 2017 Dmitriy Kovalenko. See LICENSE.
import { DateTime } from 'luxon';

import type { DateAdapter } from './types.js';

export interface AdapterLuxonOptions {
  /** A locale such as `de` or `en-GB`. Defaults to `en-US`. */
  locale?: string;
}

/** Adapter for Luxon v3. Values are `DateTime` objects, in the zone they were created in. */
export class AdapterLuxon implements DateAdapter<DateTime> {
  public readonly lib = 'luxon';

  public readonly locale: string;

  constructor({ locale }: AdapterLuxonOptions = {}) {
    this.locale = locale || 'en-US';
  }

  private withLocale = (value: DateTime) =>
    value.locale === this.locale ? value : value.setLocale(this.locale);

  public date = (value?: string) =>
    value === undefined
      ? DateTime.now().setLocale(this.locale)
      : DateTime.fromISO(value, { locale: this.locale });
  public getInvalidDate = () => DateTime.fromJSDate(new Date('Invalid Date'));
  public isValid = (value: DateTime | null | undefined): value is DateTime =>
    value != null && value.isValid;
  public toJsDate = (value: DateTime) => value.toJSDate();

  public formatByString = (value: DateTime, format: string) =>
    value.setLocale(this.locale).toFormat(format);
  public parse = (value: string, format: string) =>
    value === '' ? null : DateTime.fromFormat(value, format, { locale: this.locale });

  public isEqual = (value: DateTime | null, comparing: DateTime | null) =>
    value === null || comparing === null ? value === comparing : +value === +comparing;
  // the comparison happens in the zone of `value`
  public isSameYear = (value: DateTime, comparing: DateTime) =>
    value.hasSame(comparing.setZone(value.zone), 'year');
  public isSameMonth = (value: DateTime, comparing: DateTime) =>
    value.hasSame(comparing.setZone(value.zone), 'month');
  public isSameDay = (value: DateTime, comparing: DateTime) =>
    value.hasSame(comparing.setZone(value.zone), 'day');
  public isAfter = (value: DateTime, comparing: DateTime) => value > comparing;
  public isBefore = (value: DateTime, comparing: DateTime) => value < comparing;
  public isWithinRange = (value: DateTime, [start, end]: [DateTime, DateTime]) =>
    value >= start && value <= end;

  public startOfYear = (value: DateTime) => value.startOf('year');
  public startOfMonth = (value: DateTime) => value.startOf('month');
  public startOfWeek = (value: DateTime) =>
    this.withLocale(value).startOf('week', { useLocaleWeeks: true });
  public startOfDay = (value: DateTime) => value.startOf('day');
  public endOfYear = (value: DateTime) => value.endOf('year');
  public endOfMonth = (value: DateTime) => value.endOf('month');
  public endOfWeek = (value: DateTime) =>
    this.withLocale(value).endOf('week', { useLocaleWeeks: true });
  public endOfDay = (value: DateTime) => value.endOf('day');

  public addYears = (value: DateTime, amount: number) => value.plus({ years: amount });
  public addMonths = (value: DateTime, amount: number) => value.plus({ months: amount });
  public addWeeks = (value: DateTime, amount: number) => value.plus({ weeks: amount });
  public addDays = (value: DateTime, amount: number) => value.plus({ days: amount });
  public addHours = (value: DateTime, amount: number) => value.plus({ hours: amount });
  public addMinutes = (value: DateTime, amount: number) => value.plus({ minutes: amount });
  public addSeconds = (value: DateTime, amount: number) => value.plus({ seconds: amount });

  public getYear = (value: DateTime) => value.year;
  // Luxon months are 1-based
  public getMonth = (value: DateTime) => value.month - 1;
  public getDate = (value: DateTime) => value.day;
  public getHours = (value: DateTime) => value.hour;
  public getMinutes = (value: DateTime) => value.minute;
  public getSeconds = (value: DateTime) => value.second;
  public getMilliseconds = (value: DateTime) => value.millisecond;

  public setYear = (value: DateTime, year: number) => value.set({ year });
  public setMonth = (value: DateTime, month: number) => value.set({ month: month + 1 });
  public setDate = (value: DateTime, date: number) => value.set({ day: date });
  public setHours = (value: DateTime, hour: number) => value.set({ hour });
  public setMinutes = (value: DateTime, minute: number) => value.set({ minute });
  public setSeconds = (value: DateTime, second: number) => value.set({ second });
  public setMilliseconds = (value: DateTime, millisecond: number) => value.set({ millisecond });

  public getDaysInMonth = (value: DateTime) => value.daysInMonth!;

  public getWeekArray = (value: DateTime) => {
    const first = this.startOfWeek(this.startOfMonth(value));
    const last = this.endOfWeek(this.endOfMonth(value));
    const days = Math.round(last.diff(first, 'days').days);

    const weeks: DateTime[][] = [];
    for (let day = 0; day < days; day += 1) {
      const week = (weeks[Math.floor(day / 7)] ??= []);
      week.push(first.plus({ days: day }));
    }
    return weeks;
  };

  public getWeekNumber = (value: DateTime) =>
    this.withLocale(value).localWeekNumber ?? value.weekNumber;

  public getDayOfWeek = (value: DateTime) => this.withLocale(value).localWeekday ?? value.weekday;
}
