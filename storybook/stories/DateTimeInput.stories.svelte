<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { DateTimeInput } from 'svelte-datetime-input';

  const { Story } = defineMeta({
    title: 'svelte-datetime-input/DateTimeInput',
    component: DateTimeInput,
  });

  const fixed = new Date(2024, 5, 15, 10, 10, 30);
</script>

<script lang="ts">
  import { AdapterDate } from 'svelte-date-utils';
  import { provideDateAdapter } from 'svelte-date-utils/svelte';

  provideDateAdapter(new AdapterDate());
</script>

<Story name="Default" args={{ value: fixed }} />
<Story name="With seconds" args={{ value: fixed, maxDetail: 'second' }} />
<Story name="Min and max date" args={{ value: fixed, minDate: new Date(2024, 5, 1), maxDate: new Date(2024, 5, 30) }} />
<Story name="Disabled" args={{ value: fixed, disabled: true }} />
