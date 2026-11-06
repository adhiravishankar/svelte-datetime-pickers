import DateTimeRangePicker from './DateTimeRangePicker.svelte';

import type { ComponentProps } from 'svelte';

export type DateTimeRangePickerProps = ComponentProps<typeof DateTimeRangePicker>;
export type { CloseReason, Detail, LooseValue, OpenReason, Value } from './shared/types.js';
export { DateTimeRangePicker };

export default DateTimeRangePicker;
