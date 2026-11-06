export type Range<T> = [T, T];

export type CalendarType = 'gregory' | 'hebrew' | 'islamic' | 'iso8601';

export type View = 'century' | 'decade' | 'year' | 'month';

export type Detail = View;

export type DateType = View | 'day';

export type LooseValuePiece = string | Date | null;

export type LooseValue = LooseValuePiece | Range<LooseValuePiece>;

export type ValuePiece = Date | null;

export type Value = ValuePiece | Range<ValuePiece>;

export type ReturnValue = 'start' | 'end' | 'range';

export type NavigationAction =
  | 'prev'
  | 'prev2'
  | 'next'
  | 'next2'
  | 'onChange'
  | 'drillUp'
  | 'drillDown';

export type ViewCallbackProperties = {
  action: NavigationAction;
  activeStartDate: Date | null;
  value: LooseValue | undefined;
  view: View;
};

export type TileArgs = {
  activeStartDate: Date;
  date: Date;
  view: View;
};

export type NavigationLabelArgs = {
  date: Date;
  label: string;
  locale: string | undefined;
  view: View;
};
