<script lang="ts">
  import Calendar from 'svelte-range-calendar';

  let value = $state<unknown>(null);
</script>

<section class="Sample__section">
  <h2>svelte-range-calendar</h2>
  <Calendar selectRange onChange={(next) => (value = next)} />
  <output>
    {Array.isArray(value) ? value.map((d) => d?.toDateString()).join(' – ') : 'no range selected'}
  </output>
</section>
