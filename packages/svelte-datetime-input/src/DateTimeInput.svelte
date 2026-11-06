<script lang="ts">
  import { SegmentedInput } from 'svelte-date-input';

  import type { ComponentProps } from 'svelte';
  import type { LooseValuePiece, TimeDetail } from 'svelte-date-input';

  type DateTimeInputProps = Omit<
    ComponentProps<typeof SegmentedInput>,
    'kind' | 'maxDetail' | 'onChange' | 'value'
  > & {
    /**
     * The most detailed field the user shall see.
     *
     * @default 'minute'
     */
    maxDetail?: TimeDetail;
    /**
     * Function called when the user picks a valid datetime. Fields excluded by a custom `format` fall back to the current year, January, the 1st, and 00:00:00.
     */
    onChange?: (value: Date | null, shouldCloseWidgets: boolean) => void;
    value?: LooseValuePiece;
  };

  let { onChange, ...props }: DateTimeInputProps = $props();
</script>

<SegmentedInput
  {...props}
  kind="datetime"
  onChange={(value, shouldCloseWidgets) => onChange?.(value as Date | null, shouldCloseWidgets)}
/>
