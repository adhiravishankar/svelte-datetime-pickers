<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { DateTimeRangePicker } from 'svelte-datetimerange-picker';

  const { Story } = defineMeta({
    title: 'svelte-datetimerange-picker/DateTimeRangePicker',
    component: DateTimeRangePicker,
  });

  const fixed = new Date(2024, 5, 15, 10, 10, 30);
</script>

<script lang="ts">
  import { AdapterDate } from 'svelte-date-utils';
  import { provideDateAdapter } from 'svelte-date-utils';

  provideDateAdapter(new AdapterDate());
</script>

<Story name="Default" args={{ value: [new Date(2024, 5, 14), fixed] }} />
<Story name="Empty" args={{}} />
<Story name="Without calendar" args={{ value: [new Date(2024, 5, 14), fixed], disableCalendar: true }} />
<Story name="Without clock" args={{ value: [new Date(2024, 5, 14), fixed], disableClock: true }} />
<Story name="Disabled" args={{ value: [new Date(2024, 5, 14), fixed], disabled: true }} />
