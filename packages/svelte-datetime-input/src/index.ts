import DateTimeInput from './DateTimeInput.svelte';

import type { ComponentProps } from 'svelte';

export type DateTimeInputProps = ComponentProps<typeof DateTimeInput>;
export type { LooseValuePiece, TimeDetail } from 'svelte-date-input';
export { DateTimeInput };

export default DateTimeInput;
