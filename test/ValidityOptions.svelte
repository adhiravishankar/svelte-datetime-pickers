<script lang="ts">
  import { getISOLocalDate } from 'svelte-date-utils';

  type ValidityOptionsProps = {
    maxDate?: Date;
    minDate?: Date;
    required?: boolean;
  };

  let {
    maxDate = $bindable(),
    minDate = $bindable(),
    required = $bindable(),
  }: ValidityOptionsProps = $props();

  const uid = $props.id();

  function toDate(value: string) {
    return value ? new Date(value) : undefined;
  }
</script>

<fieldset>
  <legend>Minimum and maximum date</legend>

  <div>
    <label for="{uid}-min">Minimum date</label>
    <input
      id="{uid}-min"
      onchange={(event) => (minDate = toDate(event.currentTarget.value))}
      type="datetime-local"
      value={minDate ? getISOLocalDate(minDate) : ''}
    />
    &nbsp;
    <button onclick={() => (minDate = undefined)} type="button">Clear</button>
  </div>

  <div>
    <label for="{uid}-max">Maximum date</label>
    <input
      id="{uid}-max"
      onchange={(event) => (maxDate = toDate(event.currentTarget.value))}
      type="datetime-local"
      value={maxDate ? getISOLocalDate(maxDate) : ''}
    />
    &nbsp;
    <button onclick={() => (maxDate = undefined)} type="button">Clear</button>
  </div>

  <div>
    <input bind:checked={required} id="{uid}-required" type="checkbox" />
    <label for="{uid}-required">Required</label>
  </div>
</fieldset>
