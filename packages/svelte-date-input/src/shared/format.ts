import type { InputDetail, InputKind, SegmentName } from './types.js';

export type FormatPart =
  | { type: 'literal'; text: string }
  | { type: 'segment'; segment: SegmentName; token: string };

const tokenPattern = /y+|M{1,4}|d{1,2}|H{1,2}|h{1,2}|m{1,2}|s{1,2}|a|'(?:[^']|'')*'|[^yMdHhmsa']+/g;

const segmentByTokenLetter: Record<string, SegmentName> = {
  H: 'hour24',
  M: 'month',
  a: 'amPm',
  d: 'day',
  h: 'hour12',
  m: 'minute',
  s: 'second',
  y: 'year',
};

/**
 * Parses a format based on Unicode Technical Standard #35, e.g. `y-MM-dd h:mm:ss a`.
 */
export function parseFormat(format: string): FormatPart[] {
  const parts: FormatPart[] = [];

  for (const match of format.matchAll(tokenPattern)) {
    const text = match[0];
    const first = text.charAt(0);
    const segment = segmentByTokenLetter[first];

    if (first === "'") {
      parts.push({ type: 'literal', text: text.slice(1, -1).replace(/''/g, "'") });
    } else if (segment) {
      parts.push({ type: 'segment', segment, token: text });
    } else {
      parts.push({ type: 'literal', text });
    }
  }

  return parts;
}

/**
 * Builds the format a given locale uses, limited to the fields needed by the input kind and detail.
 */
export function getDefaultFormatParts(
  locale: string | undefined,
  kind: InputKind,
  detail: InputDetail,
): FormatPart[] {
  const options: Intl.DateTimeFormatOptions = {};

  if (kind !== 'time') {
    options.year = 'numeric';

    if (detail !== 'year') {
      options.month = 'numeric';
      options.day = 'numeric';
    }
  }

  if (kind !== 'date') {
    options.hour = 'numeric';

    if (detail === 'minute' || detail === 'second') {
      options.minute = 'numeric';
    }

    if (detail === 'second') {
      options.second = 'numeric';
    }
  }

  const formatter = new Intl.DateTimeFormat(locale, options);
  const uses12Hours = formatter.resolvedOptions().hour12 === true;

  const parts: FormatPart[] = [];

  for (const part of formatter.formatToParts(new Date(2017, 0, 1, 13, 2, 3))) {
    switch (part.type) {
      case 'year':
        parts.push({ type: 'segment', segment: 'year', token: 'y' });
        break;
      case 'month':
        parts.push({ type: 'segment', segment: 'month', token: 'M' });
        break;
      case 'day':
        parts.push({ type: 'segment', segment: 'day', token: 'd' });
        break;
      case 'hour':
        parts.push(
          uses12Hours
            ? { type: 'segment', segment: 'hour12', token: 'h' }
            : { type: 'segment', segment: 'hour24', token: 'H' },
        );
        break;
      case 'minute':
        parts.push({ type: 'segment', segment: 'minute', token: 'm' });
        break;
      case 'second':
        parts.push({ type: 'segment', segment: 'second', token: 's' });
        break;
      case 'dayPeriod':
        parts.push({ type: 'segment', segment: 'amPm', token: 'a' });
        break;
      case 'literal':
        parts.push({ type: 'literal', text: part.value });
        break;
      default:
    }
  }

  return parts;
}

export function getMonthNames(locale: string | undefined, style: 'long' | 'short'): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { month: style });

  return Array.from({ length: 12 }, (_, index) => formatter.format(new Date(2017, index, 1)));
}

export function getAmPmLabels(locale: string | undefined): [string, string] {
  const formatter = new Intl.DateTimeFormat(locale, { hour: 'numeric', hour12: true });
  const label = (hour: number) =>
    formatter.formatToParts(new Date(2017, 0, 1, hour)).find((part) => part.type === 'dayPeriod')
      ?.value ?? (hour < 12 ? 'AM' : 'PM');

  return [label(5), label(17)];
}
