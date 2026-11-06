import DateInput from './DateInput.svelte';
import Divider from './Divider.svelte';
import SegmentedInput from './SegmentedInput.svelte';
import SegmentInput from './SegmentInput.svelte';
import SegmentSelect from './SegmentSelect.svelte';

import type { ComponentProps } from 'svelte';

export type DateInputProps = ComponentProps<typeof DateInput>;
export type SegmentedInputProps = ComponentProps<typeof SegmentedInput>;
export type {
  DateDetail,
  InputDetail,
  InputKind,
  LooseValuePiece,
  SegmentName,
  TimeDetail,
} from './shared/types.js';
export type { FormatPart } from './shared/format.js';
export {
  getAmPmLabels,
  getDefaultFormatParts,
  getMonthNames,
  parseFormat,
} from './shared/format.js';
export { DateInput, Divider, SegmentedInput, SegmentInput, SegmentSelect };

export default DateInput;
