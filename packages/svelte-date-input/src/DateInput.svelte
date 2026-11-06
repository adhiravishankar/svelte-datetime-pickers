<script lang="ts">
  import SegmentedInput from './SegmentedInput.svelte';

  import type { ComponentProps } from 'svelte';
  import type { DateDetail, LooseValuePiece } from './shared/types.js';

  type DateInputProps = Omit<
    ComponentProps<typeof SegmentedInput>,
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
    /**
     * The most detailed field the user shall see.
     *
     * @default 'month'
     */
    maxDetail?: DateDetail;
    onChange?: (value: Date | null, shouldCloseWidgets: boolean) => void;
    value?: LooseValuePiece;
  };

  let { onChange, ...props }: DateInputProps = $props();
</script>

<SegmentedInput
  {...props}
  kind="date"
  onChange={(value, shouldCloseWidgets) => onChange?.(value as Date | null, shouldCloseWidgets)}
/>
