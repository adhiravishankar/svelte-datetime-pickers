<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Calendar } from 'svelte-range-calendar';

  const { Story } = defineMeta({
    title: 'svelte-range-calendar/Calendar',
    component: Calendar,
  });

  const fixed = new Date(2024, 5, 15, 10, 10, 30);
</script>

<script lang="ts">
  import { AdapterDate } from 'svelte-date-utils';
  import { provideDateAdapter } from 'svelte-date-utils/svelte';

  provideDateAdapter(new AdapterDate());
</script>

<Story name="Default" args={{ value: fixed }} />
<Story
  name="Range selection"
  args={{ selectRange: true, value: [new Date(2024, 5, 10), new Date(2024, 5, 20)] }}
/>
<Story
  name="Min and max date"
  args={{ value: fixed, minDate: new Date(2024, 5, 5), maxDate: new Date(2024, 5, 25) }}
/>
<Story name="Week numbers" args={{ value: fixed, showWeekNumbers: true }} />
