import { describe, expect, it } from 'vite-plus/test';
import { render } from 'vitest-browser-svelte';

import Clock from './Clock.svelte';
import { AdapterDate } from 'svelte-date-utils';

const adapter = new AdapterDate();

function getRotation(element: Element | null) {
  const match = /rotate\((-?[\d.]+)deg\)/.exec(
    (element as HTMLElement | null)?.style.transform ?? '',
  );

  return match ? Number(match[1]) : null;
}

describe('Clock', () => {
  it('renders hour, minute and second hands at the right angles', async () => {
    const { container } = await render(Clock, { adapter, value: new Date(2017, 0, 1, 3, 30, 0) });

    expect(getRotation(container.querySelector('.svelte-clock__hour-hand'))).toBe(105);
    expect(getRotation(container.querySelector('.svelte-clock__minute-hand'))).toBe(180);
    expect(getRotation(container.querySelector('.svelte-clock__second-hand'))).toBe(0);
  });

  it('accepts time strings', async () => {
    const { container } = await render(Clock, { adapter, value: '06:00:30' });

    expect(getRotation(container.querySelector('.svelte-clock__hour-hand'))).toBe(180.25);
    expect(getRotation(container.querySelector('.svelte-clock__second-hand'))).toBe(180);
  });

  it('renders no hands when value is null', async () => {
    const { container } = await render(Clock, { adapter, value: null });

    expect(container.querySelector('.svelte-clock__face')).toBeInTheDocument();
    expect(container.querySelector('.svelte-clock__hand')).not.toBeInTheDocument();
  });

  it('respects renderMinuteHand and renderSecondHand', async () => {
    const { container } = await render(Clock, {
      adapter,
      renderMinuteHand: false,
      renderSecondHand: false,
      value: new Date(2017, 0, 1, 3, 30, 0),
    });

    expect(container.querySelector('.svelte-clock__hour-hand')).toBeInTheDocument();
    expect(container.querySelector('.svelte-clock__minute-hand')).not.toBeInTheDocument();
    expect(container.querySelector('.svelte-clock__second-hand')).not.toBeInTheDocument();
  });

  it('renders 12 hour marks and 48 minute marks', async () => {
    const { container } = await render(Clock, { adapter, value: new Date() });

    expect(container.querySelectorAll('.svelte-clock__hour-mark')).toHaveLength(12);
    expect(container.querySelectorAll('.svelte-clock__minute-mark')).toHaveLength(48);
  });

  it('renders formatted hour numbers when renderNumbers is set', async () => {
    const { container } = await render(Clock, {
      adapter,
      formatHour: (_locale: string | undefined, hour: number) => `h${hour}`,
      renderNumbers: true,
      value: new Date(),
    });

    const numbers = [...container.querySelectorAll('.svelte-clock__mark__number')].map((element) =>
      element.textContent?.trim(),
    );

    expect(numbers).toHaveLength(12);
    expect(numbers[0]).toBe('h12');
    expect(numbers[3]).toBe('h3');
  });

  it('applies size and custom class name', async () => {
    const { container } = await render(Clock, {
      adapter,
      class: 'custom',
      size: 200,
      value: new Date(),
    });

    const clock = container.querySelector('.svelte-clock') as HTMLElement;

    expect(clock).toHaveClass('custom');
    expect(clock.style.width).toBe('200px');
    expect(clock.style.height).toBe('200px');
  });
});
