import { describe, expect, it, vi } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser';
import { render } from 'vitest-browser-svelte';

import DateInput from './DateInput.svelte';
import { parseFormat } from './shared/format.js';

function getSegments(container: Element) {
  return [...container.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-segment]')];
}

function getSegment(container: Element, name: string) {
  return container.querySelector<HTMLInputElement>(`[data-segment="${name}"]`);
}

describe('parseFormat', () => {
  it('splits tokens and literals', () => {
    expect(parseFormat("y-MM-dd 'at' h:mm a")).toEqual([
      { segment: 'year', token: 'y', type: 'segment' },
      { text: '-', type: 'literal' },
      { segment: 'month', token: 'MM', type: 'segment' },
      { text: '-', type: 'literal' },
      { segment: 'day', token: 'dd', type: 'segment' },
      { text: ' ', type: 'literal' },
      { text: 'at', type: 'literal' },
      { text: ' ', type: 'literal' },
      { segment: 'hour12', token: 'h', type: 'segment' },
      { text: ':', type: 'literal' },
      { segment: 'minute', token: 'mm', type: 'segment' },
      { text: ' ', type: 'literal' },
      { segment: 'amPm', token: 'a', type: 'segment' },
    ]);
  });
});

describe('DateInput', () => {
  const props = { className: 'input', locale: 'en-US', name: 'date' };

  it('renders a native date input with the given name and value', async () => {
    const { container } = await render(DateInput, { ...props, value: new Date(2017, 0, 5) });

    const native = container.querySelector<HTMLInputElement>('input[type="date"]');

    expect(native).toHaveAttribute('name', 'date');
    expect(native?.value).toBe('2017-01-05');
  });

  it('renders day, month and year fields in locale order', async () => {
    const us = await render(DateInput, { ...props });
    expect(getSegments(us.container).map((segment) => segment.dataset.segment)).toEqual([
      'month',
      'day',
      'year',
    ]);

    const hu = await render(DateInput, { ...props, locale: 'hu-HU' });
    expect(getSegments(hu.container).map((segment) => segment.dataset.segment)).toEqual([
      'year',
      'month',
      'day',
    ]);
  });

  it('fills the fields from the value', async () => {
    const { container } = await render(DateInput, { ...props, value: new Date(2017, 10, 25) });

    expect(getSegment(container, 'day')?.value).toBe('25');
    expect(getSegment(container, 'month')?.value).toBe('11');
    expect(getSegment(container, 'year')?.value).toBe('2017');
  });

  it('follows value changes and clears when the value becomes null', async () => {
    const { container, rerender } = await render(DateInput, {
      ...props,
      value: new Date(2017, 10, 25),
    });

    await rerender({ value: new Date(2018, 1, 3) });
    expect(getSegment(container, 'month')?.value).toBe('2');

    await rerender({ value: null });
    expect(getSegment(container, 'month')?.value).toBe('');
    expect(getSegment(container, 'year')?.value).toBe('');
  });

  it('calls onChange with a Date once all fields are filled', async () => {
    const onChange = vi.fn();
    const { container } = await render(DateInput, { ...props, onChange });

    await userEvent.type(getSegment(container, 'month') as HTMLElement, '11');
    expect(onChange).not.toHaveBeenCalled();

    await userEvent.type(getSegment(container, 'day') as HTMLElement, '25');
    expect(onChange).not.toHaveBeenCalled();

    await userEvent.type(getSegment(container, 'year') as HTMLElement, '2017');

    expect(onChange).toHaveBeenLastCalledWith(new Date(2017, 10, 25), false);
  });

  it('moves focus to the next field after typing a complete value', async () => {
    const { container } = await render(DateInput, props);

    await userEvent.type(getSegment(container, 'month') as HTMLElement, '12');

    expect(document.activeElement).toBe(getSegment(container, 'day'));
  });

  it('calls onInvalidChange for dates that do not exist', async () => {
    const onChange = vi.fn();
    const onInvalidChange = vi.fn();
    const { container } = await render(DateInput, { ...props, onChange, onInvalidChange });

    await userEvent.type(getSegment(container, 'month') as HTMLElement, '2');
    await userEvent.type(getSegment(container, 'day') as HTMLElement, '31');
    await userEvent.type(getSegment(container, 'year') as HTMLElement, '2017');

    expect(onChange).not.toHaveBeenCalled();
    expect(onInvalidChange).toHaveBeenCalled();
  });

  it('calls onChange with null when all fields are cleared', async () => {
    const onChange = vi.fn();
    const { container } = await render(DateInput, {
      ...props,
      onChange,
      value: new Date(2017, 10, 25),
    });

    for (const name of ['month', 'day', 'year']) {
      await userEvent.clear(getSegment(container, name) as HTMLElement);
    }

    expect(onChange).toHaveBeenLastCalledWith(null, false);
  });

  it('rejects dates outside minDate and maxDate', async () => {
    const onChange = vi.fn();
    const { container } = await render(DateInput, {
      ...props,
      maxDate: new Date(2017, 11, 31),
      minDate: new Date(2017, 0, 1),
      onChange,
    });

    await userEvent.type(getSegment(container, 'month') as HTMLElement, '1');
    await userEvent.type(getSegment(container, 'day') as HTMLElement, '1');
    await userEvent.type(getSegment(container, 'year') as HTMLElement, '2016');

    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders a month select for MMMM format', async () => {
    const { container } = await render(DateInput, { ...props, format: 'MMMM d, y' });

    const select = container.querySelector<HTMLSelectElement>('select[name="month"]');

    expect(select).toHaveAttribute('data-select', 'true');
    expect(select?.options).toHaveLength(13);
    expect(select?.options[1]?.text).toBe('January');
  });

  it('shows leading zeros when requested', async () => {
    const { container } = await render(DateInput, {
      ...props,
      showLeadingZeros: true,
      value: new Date(2017, 0, 5),
    });

    expect(container.querySelectorAll('.input__leadingZero')).toHaveLength(2);
  });

  it('applies customInputsForm to custom fields only', async () => {
    const { container } = await render(DateInput, { ...props, customInputsForm: 'my-form' });

    for (const segment of getSegments(container)) {
      expect(segment).toHaveAttribute('form', 'my-form');
    }

    expect(container.querySelector('input[type="date"]')).not.toHaveAttribute('form');
  });
});
