<script lang="ts">
  import DateTimeInput from 'svelte-datetime-input';

  let value = $state<Date | null>(new Date());
</script>

<section class="Sample__section">
  <h2>svelte-datetime-input</h2>
  <DateTimeInput maxDetail="second" onChange={(next) => (value = next)} {value} />
  <output>{value ? value.toISOString() : 'null'}</output>
</section>
