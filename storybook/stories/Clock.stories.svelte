<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Clock } from 'svelte-analog-clock';

  const { Story } = defineMeta({
    title: 'svelte-analog-clock/Clock',
    component: Clock,
  });

  const fixed = new Date(2024, 5, 15, 10, 10, 30);
</script>

<script lang="ts">
  import { AdapterDate } from 'svelte-date-utils';
  import { provideDateAdapter } from 'svelte-date-utils/svelte';

  provideDateAdapter(new AdapterDate());
</script>

<Story name="Default" args={{ value: fixed }} />
<Story name="With numbers" args={{ value: fixed, renderNumbers: true, size: 200 }} />
<Story name="With second hand" args={{ value: fixed, renderSecondHand: true, size: 200 }} />
<Story name="Live" args={{ value: new Date(), renderSecondHand: true, renderNumbers: true, size: 200 }} />
