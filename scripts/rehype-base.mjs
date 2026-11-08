// A rehype plugin that puts the site's `base` in front of absolute links such as
// `[Theming](/guides/theming/)`, so the docs can be served from a sub path
// (GitHub Pages: /svelte-tables/<site>/). With no base it does nothing.
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
