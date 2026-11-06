import Calendar from './Calendar.svelte';

import type { ComponentProps } from 'svelte';

export type CalendarProps = ComponentProps<typeof Calendar>;
export type {
  CalendarType,
  Detail,
  LooseValue,
  NavigationLabelArgs,
  Range,
  ReturnValue,
  TileArgs,
  Value,
  View,
  ViewCallbackProperties,
} from './shared/types.js';
export type { Formatter } from './shared/formatters.js';
export { Calendar };

export default Calendar;
