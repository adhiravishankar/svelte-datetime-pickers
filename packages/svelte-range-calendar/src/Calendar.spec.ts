import { describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';

import Calendar from './Calendar.svelte';

function getDayTiles(container: Element) {
  return [
    ...container.querySelectorAll<HTMLButtonElement>('.svelte-calendar__month-view__days__day'),
  ];
}

function findTile(container: Element, label: string, includeNeighbors = false) {
  return getDayTiles(container).find(
    (tile) =>
      tile.textContent?.trim() === label &&
      (includeNeighbors ||
        !tile.classList.contains('svelte-calendar__month-view__days__day--neighboringMonth')),
  );
}

describe('Calendar', () => {
  const baseProps = { locale: 'en-US', value: new Date(2017, 0, 15) };

  it('renders the month of the value with navigation label', async () => {
    const { container } = await render(Calendar, baseProps);

    expect(
      container.querySelector('.svelte-calendar__navigation__label')?.textContent?.trim(),
    ).toBe('January 2017');
    expect(findTile(container, '31')).toBeDefined();
  });

  it('starts weeks on Sunday for en-US and on Monday for fr-FR', async () => {
    const us = await render(Calendar, baseProps);
    const usWeekday = us.container.querySelector('.svelte-calendar__month-view__weekdays__weekday');
    expect(usWeekday?.textContent?.trim()).toBe('Sun');

    const fr = await render(Calendar, { locale: 'fr-FR', value: new Date(2017, 0, 15) });
    const frWeekday = fr.container.querySelector('.svelte-calendar__month-view__weekdays__weekday');
    expect(frWeekday?.textContent?.trim().toLowerCase()).toContain('lun');
  });

  it('marks the active tile', async () => {
    const { container } = await render(Calendar, baseProps);

    expect(findTile(container, '15')).toHaveClass('svelte-calendar__tile--active');
    expect(findTile(container, '16')).not.toHaveClass('svelte-calendar__tile--active');
  });

  it('calls onChange with the start of the day when selecting a single date', async () => {
    const onChange = vi.fn();
    const { container } = await render(Calendar, { ...baseProps, onChange });

    await userEvent.click(findTile(container, '20') as HTMLElement);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0]?.[0]).toEqual(new Date(2017, 0, 20));
  });

  it('calls onChange only after both ends are selected when selectRange is set', async () => {
    const onChange = vi.fn();
    const { container } = await render(Calendar, { ...baseProps, onChange, selectRange: true });

    await userEvent.click(findTile(container, '20') as HTMLElement);
    expect(onChange).not.toHaveBeenCalled();

    await userEvent.click(findTile(container, '10') as HTMLElement);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0]?.[0]).toEqual([
      new Date(2017, 0, 10),
      new Date(2017, 0, 20, 23, 59, 59, 999),
    ]);
  });

  it('highlights a range value', async () => {
    const { container } = await render(Calendar, {
      locale: 'en-US',
      selectRange: true,
      value: [new Date(2017, 0, 10, 12), new Date(2017, 0, 12, 12)],
    });

    for (const day of ['10', '11', '12']) {
      expect(findTile(container, day)).toHaveClass('svelte-calendar__tile--active');
    }
    expect(findTile(container, '9')).not.toHaveClass('svelte-calendar__tile--active');
    expect(findTile(container, '13')).not.toHaveClass('svelte-calendar__tile--active');
    expect(findTile(container, '10')).toHaveClass('svelte-calendar__tile--rangeStart');
    expect(findTile(container, '12')).toHaveClass('svelte-calendar__tile--rangeEnd');
  });

  it('navigates between months', async () => {
    const { container } = await render(Calendar, baseProps);

    await userEvent.click(
      container.querySelector('.svelte-calendar__navigation__next-button') as HTMLElement,
    );

    expect(
      container.querySelector('.svelte-calendar__navigation__label')?.textContent?.trim(),
    ).toBe('February 2017');

    await userEvent.click(
      container.querySelector('.svelte-calendar__navigation__prev2-button') as HTMLElement,
    );

    expect(
      container.querySelector('.svelte-calendar__navigation__label')?.textContent?.trim(),
    ).toBe('February 2016');
  });

  it('drills up to the year view and back down', async () => {
    const { container } = await render(Calendar, baseProps);

    await userEvent.click(
      container.querySelector('.svelte-calendar__navigation__label') as HTMLElement,
    );

    expect(container.querySelector('.svelte-calendar__year-view')).toBeInTheDocument();

    const months = container.querySelectorAll('.svelte-calendar__year-view__months__month');
    expect(months).toHaveLength(12);

    await userEvent.click(months[5] as HTMLElement);

    expect(container.querySelector('.svelte-calendar__month-view')).toBeInTheDocument();
    expect(
      container.querySelector('.svelte-calendar__navigation__label')?.textContent?.trim(),
    ).toBe('June 2017');
  });

  it('disables tiles outside minDate and maxDate but keeps partially overlapping ones', async () => {
    const { container } = await render(Calendar, {
      ...baseProps,
      maxDate: new Date(2017, 0, 20, 12),
      minDate: new Date(2017, 0, 10, 12),
    });

    expect(findTile(container, '9')?.disabled).toBe(true);
    expect(findTile(container, '10')?.disabled).toBe(false);
    expect(findTile(container, '20')?.disabled).toBe(false);
    expect(findTile(container, '21')?.disabled).toBe(true);
  });

  it('shows week numbers when requested', async () => {
    const { container } = await render(Calendar, {
      ...baseProps,
      locale: 'fr-FR',
      showWeekNumbers: true,
    });

    const numbers = [
      ...container.querySelectorAll(
        '.svelte-calendar__month-view__weekNumbers .svelte-calendar__tile',
      ),
    ];

    expect(numbers.map((element) => element.textContent?.trim())).toEqual([
      '52',
      '1',
      '2',
      '3',
      '4',
      '5',
    ]);
  });

  it('hides neighboring month days when showNeighboringMonth is false', async () => {
    const { container } = await render(Calendar, { ...baseProps, showNeighboringMonth: false });

    expect(getDayTiles(container)).toHaveLength(31);
  });
});
