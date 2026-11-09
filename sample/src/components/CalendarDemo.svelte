<script lang="ts">
  import Calendar from 'svelte-range-calendar';
  import { AdapterDate } from 'svelte-date-utils';
  import { provideDateAdapter } from 'svelte-date-utils/svelte';

  const adapter = new AdapterDate();
  provideDateAdapter(adapter);
  let value = $state<unknown>(null);
</script>

<section class="Sample__section">
  <h2>svelte-range-calendar</h2>
  <Calendar selectRange onChange={(next) => (value = next)} />
  <output>
    {Array.isArray(value) ? value.map((d) => d?.toDateString()).join(' – ') : 'no range selected'}
  </output>
</section>
