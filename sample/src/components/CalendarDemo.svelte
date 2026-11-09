<script lang="ts">
  import Calendar from 'svelte-range-calendar';
  import { AdapterDate } from 'svelte-date-utils';

  const adapter = new AdapterDate();
  let value = $state<unknown>(null);
</script>

<section class="Sample__section">
  <h2>svelte-range-calendar</h2>
  <Calendar {adapter} selectRange onChange={(next) => (value = next)} />
  <output>
    {Array.isArray(value) ? value.map((d) => d?.toDateString()).join(' – ') : 'no range selected'}
  </output>
</section>
