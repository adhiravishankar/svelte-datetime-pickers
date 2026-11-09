export type Range<T> = [T, T];

export type CalendarType = 'gregory' | 'hebrew' | 'islamic' | 'iso8601';

export type View = 'century' | 'decade' | 'year' | 'month';

export type Detail = View;

export type DateType = View | 'day';

export type LooseValuePiece<T = Date> = string | T | null;

export type LooseValue<T = Date> = LooseValuePiece<T> | Range<LooseValuePiece<T>>;

export type ValuePiece<T = Date> = T | null;

export type Value<T = Date> = ValuePiece<T> | Range<ValuePiece<T>>;

export type ReturnValue = 'start' | 'end' | 'range';

export type NavigationAction =
  | 'prev'
  | 'prev2'
  | 'next'
  | 'next2'
  | 'onChange'
  | 'drillUp'
  | 'drillDown';

export type ViewCallbackProperties<T = Date> = {
  action: NavigationAction;
  activeStartDate: T | null;
  value: LooseValue<T> | undefined;
  view: View;
};

export type TileArgs<T = Date> = {
  activeStartDate: T;
  date: T;
  view: View;
};

export type NavigationLabelArgs<T = Date> = {
  date: T;
  label: string;
  locale: string | undefined;
  view: View;
};
