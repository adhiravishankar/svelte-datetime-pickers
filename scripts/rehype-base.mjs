// A rehype plugin that puts the site's `base` in front of absolute links such as
// `[Theming](/guides/theming/)`, so Markdown content can be served from a sub path
// (GitHub Pages: /svelte-datetime-pickers/<site>/). With no base it does nothing.
//
// Use it in an Astro config, next to the `base` option:
//   markdown: { rehypePlugins: [[rehypeBase, { base }]] }
export default function rehypeBase({ base } = {}) {
  const prefix = (base ?? '').replace(/\/+$/, '');
  if (!prefix) return () => {};

  const visit = (node) => {
    if (node.type === 'element' && node.tagName === 'a') {
      const href = node.properties?.href;
      if (
        typeof href === 'string' &&
        href.startsWith('/') &&
        !href.startsWith('//') &&
        href !== prefix &&
        !href.startsWith(prefix + '/')
      ) {
        node.properties.href = prefix + href;
      }
    }
    node.children?.forEach(visit);
  };
  return (tree) => visit(tree);
}
