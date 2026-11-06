<script lang="ts">
  type DividerProps = {
    class: string;
    text: string;
  };

  let { class: className, text }: DividerProps = $props();

  // Keep whitespace from collapsing between input fields
  const content = $derived(text.replace(/[  ]/g, ' '));
</script>

<span class={className}>{content}</span>
