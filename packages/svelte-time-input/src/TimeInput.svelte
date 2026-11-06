<script lang="ts">
  import { SegmentedInput } from 'svelte-date-input';

  import type { ComponentProps } from 'svelte';
  import type { LooseValuePiece, TimeDetail } from 'svelte-date-input';

  type TimeInputProps = Omit<
    ComponentProps<typeof SegmentedInput>,
    | 'dayAriaLabel'
    | 'dayPlaceholder'
    | 'kind'
    | 'maxDate'
    | 'maxDetail'
    | 'minDate'
    | 'monthAriaLabel'
    | 'monthPlaceholder'
    | 'onChange'
    | 'value'
    | 'yearAriaLabel'
    | 'yearPlaceholder'
  > & {
    /**
     * The most detailed field the user shall see.
     *
     * @default 'minute'
     */
    maxDetail?: TimeDetail;
    /**
     * Function called when the user picks a valid time, as an `HH:mm` (or `HH:mm:ss`) string.
     */
    onChange?: (value: string | null, shouldCloseWidgets: boolean) => void;
    /**
     * Time as an `HH:mm[:ss]` string or a Date.
     */
    value?: LooseValuePiece;
  };

  let { onChange, ...props }: TimeInputProps = $props();
</script>

<SegmentedInput
  {...props}
  kind="time"
  onChange={(value, shouldCloseWidgets) => onChange?.(value as string | null, shouldCloseWidgets)}
/>
