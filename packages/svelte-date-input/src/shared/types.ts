export type InputKind = 'date' | 'time' | 'datetime';

export type SegmentName =
  | 'year'
  | 'month'
  | 'day'
  | 'hour12'
  | 'hour24'
  | 'minute'
  | 'second'
  | 'amPm';

export type DateDetail = 'year' | 'month';

export type TimeDetail = 'hour' | 'minute' | 'second';

export type InputDetail = DateDetail | TimeDetail;

export type LooseValuePiece = string | Date | null;
