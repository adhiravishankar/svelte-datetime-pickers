<script lang="ts">
  import { untrack } from 'svelte';
  import { provideDateAdapter } from 'svelte-date-utils';
  import type { DateAdapter } from 'svelte-date-utils';
  import type { Snippet } from 'svelte';

  let { adapter, children }: { adapter: DateAdapter<any>; children?: Snippet } = $props();
  untrack(() => provideDateAdapter(adapter));
</script>

{@render children?.()}
