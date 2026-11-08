<script lang="ts">
  import { getISOLocalDateTime } from 'svelte-date-utils';

  import type { LooseValue } from './shared/types.js';

  let { value = $bindable() }: { value?: LooseValue } = $props();

  const uid = $props.id();

  const startDate = $derived(Array.isArray(value) ? value[0] : value);
  const endDate = $derived(Array.isArray(value) ? value[1] : null);

  function setStartValue(nextStartDate: string | Date | null) {
    if (!nextStartDate) {
      value = endDate;
      return;
    }

    value = Array.isArray(value) ? [nextStartDate, endDate] : nextStartDate;
  }

  function setEndValue(nextEndDate: string | Date | null) {
    if (!nextEndDate) {
      value = startDate || null;
      return;
    }

    value = [startDate || null, nextEndDate];
  }

  function toInputValue(date: string | Date | null | undefined) {
    return date && date instanceof Date ? getISOLocalDateTime(date) : date || undefined;
  }

  function toDate(inputValue: string) {
    return inputValue ? new Date(inputValue) : null;
  }
</script>

<fieldset>
  <legend>Value options</legend>

  <div>
    <label for="{uid}-start">Start date</label>
    <input
      id="{uid}-start"
      onchange={(event) => setStartValue(toDate(event.currentTarget.value))}
      type="datetime-local"
      value={toInputValue(startDate)}
    />
    &nbsp;
    <button onclick={() => setStartValue(null)} type="button">Clear to null</button>
    <button onclick={() => setStartValue('')} type="button">Clear to empty string</button>
  </div>

  <div>
    <label for="{uid}-end">End date</label>
    <input
      id="{uid}-end"
      onchange={(event) => setEndValue(toDate(event.currentTarget.value))}
      type="datetime-local"
      value={toInputValue(endDate)}
    />
    &nbsp;
    <button onclick={() => setEndValue(null)} type="button">Clear to null</button>
    <button onclick={() => setEndValue('')} type="button">Clear to empty string</button>
  </div>
</fieldset>
