<script lang="ts">
  import DateInput from 'svelte-date-input';
  import { AdapterDate } from 'svelte-date-utils';
  import { provideDateAdapter } from 'svelte-date-utils';

  const adapter = new AdapterDate();
  provideDateAdapter(adapter);
  let value = $state<Date | null>(new Date());
</script>

<section class="Sample__section">
  <h2>svelte-date-input</h2>
  <DateInput onChange={(next) => (value = next)} {value} />
  <output>{value ? value.toDateString() : 'null'}</output>
</section>
