<script lang="ts" generics="T">
  import SegmentedInput from './SegmentedInput.svelte';

  import type { ComponentProps } from 'svelte';
  import type { DateAdapter } from 'svelte-date-utils';
  import type { DateDetail, LooseValuePiece } from './shared/types.js';

  type DateInputProps<T> = Omit<
    ComponentProps<typeof SegmentedInput>,
    | 'adapter'
    | 'hourAriaLabel'
    | 'hourPlaceholder'
    | 'kind'
    | 'maxDetail'
    | 'minuteAriaLabel'
    | 'minutePlaceholder'
    | 'onChange'
    | 'secondAriaLabel'
    | 'secondPlaceholder'
    | 'amPmAriaLabel'
    | 'value'
  > & {
    adapter: DateAdapter<T>;
    /**
     * The most detailed field the user shall see.
     *
     * @default 'month'
     */
    maxDetail?: DateDetail;
    onChange?: (value: T | null, shouldCloseWidgets: boolean) => void;
    value?: LooseValuePiece<T>;
  };

  let { onChange, ...props }: DateInputProps<T> = $props();
</script>

<SegmentedInput
  {...props}
  kind="date"
  onChange={(value, shouldCloseWidgets) => onChange?.(value as T | null, shouldCloseWidgets)}
/>
