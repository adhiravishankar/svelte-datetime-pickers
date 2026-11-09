<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { TimeInput } from 'svelte-time-input';

  const { Story } = defineMeta({
    title: 'svelte-time-input/TimeInput',
    component: TimeInput,
  });

  const fixed = new Date(2024, 5, 15, 10, 10, 30);
</script>

<script lang="ts">
  import { AdapterDate } from 'svelte-date-utils';
  import { provideDateAdapter } from 'svelte-date-utils/svelte';

  provideDateAdapter(new AdapterDate());
</script>

<Story name="Default" args={{ value: '10:10' }} />
<Story name="With seconds" args={{ value: '10:10:30', maxDetail: 'second' }} />
<Story name="Twelve-hour format" args={{ value: '15:45', format: 'hh:mm a' }} />
<Story name="Disabled" args={{ value: '10:10', disabled: true }} />
