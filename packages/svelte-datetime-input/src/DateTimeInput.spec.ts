import { describe, expect, it, vi } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser';
import { render } from 'vitest-browser-svelte';

import DateTimeInput from './DateTimeInput.svelte';

function getSegment(container: Element, name: string) {
  return container.querySelector<HTMLInputElement>(`[data-segment="${name}"]`);
}

describe('DateTimeInput', () => {
  const props = { className: 'input', locale: 'en-US', name: 'datetime' };

  it('renders a native datetime-local input with the given name', async () => {
    const { container } = await render(DateTimeInput, {
      ...props,
      value: new Date(2017, 0, 5, 22, 15),
    });

    const native = container.querySelector<HTMLInputElement>('input[type="datetime-local"]');

    expect(native).toHaveAttribute('name', 'datetime');
    expect(native?.value).toBe('2017-01-05T22:15');
  });

  it('renders date and time fields', async () => {
    const { container } = await render(DateTimeInput, {
      ...props,
      value: new Date(2017, 0, 5, 22, 15),
    });

    expect(getSegment(container, 'month')?.value).toBe('1');
    expect(getSegment(container, 'day')?.value).toBe('5');
    expect(getSegment(container, 'year')?.value).toBe('2017');
    expect(getSegment(container, 'hour12')?.value).toBe('10');
    expect(getSegment(container, 'minute')?.value).toBe('15');
    expect(container.querySelector<HTMLSelectElement>('select[name="amPm"]')?.value).toBe('pm');
    expect(getSegment(container, 'second')).toBeNull();
  });

  it('renders seconds when maxDetail is second', async () => {
    const { container } = await render(DateTimeInput, {
      ...props,
      maxDetail: 'second',
      value: new Date(2017, 0, 5, 22, 15, 30),
    });

    expect(getSegment(container, 'second')?.value).toBe('30');
  });

  it('supports a custom format', async () => {
    const { container } = await render(DateTimeInput, {
      ...props,
      format: 'y-MM-dd HH:mm:ss',
      value: new Date(2017, 0, 5, 7, 5, 9),
    });

    expect(getSegment(container, 'hour24')?.value).toBe('7');
    expect(container.querySelectorAll('.input__leadingZero').length).toBeGreaterThan(0);
  });

  it('calls onChange with a Date when the fields form a valid datetime', async () => {
    const onChange = vi.fn();
    const { container } = await render(DateTimeInput, {
      ...props,
      format: 'y-MM-dd HH:mm',
      onChange,
    });

    await userEvent.type(getSegment(container, 'year') as HTMLElement, '2017');
    await userEvent.type(getSegment(container, 'month') as HTMLElement, '01');
    await userEvent.type(getSegment(container, 'day') as HTMLElement, '05');
    await userEvent.type(getSegment(container, 'hour24') as HTMLElement, '22');
    await userEvent.type(getSegment(container, 'minute') as HTMLElement, '15');

    expect(onChange).toHaveBeenLastCalledWith(new Date(2017, 0, 5, 22, 15), false);
  });

  it('applies min/max to the native input', async () => {
    const { container } = await render(DateTimeInput, {
      ...props,
      maxDate: new Date(2018, 0, 1, 12, 30),
      minDate: new Date(2017, 0, 1, 8, 0),
    });

    const native = container.querySelector<HTMLInputElement>('input[type="datetime-local"]');

    expect(native).toHaveAttribute('min', '2017-01-01T08:00');
    expect(native).toHaveAttribute('max', '2018-01-01T12:30');
  });
});
