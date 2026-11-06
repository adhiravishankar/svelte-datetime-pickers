<script lang="ts">
  import Clock from 'svelte-analog-clock';

  let value = $state(new Date());

  $effect(() => {
    const id = setInterval(() => (value = new Date()), 1000);
    return () => clearInterval(id);
  });
</script>

<section class="Sample__section">
  <h2>svelte-analog-clock</h2>
  <Clock renderNumbers renderSecondHand size={200} {value} />
</section>
