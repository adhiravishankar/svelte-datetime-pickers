<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { DateInput } from 'svelte-date-input';

  const { Story } = defineMeta({
    title: 'svelte-date-input/DateInput',
    component: DateInput,
  });

  const fixed = new Date(2024, 5, 15, 10, 10, 30);
</script>

<script lang="ts">
  import { AdapterDate } from 'svelte-date-utils';
  import { provideDateAdapter } from 'svelte-date-utils';

  provideDateAdapter(new AdapterDate());
</script>

<Story name="Default" args={{ value: fixed }} />
<Story name="Empty" args={{}} />
<Story name="Custom format" args={{ value: fixed, format: 'dd/MM/y' }} />
<Story name="Disabled" args={{ value: fixed, disabled: true }} />
