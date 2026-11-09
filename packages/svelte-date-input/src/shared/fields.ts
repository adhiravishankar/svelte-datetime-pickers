import { createDateUtils } from 'svelte-date-utils';
import type { DateAdapter } from 'svelte-date-utils';

import type { InputDetail, InputKind, LooseValuePiece, SegmentName } from './types.js';

export type Fields = {
  amPm: '' | 'am' | 'pm';
  day: string;
  hour: string;
  minute: string;
  month: string;
  second: string;
  year: string;
};

export type FieldName = keyof Fields;

export const fieldBySegment: Record<SegmentName, FieldName> = {
  amPm: 'amPm',
  day: 'day',
  hour12: 'hour',
  hour24: 'hour',
  minute: 'minute',
  month: 'month',
  second: 'second',
  year: 'year',
};

export function emptyFields(): Fields {
  return { amPm: '', day: '', hour: '', minute: '', month: '', second: '', year: '' };
}

export function fieldsFromDate<T>(adapter: DateAdapter<T>, date: T, use12Hours: boolean): Fields {
  const hours = adapter.getHours(date);
  return {
    amPm: hours >= 12 ? 'pm' : 'am',
    day: String(adapter.getDate(date)),
    hour: String(use12Hours ? hours % 12 || 12 : hours),
    minute: String(adapter.getMinutes(date)),
    month: String(adapter.getMonth(date) + 1),
    second: String(adapter.getSeconds(date)),
    year: String(adapter.getYear(date)),
  };
}

function floorTo<T>(adapter: DateAdapter<T>, date: T, detail: InputDetail): T {
  let result = adapter.setDate(
    adapter.setMonth(adapter.setYear(date, adapter.getYear(date)), adapter.getMonth(date)),
    adapter.getDate(date),
  );
  if (detail === 'year') result = adapter.setMonth(adapter.setDate(result, 1), 0);
  if (detail === 'hour' || detail === 'minute' || detail === 'second')
    result = adapter.setHours(result, adapter.getHours(date));
  if (detail === 'minute' || detail === 'second')
    result = adapter.setMinutes(result, adapter.getMinutes(date));
  if (detail === 'second') result = adapter.setSeconds(result, adapter.getSeconds(date));
  return result;
}

export type ComposeResult<T> =
  | { status: 'empty' }
  | { status: 'partial' }
  | { status: 'invalid' }
  | { status: 'valid'; date: T };

type ComposeOptions<T> = {
  adapter: DateAdapter<T>;
  detail: InputDetail;
  fields: Fields;
  max?: T;
  min?: T;
  present: ReadonlySet<SegmentName>;
  use12Hours: boolean;
};

export function composeDate<T>({
  adapter,
  detail,
  fields,
  max,
  min,
  present,
  use12Hours,
}: ComposeOptions<T>): ComposeResult<T> {
  const names = [...new Set([...present].map((segment) => fieldBySegment[segment]))];
  const filled = names.filter((name) => fields[name] !== '');
  if (filled.length === 0) return { status: 'empty' };
  if (filled.length < names.length) return { status: 'partial' };

  const hasHour = present.has('hour12') || present.has('hour24');
  const today = adapter.date();
  const year = present.has('year') ? Number(fields.year) : adapter.getYear(today);
  const month = present.has('month') ? Number(fields.month) - 1 : 0;
  const day = present.has('day') ? Number(fields.day) : 1;
  let hour = hasHour ? Number(fields.hour) : 0;
  const minute = present.has('minute') ? Number(fields.minute) : 0;
  const second = present.has('second') ? Number(fields.second) : 0;
  if ([year, month, day, hour, minute, second].some((value) => !Number.isInteger(value)))
    return { status: 'invalid' };

  if (use12Hours) {
    if (hour < 1 || hour > 12) return { status: 'invalid' };
    hour = (hour % 12) + (fields.amPm === 'pm' ? 12 : 0);
  } else if (hour < 0 || hour > 23) return { status: 'invalid' };
  if (year < 1 || month < 0 || month > 11 || day < 1 || day > 31) return { status: 'invalid' };
  if (minute < 0 || minute > 59 || second < 0 || second > 59) return { status: 'invalid' };

  let date = adapter.setYear(today, year);
  date = adapter.setMonth(date, month);
  date = adapter.setDate(date, day);
  date = adapter.setHours(date, hour);
  date = adapter.setMinutes(date, minute);
  date = adapter.setSeconds(date, second);
  date = adapter.setMilliseconds(date, 0);
  if (
    adapter.getYear(date) !== year ||
    adapter.getMonth(date) !== month ||
    adapter.getDate(date) !== day ||
    !adapter.isValid(date)
  )
    return { status: 'invalid' };

  const floored = floorTo(adapter, date, detail);
  if (
    (min && adapter.isBefore(floored, floorTo(adapter, min, detail))) ||
    (max && adapter.isAfter(floored, floorTo(adapter, max, detail)))
  )
    return { status: 'invalid' };
  return { date, status: 'valid' };
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function parseTime(
  value: string,
): { hours: number; minutes: number; seconds: number } | null {
  const match = /^(\d{1,2}):(\d{2})(?::(\d{2}))?/.exec(value);
  return match
    ? { hours: Number(match[1]), minutes: Number(match[2]), seconds: Number(match[3] ?? 0) }
    : null;
}

export function formatTime<T>(adapter: DateAdapter<T>, date: T, detail: InputDetail): string {
  const time = `${pad(adapter.getHours(date))}:${pad(adapter.getMinutes(date))}`;
  return detail === 'second' ? `${time}:${pad(adapter.getSeconds(date))}` : time;
}

export function valueToDate<T>(
  adapter: DateAdapter<T>,
  value: LooseValuePiece<T> | undefined,
  kind: InputKind,
): T | null {
  if (value === null || value === undefined || value === '') return null;
  if (kind === 'time' && typeof value === 'string') {
    const time = parseTime(value);
    if (!time) return null;
    let date = adapter.date();
    date = adapter.setHours(date, time.hours);
    date = adapter.setMinutes(date, time.minutes);
    date = adapter.setSeconds(date, time.seconds);
    return date;
  }
  const date = typeof value === 'string' ? adapter.date(value) : value;
  return adapter.isValid(date) ? date : null;
}

export function toNativeValue<T>(
  adapter: DateAdapter<T>,
  date: T,
  kind: InputKind,
  detail: InputDetail,
): string {
  const utils = createDateUtils(adapter);
  switch (kind) {
    case 'date':
      return utils.getISOLocalDate(date);
    case 'time':
      return formatTime(adapter, date, detail);
    case 'datetime':
      return utils.getISOLocalDateTime(date).slice(0, detail === 'second' ? 19 : 16);
  }
}

export function fromNativeValue<T>(
  adapter: DateAdapter<T>,
  value: string,
  kind: InputKind,
): T | null {
  if (!value) return null;
  const date = kind === 'time' ? valueToDate(adapter, value, 'time') : adapter.date(value);
  return date && adapter.isValid(date) ? date : null;
}
