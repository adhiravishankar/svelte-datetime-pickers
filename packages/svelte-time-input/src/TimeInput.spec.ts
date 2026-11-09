import { describe, expect, it, vi } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser';
import { render as testRender } from 'vitest-browser-svelte';
import DateAdapterContext from '../../../test/DateAdapterContext.svelte';

import TimeInput from './TimeInput.svelte';
import { AdapterDate } from 'svelte-date-utils';

function getSegment(container: Element, name: string) {
  return container.querySelector<HTMLInputElement>(`[data-segment="${name}"]`);
}

describe('TimeInput', () => {
  const render = (component: Parameters<typeof testRender>[0], props: object) =>
    testRender(component, props, {
      wrapper: DateAdapterContext,
      wrapperProps: { adapter: new AdapterDate() },
    });
  const props = { className: 'input', locale: 'en-US', name: 'time' };

  it('renders a native time input', async () => {
    const { container } = await render(TimeInput, { ...props, value: '22:15' });

    const native = container.querySelector<HTMLInputElement>('input[type="time"]');

    expect(native).toHaveAttribute('name', 'time');
    expect(native?.value).toBe('22:15');
  });

  it('renders 12-hour fields with AM/PM for en-US', async () => {
    const { container } = await render(TimeInput, { ...props, value: '22:15' });

    expect(getSegment(container, 'hour12')?.value).toBe('10');
    expect(getSegment(container, 'minute')?.value).toBe('15');
    expect(container.querySelector<HTMLSelectElement>('select[name="amPm"]')?.value).toBe('pm');
  });

  it('renders 24-hour fields for de-DE', async () => {
    const { container } = await render(TimeInput, { ...props, locale: 'de-DE', value: '22:15' });

    expect(getSegment(container, 'hour24')?.value).toBe('22');
    expect(container.querySelector('select[name="amPm"]')).not.toBeInTheDocument();
  });

  it('renders a second field when maxDetail is second', async () => {
    const { container } = await render(TimeInput, {
      ...props,
      maxDetail: 'second',
      value: '22:15:30',
    });

    expect(getSegment(container, 'second')?.value).toBe('30');
    expect(container.querySelector<HTMLInputElement>('input[type="time"]')?.value).toBe('22:15:30');
  });

  it('calls onChange with a time string', async () => {
    const onChange = vi.fn();
    const { container } = await render(TimeInput, { ...props, locale: 'de-DE', onChange });

    await userEvent.type(getSegment(container, 'hour24') as HTMLElement, '22');
    await userEvent.type(getSegment(container, 'minute') as HTMLElement, '15');

    expect(onChange).toHaveBeenLastCalledWith('22:15', false);
  });

  it('converts 12-hour input with AM/PM to a 24-hour value', async () => {
    const onChange = vi.fn();
    const { container } = await render(TimeInput, { ...props, onChange });

    await userEvent.type(getSegment(container, 'hour12') as HTMLElement, '10');
    await userEvent.type(getSegment(container, 'minute') as HTMLElement, '15');
    await userEvent.selectOptions(
      container.querySelector('select[name="amPm"]') as HTMLElement,
      'pm',
    );

    expect(onChange).toHaveBeenLastCalledWith('22:15', false);
  });
});
