<script lang="ts">
  import type { Detail } from './shared/types.js';

  const allViews = ['hour', 'minute', 'second'] as const;

  function upperCaseFirstLetter(str: string) {
    return str.slice(0, 1).toUpperCase() + str.slice(1);
  }

  let { maxDetail = $bindable() }: { maxDetail: Detail } = $props();
</script>

<fieldset>
  <legend>Maximum detail</legend>

  {#each allViews as view (view)}
    <div>
      <input bind:group={maxDetail} id="max-{view}" name="maxDetail" type="radio" value={view} />
      <label for="max-{view}">{upperCaseFirstLetter(view)}</label>
    </div>
  {/each}
</fieldset>
