import { getISOLocalDate, getISOLocalDateTime } from 'svelte-date-utils';

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

export function fieldsFromDate(date: Date, use12Hours: boolean): Fields {
  const hours = date.getHours();

  return {
    amPm: hours >= 12 ? 'pm' : 'am',
    day: String(date.getDate()),
    hour: String(use12Hours ? hours % 12 || 12 : hours),
    minute: String(date.getMinutes()),
    month: String(date.getMonth() + 1),
    second: String(date.getSeconds()),
    year: String(date.getFullYear()),
  };
}

function floorTo(date: Date, detail: InputDetail): Date {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  switch (detail) {
    case 'year':
      return new Date(year, 0, 1);
    case 'month':
      return new Date(year, month, day);
    case 'hour':
      return new Date(year, month, day, date.getHours());
    case 'minute':
      return new Date(year, month, day, date.getHours(), date.getMinutes());
    case 'second':
      return new Date(year, month, day, date.getHours(), date.getMinutes(), date.getSeconds());
  }
}

export type ComposeResult =
  | { status: 'empty' }
  | { status: 'partial' }
  | { status: 'invalid' }
  | { status: 'valid'; date: Date };

type ComposeOptions = {
  detail: InputDetail;
  fields: Fields;
  max?: Date;
  min?: Date;
  present: ReadonlySet<SegmentName>;
  use12Hours: boolean;
};

/**
 * Builds a Date from field values. Fields excluded from the format fall back to
 * the current year, January, the 1st, and 00:00:00.
 */
export function composeDate({
  detail,
  fields,
  max,
  min,
  present,
  use12Hours,
}: ComposeOptions): ComposeResult {
  const names = [...new Set([...present].map((segment) => fieldBySegment[segment]))];
  const filled = names.filter((name) => fields[name] !== '');

  if (filled.length === 0) {
    return { status: 'empty' };
  }

  if (filled.length < names.length) {
    return { status: 'partial' };
  }

  const hasHour = present.has('hour12') || present.has('hour24');
  const year = present.has('year') ? Number(fields.year) : new Date().getFullYear();
  const month = present.has('month') ? Number(fields.month) - 1 : 0;
  const day = present.has('day') ? Number(fields.day) : 1;
  let hour = hasHour ? Number(fields.hour) : 0;
  const minute = present.has('minute') ? Number(fields.minute) : 0;
  const second = present.has('second') ? Number(fields.second) : 0;

  const numbers = [year, month, day, hour, minute, second];

  if (numbers.some((value) => !Number.isInteger(value))) {
    return { status: 'invalid' };
  }

  if (use12Hours) {
    if (hour < 1 || hour > 12) {
      return { status: 'invalid' };
    }

    hour = (hour % 12) + (fields.amPm === 'pm' ? 12 : 0);
  } else if (hour < 0 || hour > 23) {
    return { status: 'invalid' };
  }

  if (year < 1 || month < 0 || month > 11 || day < 1 || day > 31) {
    return { status: 'invalid' };
  }

  if (minute < 0 || minute > 59 || second < 0 || second > 59) {
    return { status: 'invalid' };
  }

  const date = new Date(0);
  date.setFullYear(year, month, day);
  date.setHours(hour, minute, second, 0);

  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
    return { status: 'invalid' };
  }

  const floored = floorTo(date, detail).getTime();

  if (
    (min && floored < floorTo(min, detail).getTime()) ||
    (max && floored > floorTo(max, detail).getTime())
  ) {
    return { status: 'invalid' };
  }

  return { date, status: 'valid' };
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function parseTime(
  value: string,
): { hours: number; minutes: number; seconds: number } | null {
  const match = /^(\d{1,2}):(\d{2})(?::(\d{2}))?/.exec(value);

  if (!match) {
    return null;
  }

  return {
    hours: Number(match[1]),
    minutes: Number(match[2]),
    seconds: Number(match[3] ?? 0),
  };
}

export function formatTime(date: Date, detail: InputDetail): string {
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`;

  return detail === 'second' ? `${time}:${pad(date.getSeconds())}` : time;
}

/**
 * Converts a loose value to a Date. For the `time` kind, `"HH:mm[:ss]"` strings are
 * accepted and resolved against today's date.
 */
export function valueToDate(value: LooseValuePiece | undefined, kind: InputKind): Date | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (kind === 'time' && typeof value === 'string') {
    const time = parseTime(value);

    if (!time) {
      return null;
    }

    const date = new Date();
    date.setHours(time.hours, time.minutes, time.seconds, 0);

    return date;
  }

  const date = value instanceof Date ? value : new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

export function toNativeValue(date: Date, kind: InputKind, detail: InputDetail): string {
  switch (kind) {
    case 'date':
      return getISOLocalDate(date);
    case 'time':
      return formatTime(date, detail);
    case 'datetime':
      return getISOLocalDateTime(date).slice(0, detail === 'second' ? 19 : 16);
  }
}

export function fromNativeValue(value: string, kind: InputKind): Date | null {
  if (!value) {
    return null;
  }

  if (kind === 'time') {
    return valueToDate(value, 'time');
  }

  if (kind === 'date') {
    const [year, month, day] = value.split('-').map(Number);

    if (!year || !month || !day) {
      return null;
    }

    const date = new Date(0);
    date.setFullYear(year, month - 1, day);
    date.setHours(0, 0, 0, 0);

    return date;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}
