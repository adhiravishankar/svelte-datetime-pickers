<script lang="ts">
  import TimeInput from 'svelte-time-input';

  let value = $state<string | null>('10:10');
</script>

<section class="Sample__section">
  <h2>svelte-time-input</h2>
  <TimeInput maxDetail="second" onChange={(next) => (value = next)} {value} />
  <output>{value ?? 'null'}</output>
</section>
