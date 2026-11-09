<script lang="ts">
  import Clock from 'svelte-analog-clock';
  import { AdapterDate } from 'svelte-date-utils';
  import { provideDateAdapter } from 'svelte-date-utils';

  const adapter = new AdapterDate();
  provideDateAdapter(adapter);
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
