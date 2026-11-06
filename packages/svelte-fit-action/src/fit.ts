import type { Action } from 'svelte/action';

export type FitOptions = {
  /**
   * Whether the element should currently be fitted. When set to `false`, positioning styles set by the action are removed.
   *
   * @default true
   */
  enabled?: boolean;
  /**
   * Axis along which the element is placed relative to its offset parent. `"y"` places it below (or above), `"x"` places it to the right (or left).
   *
   * @default 'y'
   */
  mainAxis?: 'x' | 'y';
  /**
   * Minimum distance, in pixels, to keep between the element and the edge of the container.
   *
   * @default 8
   */
  spacing?: number;
  /**
   * Element the popup should fit in. Defaults to the viewport.
   */
  container?: HTMLElement | null;
};

const positionProperties = ['position', 'top', 'right', 'bottom', 'left'] as const;

function reset(node: HTMLElement) {
  for (const property of positionProperties) {
    node.style.removeProperty(property);
  }
}

function getBounds(container: HTMLElement | null | undefined) {
  if (container) {
    return container.getBoundingClientRect();
  }

  return {
    top: 0,
    left: 0,
    right: document.documentElement.clientWidth,
    bottom: document.documentElement.clientHeight,
  };
}

function fitNode(node: HTMLElement, options: FitOptions) {
  reset(node);

  const { enabled = true, mainAxis = 'y', spacing = 8, container } = options;

  if (!enabled) {
    return;
  }

  const isVertical = mainAxis === 'y';
  const [mainStart, mainEnd] = isVertical
    ? (['top', 'bottom'] as const)
    : (['left', 'right'] as const);
  const [secondaryStart, secondaryEnd] = isVertical
    ? (['left', 'right'] as const)
    : (['top', 'bottom'] as const);

  node.style.position = 'absolute';
  node.style[mainStart] = '100%';
  node.style[secondaryStart] = '0';

  const bounds = getBounds(container);
  const anchor = (node.offsetParent ?? node.parentElement ?? document.body).getBoundingClientRect();
  const rect = node.getBoundingClientRect();

  // Main axis: flip to the opposite side if the element overflows and there is more room there
  const mainOverflow = rect[mainEnd] - (bounds[mainEnd] - spacing);

  if (mainOverflow > 0) {
    const roomAfter = bounds[mainEnd] - anchor[mainEnd];
    const roomBefore = anchor[mainStart] - bounds[mainStart];

    if (roomBefore > roomAfter) {
      node.style[mainStart] = 'auto';
      node.style[mainEnd] = '100%';
    }
  }

  // Secondary axis: align to the opposite edge if the element overflows
  const secondaryOverflow = rect[secondaryEnd] - (bounds[secondaryEnd] - spacing);

  if (secondaryOverflow > 0) {
    node.style[secondaryStart] = 'auto';
    node.style[secondaryEnd] = '0';

    // Aligning to the opposite edge may overflow on the other side; keep the original if it does
    if (node.getBoundingClientRect()[secondaryStart] < bounds[secondaryStart] + spacing) {
      node.style[secondaryEnd] = 'auto';
      node.style[secondaryStart] = '0';
    }
  }
}

/**
 * Positions an element absolutely next to its offset parent, flipping it so that it stays inside the viewport (or the given container).
 */
export const fit: Action<HTMLElement, FitOptions | undefined> = (node, options = {}) => {
  fitNode(node, options);

  return {
    update(nextOptions = {}) {
      fitNode(node, nextOptions);
    },
    destroy() {
      reset(node);
    },
  };
};
