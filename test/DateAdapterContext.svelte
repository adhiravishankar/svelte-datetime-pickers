<script lang="ts">
  import { provideDateAdapter } from 'svelte-date-utils/svelte';
  import type { DateAdapter } from 'svelte-date-utils';
  import type { Snippet } from 'svelte';

  let { adapter, children }: { adapter: DateAdapter<unknown>; children?: Snippet } = $props();
  provideDateAdapter(adapter);
</script>

{@render children?.()}
