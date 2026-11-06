import type { Action } from 'svelte/action';

/**
 * Moves an element to the given container. When the container is `null` or `undefined`, the element stays in (or returns to) its original place.
 */
export const portal: Action<HTMLElement, HTMLElement | null | undefined> = (node, target) => {
  const placeholder = document.createComment('portal');
  node.parentNode?.insertBefore(placeholder, node);

  let current: HTMLElement | null | undefined;

  function moveTo(next: HTMLElement | null | undefined) {
    if (next === current) {
      return;
    }

    current = next;

    if (next) {
      next.appendChild(node);
    } else if (placeholder.parentNode) {
      placeholder.parentNode.insertBefore(node, placeholder);
    }
  }

  moveTo(target);

  return {
    update: moveTo,
    destroy() {
      node.remove();
      placeholder.remove();
    },
  };
};
