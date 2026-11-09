import { describe, expect, it, vi } from 'vite-plus/test';
import { page, userEvent } from 'vite-plus/test/browser';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';

import DateTimeRangePicker from './DateTimeRangePicker.svelte';
import { AdapterDate } from 'svelte-date-utils';

import type { Locator } from 'vite-plus/test/browser';

async function waitForElementToBeRemovedOrHidden(callback: () => HTMLElement | null) {
  const element = callback();

  if (element) {
    await vi.waitFor(() =>
      expect(element).toHaveAttribute('class', expect.stringContaining('--closed')),
    );
  }
}

function triggerFocusInEvent(locator: Locator) {
  locator
    .element()
    .dispatchEvent(new FocusEvent('focusin', { bubbles: true, cancelable: false, composed: true }));
}

function triggerFocusEvent(locator: Locator) {
  triggerFocusInEvent(locator);
  locator
    .element()
    .dispatchEvent(new FocusEvent('focus', { bubbles: false, cancelable: false, composed: true }));
}

function triggerTouchStart(element: HTMLElement) {
  element.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, cancelable: true }));
}

function textSnippet(html: string) {
  return createRawSnippet(() => ({ render: () => `<span>${html}</span>` }));
}

describe('DateTimeRangePicker', () => {
  const defaultProps = {
    adapter: new AdapterDate(),
    amPmAriaLabel: 'amPm',
    dayAriaLabel: 'day',
    hourAriaLabel: 'hour',
    locale: 'en-US',
    minuteAriaLabel: 'minute',
    monthAriaLabel: 'month',
    secondAriaLabel: 'second',
    yearAriaLabel: 'year',
  };

  it('passes default name to DateTimeInput components', async () => {
    const { container } = await render(DateTimeRangePicker, defaultProps);

    const nativeInputs = container.querySelectorAll('input[type="datetime-local"]');

    expect(nativeInputs[0]).toHaveAttribute('name', 'datetimerange_from');
    expect(nativeInputs[1]).toHaveAttribute('name', 'datetimerange_to');
  });

  it('passes custom name to DateTimeInput components', async () => {
    const { container } = await render(DateTimeRangePicker, { ...defaultProps, name: 'testName' });

    const nativeInputs = container.querySelectorAll('input[type="datetime-local"]');

    expect(nativeInputs[0]).toHaveAttribute('name', 'testName_from');
    expect(nativeInputs[1]).toHaveAttribute('name', 'testName_to');
  });

  it('passes customInputsForm to custom inputs only', async () => {
    const form = document.createElement('form');
    document.body.appendChild(form);

    const { container } = await render(DateTimeRangePicker, {
      ...defaultProps,
      customInputsForm: '',
      format: 'MMMM d, y h:mm:ss a',
      maxDetail: 'second',
      name: 'appointment',
      value: [new Date(2020, 10, 11, 22, 15, 30), new Date(2020, 10, 12, 23, 45, 5)],
    });

    form.append(...container.children);

    const customInputs = form.querySelectorAll('[data-input="true"]');

    expect(customInputs).toHaveLength(14);

    for (const customInput of customInputs) {
      expect(customInput).toHaveAttribute('form', '');
    }

    expect(Array.from(new FormData(form).entries())).toEqual([
      ['appointment_from', '2020-11-11T22:15:30'],
      ['appointment_to', '2020-11-12T23:45:05'],
    ]);

    form.remove();
  });

  it('passes autoFocus flag to first DateTimeInput component', async () => {
    await render(DateTimeRangePicker, { ...defaultProps, autoFocus: true });

    expect(page.getByRole('spinbutton').nth(0)).toHaveFocus();
  });

  it('passes disabled flag to DateTimeInput components', async () => {
    const { container } = await render(DateTimeRangePicker, { ...defaultProps, disabled: true });

    const nativeInputs = container.querySelectorAll('input[type="datetime-local"]');

    expect(nativeInputs[0]).toBeDisabled();
    expect(nativeInputs[1]).toBeDisabled();
    expect(page.getByTestId('clear-button')).toBeDisabled();
    expect(page.getByTestId('calendar-button')).toBeDisabled();
  });

  it('passes format to DateTimeInput components', async () => {
    await render(DateTimeRangePicker, { ...defaultProps, format: 'ss' });

    const customInputs = page.getByRole('spinbutton');

    expect(customInputs).toHaveLength(2);
    expect(customInputs.nth(0)).toHaveAttribute('name', 'second');
    expect(customInputs.nth(1)).toHaveAttribute('name', 'second');
  });

  it('passes aria-label props to the inputs and buttons', async () => {
    const { container } = await render(DateTimeRangePicker, {
      ...defaultProps,
      calendarAriaLabel: 'Toggle calendar',
      clearAriaLabel: 'Clear value',
      format: 'M/d/y h:m:s a',
      maxDetail: 'second',
      nativeInputAriaLabel: 'Date and time',
    });

    expect(page.getByLabelText('Toggle calendar')).toBeInTheDocument();
    expect(page.getByLabelText('Clear value')).toBeInTheDocument();
    expect(page.getByLabelText('Date and time')).toHaveLength(2);

    for (const label of ['day', 'month', 'year', 'hour', 'minute', 'second']) {
      expect(container.querySelectorAll(`[aria-label="${label}"]`)).toHaveLength(2);
    }

    expect(container.querySelectorAll('select[aria-label="amPm"]')).toHaveLength(2);
  });

  it('passes placeholder props to the inputs', async () => {
    const { container } = await render(DateTimeRangePicker, {
      ...defaultProps,
      dayPlaceholder: 'dd',
      format: 'M/d/y h:m:s',
      hourPlaceholder: 'hh',
      maxDetail: 'second',
      minutePlaceholder: 'mm',
      monthPlaceholder: 'mm',
      secondPlaceholder: 'ss',
      yearPlaceholder: 'yyyy',
    });

    for (const [name, placeholder] of Object.entries({
      day: 'dd',
      hour12: 'hh',
      minute: 'mm',
      month: 'mm',
      second: 'ss',
      year: 'yyyy',
    })) {
      for (const input of container.querySelectorAll(`input[name="${name}"]`)) {
        expect(input).toHaveAttribute('placeholder', placeholder);
      }
    }
  });

  describe('passes value to DateTimeInput components', () => {
    it('passes single value to DateTimeInput components', async () => {
      const value = new Date(2019, 0, 1, 12, 30);

      const { container } = await render(DateTimeRangePicker, { ...defaultProps, value });

      const nativeInputs = container.querySelectorAll<HTMLInputElement>(
        'input[type="datetime-local"]',
      );

      expect(nativeInputs[0]?.value).toBe('2019-01-01T12:30');
      expect(nativeInputs[1]?.value).toBe('');
    });

    it('passes both items of an array of values to DateTimeInput components', async () => {
      const value = [new Date(2019, 0, 1, 12, 30), new Date(2019, 6, 1, 18, 45)] as [Date, Date];

      const { container } = await render(DateTimeRangePicker, { ...defaultProps, value });

      const nativeInputs = container.querySelectorAll<HTMLInputElement>(
        'input[type="datetime-local"]',
      );

      expect(nativeInputs[0]?.value).toBe('2019-01-01T12:30');
      expect(nativeInputs[1]?.value).toBe('2019-07-01T18:45');
    });

    it('accepts ISO strings', async () => {
      const { container } = await render(DateTimeRangePicker, {
        ...defaultProps,
        value: ['2019-01-01T12:30:00', '2019-07-01T18:45:00'],
      });

      const nativeInputs = container.querySelectorAll<HTMLInputElement>(
        'input[type="datetime-local"]',
      );

      expect(nativeInputs[0]?.value).toBe('2019-01-01T12:30');
      expect(nativeInputs[1]?.value).toBe('2019-07-01T18:45');
    });
  });

  it('applies class to its wrapper when given a string', async () => {
    const { container } = await render(DateTimeRangePicker, {
      ...defaultProps,
      class: 'testClassName',
    });

    expect(container.firstElementChild).toHaveClass('testClassName');
    expect(container.firstElementChild).toHaveClass('svelte-datetimerange-picker');
  });

  it('passes id, data-testid and other attributes to its wrapper', async () => {
    const { container } = await render(DateTimeRangePicker, {
      ...defaultProps,
      'data-testid': 'picker',
      id: 'picker-id',
    });

    expect(container.firstElementChild).toHaveAttribute('id', 'picker-id');
    expect(container.firstElementChild).toHaveAttribute('data-testid', 'picker');
  });

  it('applies "--open" class to its wrapper when given isCalendarOpen flag', async () => {
    const { container } = await render(DateTimeRangePicker, {
      ...defaultProps,
      isCalendarOpen: true,
    });

    expect(container.firstElementChild).toHaveClass('svelte-datetimerange-picker--open');
  });

  it('applies "--open" class to its wrapper when given isClockOpen flag', async () => {
    const { container } = await render(DateTimeRangePicker, { ...defaultProps, isClockOpen: true });

    expect(container.firstElementChild).toHaveClass('svelte-datetimerange-picker--open');
  });

  it('applies calendar class to the calendar when given calendarProps', async () => {
    const { container } = await render(DateTimeRangePicker, {
      ...defaultProps,
      calendarProps: { class: 'testClassName' },
      isCalendarOpen: true,
    });

    expect(container.querySelector('.svelte-calendar')).toHaveClass('testClassName');
  });

  it('applies clock class to the clock when given clockProps', async () => {
    const { container } = await render(DateTimeRangePicker, {
      ...defaultProps,
      clockProps: { class: 'testClassName' },
      isClockOpen: true,
    });

    expect(container.querySelector('.svelte-clock')).toHaveClass('testClassName');
  });

  it('renders DateTimeInput components', async () => {
    const { container } = await render(DateTimeRangePicker, defaultProps);

    expect(container.querySelectorAll('input[type="datetime-local"]')).toHaveLength(2);
  });

  it('renders range divider with default divider', async () => {
    await render(DateTimeRangePicker, defaultProps);

    const rangeDivider = page.getByTestId('range-divider');

    expect(rangeDivider).toBeInTheDocument();
    expect(rangeDivider).toHaveTextContent('–');
  });

  it('renders range divider with custom divider', async () => {
    await render(DateTimeRangePicker, { ...defaultProps, rangeDivider: 'to' });

    expect(page.getByTestId('range-divider')).toHaveTextContent('to');
  });

  it('renders range divider given as a snippet', async () => {
    await render(DateTimeRangePicker, { ...defaultProps, rangeDivider: textSnippet('until') });

    expect(page.getByTestId('range-divider')).toHaveTextContent('until');
  });

  describe('renders clear button properly', () => {
    it('renders clear button with the default icon', async () => {
      await render(DateTimeRangePicker, defaultProps);

      const clearButton = page.getByTestId('clear-button');

      expect(clearButton).toBeInTheDocument();
      expect(clearButton.element().querySelector('svg')).toBeInTheDocument();
    });

    it('renders clear icon when given a string', async () => {
      await render(DateTimeRangePicker, { ...defaultProps, clearIcon: '❌' });

      expect(page.getByTestId('clear-button')).toHaveTextContent('❌');
    });

    it('renders clear icon when given a snippet', async () => {
      await render(DateTimeRangePicker, { ...defaultProps, clearIcon: textSnippet('❌') });

      expect(page.getByTestId('clear-button')).toHaveTextContent('❌');
    });

    it('does not render clear button when clearIcon is null', async () => {
      const { container } = await render(DateTimeRangePicker, { ...defaultProps, clearIcon: null });

      expect(container.querySelector('[data-testid="clear-button"]')).not.toBeInTheDocument();
    });
  });

  describe('renders calendar button properly', () => {
    it('renders calendar button with the default icon', async () => {
      await render(DateTimeRangePicker, defaultProps);

      const calendarButton = page.getByTestId('calendar-button');

      expect(calendarButton).toBeInTheDocument();
      expect(calendarButton.element().querySelector('svg')).toBeInTheDocument();
    });

    it('renders calendar icon when given a string', async () => {
      await render(DateTimeRangePicker, { ...defaultProps, calendarIcon: '📆' });

      expect(page.getByTestId('calendar-button')).toHaveTextContent('📆');
    });

    it('renders calendar icon when given a snippet', async () => {
      await render(DateTimeRangePicker, { ...defaultProps, calendarIcon: textSnippet('📆') });

      expect(page.getByTestId('calendar-button')).toHaveTextContent('📆');
    });

    it('does not render calendar button when calendarIcon is null or disableCalendar is set', async () => {
      const first = await render(DateTimeRangePicker, { ...defaultProps, calendarIcon: null });
      expect(first.container.querySelector('[data-testid="calendar-button"]')).toBeNull();

      const second = await render(DateTimeRangePicker, { ...defaultProps, disableCalendar: true });
      expect(second.container.querySelector('[data-testid="calendar-button"]')).toBeNull();
    });
  });

  it('renders Calendar when given isCalendarOpen flag', async () => {
    const { container } = await render(DateTimeRangePicker, {
      ...defaultProps,
      isCalendarOpen: true,
    });

    expect(container.querySelector('.svelte-calendar')).toBeInTheDocument();
  });

  it('renders Clock when given isClockOpen flag', async () => {
    const { container } = await render(DateTimeRangePicker, { ...defaultProps, isClockOpen: true });

    expect(container.querySelector('.svelte-clock')).toBeInTheDocument();
  });

  it('does not render Calendar when given disableCalendar & isCalendarOpen flags', async () => {
    const { container } = await render(DateTimeRangePicker, {
      ...defaultProps,
      disableCalendar: true,
      isCalendarOpen: true,
    });

    expect(container.querySelector('.svelte-calendar')).not.toBeInTheDocument();
  });

  it('does not render Clock when given disableClock & isClockOpen flags', async () => {
    const { container } = await render(DateTimeRangePicker, {
      ...defaultProps,
      disableClock: true,
      isClockOpen: true,
    });

    expect(container.querySelector('.svelte-clock')).not.toBeInTheDocument();
  });

  it('opens Calendar when given isCalendarOpen flag by changing props', async () => {
    const { container, rerender } = await render(DateTimeRangePicker, defaultProps);

    expect(container.querySelector('.svelte-calendar')).not.toBeInTheDocument();

    await rerender({ isCalendarOpen: true });

    expect(container.querySelector('.svelte-calendar')).toBeInTheDocument();
  });

  it('opens Clock when given isClockOpen flag by changing props', async () => {
    const { container, rerender } = await render(DateTimeRangePicker, defaultProps);

    expect(container.querySelector('.svelte-clock')).not.toBeInTheDocument();

    await rerender({ isClockOpen: true });

    expect(container.querySelector('.svelte-clock')).toBeInTheDocument();
  });

  it('opens Calendar and calls onCalendarOpen when clicking on a button', async () => {
    const onCalendarOpen = vi.fn();
    const { container } = await render(DateTimeRangePicker, { ...defaultProps, onCalendarOpen });

    expect(container.querySelector('.svelte-calendar')).not.toBeInTheDocument();

    await userEvent.click(page.getByTestId('calendar-button'));

    expect(container.querySelector('.svelte-calendar')).toBeInTheDocument();
    expect(onCalendarOpen).toHaveBeenCalledTimes(1);
  });

  it('closes Calendar and calls onCalendarClose when clicking on the button again', async () => {
    const onCalendarClose = vi.fn();
    const { container } = await render(DateTimeRangePicker, {
      ...defaultProps,
      isCalendarOpen: true,
      onCalendarClose,
    });

    await userEvent.click(page.getByTestId('calendar-button'));

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.svelte-datetimerange-picker__calendar'),
    );
    expect(onCalendarClose).toHaveBeenCalledTimes(1);
  });

  describe('handles opening widgets when focusing on an input inside', () => {
    it('opens Calendar when focusing on a date input by default', async () => {
      const { container } = await render(DateTimeRangePicker, defaultProps);

      expect(container.querySelector('.svelte-calendar')).not.toBeInTheDocument();

      triggerFocusEvent(page.getByRole('spinbutton', { name: 'day' }).first());

      await vi.waitFor(() =>
        expect(container.querySelector('.svelte-calendar')).toBeInTheDocument(),
      );
    });

    it('opens Clock when focusing on a time input by default', async () => {
      const { container } = await render(DateTimeRangePicker, defaultProps);

      expect(container.querySelector('.svelte-clock')).not.toBeInTheDocument();

      triggerFocusEvent(page.getByRole('spinbutton', { name: 'minute' }).first());

      await vi.waitFor(() => expect(container.querySelector('.svelte-clock')).toBeInTheDocument());
    });

    it('does not open widgets given openWidgetsOnFocus = false', async () => {
      const { container } = await render(DateTimeRangePicker, {
        ...defaultProps,
        openWidgetsOnFocus: false,
      });

      triggerFocusEvent(page.getByRole('spinbutton', { name: 'day' }).first());
      triggerFocusEvent(page.getByRole('spinbutton', { name: 'minute' }).first());

      expect(container.querySelector('.svelte-calendar')).not.toBeInTheDocument();
      expect(container.querySelector('.svelte-clock')).not.toBeInTheDocument();
    });

    it('does not open widgets given shouldOpenWidgets returning false', async () => {
      const shouldOpenWidgets = vi.fn(() => false);
      const { container } = await render(DateTimeRangePicker, {
        ...defaultProps,
        shouldOpenWidgets,
      });

      triggerFocusEvent(page.getByRole('spinbutton', { name: 'day' }).first());

      expect(shouldOpenWidgets).toHaveBeenCalledWith({ reason: 'focus', widget: 'calendar' });
      expect(container.querySelector('.svelte-calendar')).not.toBeInTheDocument();
    });

    it('does not open Calendar when focusing on a select element', async () => {
      const { container } = await render(DateTimeRangePicker, {
        ...defaultProps,
        format: 'MMMM d, y',
      });

      triggerFocusEvent(page.getByRole('combobox', { name: 'month' }).first());

      expect(container.querySelector('.svelte-calendar')).not.toBeInTheDocument();
    });

    it('opens Calendar, followed by Clock, when focusing on inputs inside', async () => {
      const { container } = await render(DateTimeRangePicker, defaultProps);

      triggerFocusEvent(page.getByRole('spinbutton', { name: 'day' }).first());
      await vi.waitFor(() =>
        expect(container.querySelector('.svelte-calendar')).toBeInTheDocument(),
      );

      triggerFocusEvent(page.getByRole('spinbutton', { name: 'minute' }).first());
      await vi.waitFor(() => expect(container.querySelector('.svelte-clock')).toBeInTheDocument());
      await waitForElementToBeRemovedOrHidden(() =>
        container.querySelector('.svelte-datetimerange-picker__calendar'),
      );
    });
  });

  describe('closes widgets on outside actions', () => {
    it('closes Calendar when clicked, focused or tapped outside', async () => {
      for (const action of [
        () => userEvent.click(document.body),
        () => triggerFocusInEvent(page.elementLocator(document.body)),
        () => triggerTouchStart(document.body),
      ]) {
        const { container, unmount } = await render(DateTimeRangePicker, {
          ...defaultProps,
          isCalendarOpen: true,
        });

        await action();

        await waitForElementToBeRemovedOrHidden(() =>
          container.querySelector('.svelte-datetimerange-picker__calendar'),
        );

        unmount();
      }
    });

    it('closes Clock when clicked, focused or tapped outside', async () => {
      for (const action of [
        () => userEvent.click(document.body),
        () => triggerFocusInEvent(page.elementLocator(document.body)),
        () => triggerTouchStart(document.body),
      ]) {
        const { container, unmount } = await render(DateTimeRangePicker, {
          ...defaultProps,
          isClockOpen: true,
        });

        await action();

        await waitForElementToBeRemovedOrHidden(() =>
          container.querySelector('.svelte-datetimerange-picker__clock'),
        );

        unmount();
      }
    });

    it('closes Calendar when Escape is pressed', async () => {
      const { container } = await render(DateTimeRangePicker, {
        ...defaultProps,
        isCalendarOpen: true,
      });

      await userEvent.keyboard('{Escape}');

      await waitForElementToBeRemovedOrHidden(() =>
        container.querySelector('.svelte-datetimerange-picker__calendar'),
      );
    });

    it('passes the reason to shouldCloseWidgets', async () => {
      const shouldCloseWidgets = vi.fn(() => true);

      await render(DateTimeRangePicker, {
        ...defaultProps,
        isCalendarOpen: true,
        shouldCloseWidgets,
      });

      await userEvent.click(document.body);

      expect(shouldCloseWidgets).toHaveBeenCalledWith({
        reason: 'outsideAction',
        widget: 'calendar',
      });
    });

    it('does not close Calendar when focus moves within the date inputs', async () => {
      const { container } = await render(DateTimeRangePicker, {
        ...defaultProps,
        isCalendarOpen: true,
      });

      triggerFocusEvent(page.getByRole('spinbutton', { name: 'day' }).first());

      expect(container.querySelector('.svelte-calendar')).toBeInTheDocument();
      expect(container.querySelector('.svelte-datetimerange-picker__calendar')).toHaveClass(
        'svelte-datetimerange-picker__calendar--open',
      );
    });

    it('closes Clock when Calendar is opened by a click on the calendar icon', async () => {
      const { container } = await render(DateTimeRangePicker, {
        ...defaultProps,
        isClockOpen: true,
      });

      await userEvent.click(page.getByTestId('calendar-button'));

      await waitForElementToBeRemovedOrHidden(() =>
        container.querySelector('.svelte-datetimerange-picker__clock'),
      );
    });
  });

  describe('closing widgets on value selection', () => {
    async function selectRangeInCalendar(container: Element) {
      const [firstTile, secondTile] =
        container.querySelectorAll<HTMLButtonElement>('.svelte-calendar__tile');

      await userEvent.click(firstTile as HTMLElement);
      await userEvent.click(secondTile as HTMLElement);
    }

    it('closes Calendar when changing value by default', async () => {
      const { container } = await render(DateTimeRangePicker, {
        ...defaultProps,
        isCalendarOpen: true,
      });

      await selectRangeInCalendar(container);

      await waitForElementToBeRemovedOrHidden(() =>
        container.querySelector('.svelte-datetimerange-picker__calendar'),
      );
    });

    it('does not close Calendar when changing value with closeWidgets = false', async () => {
      const { container } = await render(DateTimeRangePicker, {
        ...defaultProps,
        closeWidgets: false,
        isCalendarOpen: true,
      });

      await selectRangeInCalendar(container);

      expect(container.querySelector('.svelte-datetimerange-picker__calendar')).toHaveClass(
        'svelte-datetimerange-picker__calendar--open',
      );
    });

    it('does not close Calendar when shouldCloseWidgets returns false', async () => {
      const { container } = await render(DateTimeRangePicker, {
        ...defaultProps,
        isCalendarOpen: true,
        shouldCloseWidgets: () => false,
      });

      await selectRangeInCalendar(container);

      expect(container.querySelector('.svelte-datetimerange-picker__calendar')).toHaveClass(
        'svelte-datetimerange-picker__calendar--open',
      );
    });

    it('does not close Calendar when changing value using inputs', async () => {
      const { container } = await render(DateTimeRangePicker, {
        ...defaultProps,
        isCalendarOpen: true,
      });

      await userEvent.fill(page.getByRole('spinbutton', { name: 'day' }).first(), '1');

      expect(container.querySelector('.svelte-datetimerange-picker__calendar')).toHaveClass(
        'svelte-datetimerange-picker__calendar--open',
      );
    });

    it('does not close Clock when changing value using inputs', async () => {
      const { container } = await render(DateTimeRangePicker, {
        ...defaultProps,
        isClockOpen: true,
      });

      await userEvent.fill(page.getByRole('spinbutton', { name: 'hour' }).first(), '9');

      expect(container.querySelector('.svelte-datetimerange-picker__clock')).toHaveClass(
        'svelte-datetimerange-picker__clock--open',
      );
    });
  });

  describe('onChange', () => {
    it('calls onChange when changing value using inputs', async () => {
      const onChange = vi.fn();

      await render(DateTimeRangePicker, {
        ...defaultProps,
        maxDetail: 'second',
        onChange,
        value: new Date(2023, 0, 31, 21, 40, 11),
      });

      await userEvent.fill(page.getByRole('spinbutton', { name: 'day' }).first(), '1');

      expect(onChange).toHaveBeenCalledWith([new Date(2023, 0, 1, 21, 40, 11), null]);
    });

    it('calls onChange with merged new date & old time when selecting a range in the calendar', async () => {
      const hours = 21;
      const minutes = 40;
      const seconds = 11;
      const ms = 458;

      const onChange = vi.fn();
      const valueFrom = new Date(2018, 6, 17, hours, minutes, seconds, ms);
      const nextValueFrom = new Date(2019, 0, 1, hours, minutes, seconds, ms);
      const valueTo = new Date(2019, 6, 17);

      const { container } = await render(DateTimeRangePicker, {
        ...defaultProps,
        isCalendarOpen: true,
        onChange,
        value: [valueFrom, valueTo],
      });

      const drillUpButton = container.querySelector(
        '.svelte-calendar__navigation__label',
      ) as HTMLButtonElement;
      await userEvent.click(drillUpButton); // To year 2018
      await userEvent.click(drillUpButton); // To 2011 – 2020 decade

      await userEvent.click(page.getByRole('button', { name: '2019' }));
      await userEvent.click(page.getByRole('button', { name: 'January 2019' }));
      await userEvent.click(page.getByRole('button', { name: 'January 1, 2019' }));

      await userEvent.click(drillUpButton); // To year 2019
      await userEvent.click(page.getByRole('button', { name: 'July 2019' }));
      await userEvent.click(page.getByRole('button', { name: 'July 17, 2019' }));

      expect(onChange).toHaveBeenCalledWith([nextValueFrom, valueTo]);
    });

    it('calls onInvalidChange when changing value to an invalid one', async () => {
      const onInvalidChange = vi.fn();

      await render(DateTimeRangePicker, {
        ...defaultProps,
        maxDetail: 'second',
        onInvalidChange,
        value: new Date(2023, 0, 31, 21, 40, 11),
      });

      await userEvent.fill(page.getByRole('spinbutton', { name: 'day' }).first(), '32');

      expect(onInvalidChange).toHaveBeenCalled();
    });

    it('clears the value when clicking on the clear button', async () => {
      const onChange = vi.fn();

      await render(DateTimeRangePicker, { ...defaultProps, onChange });

      await userEvent.click(page.getByTestId('clear-button'));

      expect(onChange).toHaveBeenCalledWith(null);
    });

    describe('onChangeFrom', () => {
      const props = {
        ...defaultProps,
        format: 'M/d/y H:m:s',
        maxDetail: 'second' as const,
        openWidgetsOnFocus: false,
      };

      async function fillFirstInput() {
        await userEvent.fill(page.getByRole('spinbutton', { name: 'month' }).first(), '2');
        await userEvent.fill(page.getByRole('spinbutton', { name: 'day' }).first(), '15');
        await userEvent.fill(page.getByRole('spinbutton', { name: 'year' }).first(), '2018');
        await userEvent.fill(page.getByRole('spinbutton', { name: 'hour' }).first(), '12');
        await userEvent.fill(page.getByRole('spinbutton', { name: 'minute' }).first(), '30');
        await userEvent.fill(page.getByRole('spinbutton', { name: 'second' }).first(), '45');
      }

      it('calls onChange properly given no initial value', async () => {
        const onChange = vi.fn();

        await render(DateTimeRangePicker, { ...props, onChange });
        await fillFirstInput();

        await vi.waitFor(() => {
          expect(onChange).toHaveBeenCalledWith([new Date(2018, 1, 15, 12, 30, 45), null]);
        });
      });

      it('keeps the end of the range given initial value as an array', async () => {
        const onChange = vi.fn();
        const valueTo = new Date(2018, 6, 1);

        await render(DateTimeRangePicker, {
          ...props,
          onChange,
          value: [new Date(2018, 0, 1), valueTo],
        });
        await fillFirstInput();

        await vi.waitFor(() => {
          expect(onChange).toHaveBeenCalledWith([new Date(2018, 1, 15, 12, 30, 45), valueTo]);
        });
      });
    });

    describe('onChangeTo', () => {
      it('keeps the start of the range and sets the end', async () => {
        const onChange = vi.fn();
        const valueFrom = new Date(2018, 0, 1);

        await render(DateTimeRangePicker, {
          ...defaultProps,
          format: 'M/d/y H:m:s',
          maxDetail: 'second',
          onChange,
          openWidgetsOnFocus: false,
          value: valueFrom,
        });

        await userEvent.fill(page.getByRole('spinbutton', { name: 'month' }).nth(1), '2');
        await userEvent.fill(page.getByRole('spinbutton', { name: 'day' }).nth(1), '15');
        await userEvent.fill(page.getByRole('spinbutton', { name: 'year' }).nth(1), '2018');
        await userEvent.fill(page.getByRole('spinbutton', { name: 'hour' }).nth(1), '12');
        await userEvent.fill(page.getByRole('spinbutton', { name: 'minute' }).nth(1), '30');
        await userEvent.fill(page.getByRole('spinbutton', { name: 'second' }).nth(1), '45');

        await vi.waitFor(() => {
          expect(onChange).toHaveBeenCalledWith([valueFrom, new Date(2018, 1, 15, 12, 30, 45)]);
        });
      });
    });
  });

  it('calls onClick when clicked on the wrapper (sample of mouse events)', async () => {
    const onclick = vi.fn();

    const { container } = await render(DateTimeRangePicker, { ...defaultProps, onclick });

    await userEvent.click(container.firstElementChild as HTMLElement);

    expect(onclick).toHaveBeenCalled();
  });

  it('calls ontouchstart when touched (sample of touch events)', async () => {
    const ontouchstart = vi.fn();

    const { container } = await render(DateTimeRangePicker, { ...defaultProps, ontouchstart });

    triggerTouchStart(container.firstElementChild as HTMLElement);

    expect(ontouchstart).toHaveBeenCalled();
  });

  it('calls onFocus when an input inside receives focus', async () => {
    const onFocus = vi.fn();

    await render(DateTimeRangePicker, { ...defaultProps, onFocus, openWidgetsOnFocus: false });

    triggerFocusEvent(page.getByRole('spinbutton', { name: 'day' }).first());

    expect(onFocus).toHaveBeenCalled();
  });

  it('renders widgets in portalContainer when given', async () => {
    const portalContainer = document.createElement('div');
    document.body.appendChild(portalContainer);

    const { container } = await render(DateTimeRangePicker, {
      ...defaultProps,
      isCalendarOpen: true,
      isClockOpen: true,
      portalContainer,
    });

    expect(portalContainer.querySelector('.svelte-calendar')).toBeInTheDocument();
    expect(portalContainer.querySelector('.svelte-clock')).toBeInTheDocument();
    expect(container.querySelector('.svelte-calendar')).not.toBeInTheDocument();

    portalContainer.remove();
  });
});
