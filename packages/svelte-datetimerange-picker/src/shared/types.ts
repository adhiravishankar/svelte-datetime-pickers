export type Range<T> = [T, T];

export type AmPmType = 'am' | 'pm';

export type CloseReason = 'buttonClick' | 'escape' | 'outsideAction' | 'select';

export type Detail = 'hour' | 'minute' | 'second';

type LooseValuePiece<T = Date> = string | T | null;

export type LooseValue<T = Date> = LooseValuePiece<T> | Range<LooseValuePiece<T>>;

export type OpenReason = 'buttonClick' | 'focus';

type ValuePiece<T = Date> = T | null;

export type Value<T = Date> = ValuePiece<T> | Range<ValuePiece<T>>;
