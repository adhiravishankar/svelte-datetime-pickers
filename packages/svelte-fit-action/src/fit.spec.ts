import { afterEach, describe, expect, it } from 'vite-plus/test';

import { fit } from './fit.js';
import { portal } from './portal.js';

function createPopup(width = 100, height = 100) {
  const anchor = document.createElement('div');
  anchor.style.cssText = 'position: absolute; width: 50px; height: 20px;';

  const popup = document.createElement('div');
  popup.style.cssText = `width: ${width}px; height: ${height}px;`;

  anchor.appendChild(popup);
  document.body.appendChild(anchor);

  return { anchor, popup };
}

describe('fit', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('places the element below and aligned to the start of its anchor by default', () => {
    const { anchor, popup } = createPopup();
    anchor.style.top = '10px';
    anchor.style.left = '10px';

    fit(popup);

    expect(popup.style.position).toBe('absolute');
    expect(popup.style.top).toBe('100%');
    expect(popup.style.left).toBe('0px');
  });

  it('flips above the anchor when there is no room below', () => {
    const { anchor, popup } = createPopup(100, 200);
    anchor.style.top = `${document.documentElement.clientHeight - 30}px`;
    anchor.style.left = '10px';

    fit(popup);

    expect(popup.style.top).toBe('auto');
    expect(popup.style.bottom).toBe('100%');
  });

  it('aligns to the end of the anchor when it overflows horizontally', () => {
    const { anchor, popup } = createPopup(100, 50);
    anchor.style.top = '10px';
    anchor.style.left = `${document.documentElement.clientWidth - 60}px`;

    fit(popup);

    expect(popup.style.left).toBe('auto');
    expect(popup.style.right).toBe('0px');
  });

  it('removes positioning styles when disabled', () => {
    const { popup } = createPopup();

    const action = fit(popup, { enabled: true });
    expect(popup.style.position).toBe('absolute');

    action?.update?.({ enabled: false });

    expect(popup.style.position).toBe('');
    expect(popup.style.top).toBe('');
  });
});

describe('portal', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('moves the element into the target and back', () => {
    const origin = document.createElement('div');
    const target = document.createElement('div');
    const node = document.createElement('span');
    origin.appendChild(node);
    document.body.append(origin, target);

    const action = portal(node, target);
    expect(node.parentElement).toBe(target);

    action?.update?.(null);
    expect(node.parentElement).toBe(origin);

    action?.update?.(target);
    expect(node.parentElement).toBe(target);

    action?.destroy?.();
    expect(node.isConnected).toBe(false);
  });
});
