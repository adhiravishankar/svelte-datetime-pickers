<script lang="ts" generics="T">
  import { SegmentedInput } from 'svelte-date-input';

  import type { ComponentProps } from 'svelte';
  import type { DateAdapter } from 'svelte-date-utils';
  import type { TimeDetail } from 'svelte-date-input';

  type LooseValuePiece<T> = string | T | null;

  type DateTimeInputProps<T> = Omit<
    ComponentProps<typeof SegmentedInput>,
    'adapter' | 'kind' | 'maxDetail' | 'onChange' | 'value'
  > & {
    adapter: DateAdapter<T>;
    /**
     * The most detailed field the user shall see.
     *
     * @default 'minute'
     */
    maxDetail?: TimeDetail;
    /**
     * Function called when the user picks a valid datetime. Fields excluded by a custom `format` fall back to the current year, January, the 1st, and 00:00:00.
     */
    onChange?: (value: T | null, shouldCloseWidgets: boolean) => void;
    value?: LooseValuePiece<T>;
  };

  let { onChange, ...props }: DateTimeInputProps<T> = $props();
</script>

<SegmentedInput
  {...props}
  kind="datetime"
  onChange={(value, shouldCloseWidgets) => onChange?.(value as T | null, shouldCloseWidgets)}
/>
