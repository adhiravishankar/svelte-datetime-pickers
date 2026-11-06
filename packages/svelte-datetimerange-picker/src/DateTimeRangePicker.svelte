<script lang="ts">
  import './DateTimeRangePicker.css';

  import { untrack } from 'svelte';
  import { Clock } from 'svelte-analog-clock';
  import { DateTimeInput } from 'svelte-datetime-input';
  import { fit, portal } from 'svelte-fit-action';
  import { Calendar } from 'svelte-range-calendar';

  import type { ComponentProps, Snippet } from 'svelte';
  import type { ClassValue, HTMLAttributes } from 'svelte/elements';
  import type { CloseReason, Detail, LooseValue, OpenReason, Value } from './shared/types.js';

  const baseClassName = 'svelte-datetimerange-picker';
  const outsideActionEvents = ['mousedown', 'focusin', 'touchstart'] as const;
  const allViews = ['hour', 'minute', 'second'] as const;

  type CalendarProps = Omit<ComponentProps<typeof Calendar>, 'onChange' | 'selectRange' | 'value'>;

  type ClockProps = Omit<ComponentProps<typeof Clock>, 'value'>;

  type DateTimeRangePickerProps = {
    /** `aria-label` for the AM/PM select input. */
    amPmAriaLabel?: string;
    /** Automatically focuses the input on mount. */
    autoFocus?: boolean;
    /** `aria-label` for the calendar button. */
    calendarAriaLabel?: string;
    /**
     * Content of the calendar button: a string or a snippet. Setting the value explicitly to `null` will hide the button.
     */
    calendarIcon?: Snippet | string | null;
    /** Props to pass to the Calendar component. */
    calendarProps?: CalendarProps;
    /**
     * Class name(s) that will be added along with `"svelte-datetimerange-picker"` to the main `<div>` element.
     *
     * @example 'class1 class2'
     * @example ['class1', 'class2 class3']
     */
    class?: ClassValue;
    /** `aria-label` for the clear button. */
    clearAriaLabel?: string;
    /**
     * Content of the clear button: a string or a snippet. Setting the value explicitly to `null` will hide the button.
     */
    clearIcon?: Snippet | string | null;
    /** Props to pass to the Clock component. */
    clockProps?: ClockProps;
    /**
     * Whether to close the widgets on value selection. **Note**: It's recommended to use `shouldCloseWidgets` function instead.
     *
     * @default true
     */
    closeWidgets?: boolean;
    /** `form` attribute for the custom day, month, year, hour, minute, second, and AM/PM inputs. */
    customInputsForm?: string;
    /** `aria-label` for the day input. */
    dayAriaLabel?: string;
    /**
     * `placeholder` for the day input.
     *
     * @default '--'
     */
    dayPlaceholder?: string;
    /**
     * When set to `true`, will remove the calendar and the button toggling its visibility.
     *
     * @default false
     */
    disableCalendar?: boolean;
    /**
     * When set to `true`, will remove the clock.
     *
     * @default false
     */
    disableClock?: boolean;
    /**
     * Whether the date time range picker should be disabled.
     *
     * @default false
     */
    disabled?: boolean;
    /**
     * Input format based on [Unicode Technical Standard #35](https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table). Supported values are: `y`, `M`, `MM`, `MMM`, `MMMM`, `d`, `dd`, `H`, `HH`, `h`, `hh`, `m`, `mm`, `s`, `ss`, `a`.
     *
     * @example 'y-MM-dd h:mm:ss a'
     */
    format?: string;
    /** `aria-label` for the hour input. */
    hourAriaLabel?: string;
    /**
     * `placeholder` for the hour input.
     *
     * @default '--'
     */
    hourPlaceholder?: string;
    /**
     * Whether the calendar should be opened.
     *
     * @default false
     */
    isCalendarOpen?: boolean | null;
    /**
     * Whether the clock should be opened.
     *
     * @default false
     */
    isClockOpen?: boolean | null;
    /**
     * Locale that should be used by the datetime picker and the calendar. Can be any [IETF language tag](https://en.wikipedia.org/wiki/IETF_language_tag).
     *
     * @example 'hu-HU'
     */
    locale?: string;
    /** Maximum date that the user can select. */
    maxDate?: Date;
    /**
     * The most detailed calendar view that the user shall see. Can be `"hour"`, `"minute"` or `"second"`.
     *
     * @default 'minute'
     */
    maxDetail?: Detail;
    /** Minimum date that the user can select. */
    minDate?: Date;
    /** `aria-label` for the minute input. */
    minuteAriaLabel?: string;
    /**
     * `placeholder` for the minute input.
     *
     * @default '--'
     */
    minutePlaceholder?: string;
    /** `aria-label` for the month input. */
    monthAriaLabel?: string;
    /**
     * `placeholder` for the month input.
     *
     * @default '--'
     */
    monthPlaceholder?: string;
    /**
     * Input name.
     *
     * @default 'datetimerange'
     */
    name?: string;
    /** `aria-label` for the native datetime input. */
    nativeInputAriaLabel?: string;
    /** Function called when the calendar closes. */
    onCalendarClose?: () => void;
    /** Function called when the calendar opens. */
    onCalendarOpen?: () => void;
    /** Function called when the user picks a valid datetime. */
    onChange?: (value: Value) => void;
    /** Function called when the clock closes. */
    onClockClose?: () => void;
    /** Function called when the clock opens. */
    onClockOpen?: () => void;
    /** Function called when the user focuses an input. */
    onFocus?: (event: FocusEvent) => void;
    /** Function called when the user picks an invalid datetime. */
    onInvalidChange?: () => void;
    /**
     * Whether to open the widgets on input focus. **Note**: It's recommended to use `shouldOpenWidgets` function instead.
     *
     * @default true
     */
    openWidgetsOnFocus?: boolean;
    /**
     * Element to render the widgets in.
     *
     * @example document.getElementById('my-div')
     */
    portalContainer?: HTMLElement | null;
    /**
     * Divider between datetime inputs: a string or a snippet.
     *
     * @default '–'
     */
    rangeDivider?: Snippet | string;
    /**
     * Whether datetime input should be required.
     *
     * @default false
     */
    required?: boolean;
    /** `aria-label` for the second input. */
    secondAriaLabel?: string;
    /**
     * `placeholder` for the second input.
     *
     * @default '--'
     */
    secondPlaceholder?: string;
    /**
     * Function called before the widgets close. `reason` can be `"buttonClick"`, `"escape"`, `"outsideAction"`, or `"select"`. `widget` can be `"calendar"` or `"clock"`. If it returns `false`, the widget will not close.
     */
    shouldCloseWidgets?: (props: { reason: CloseReason; widget: 'calendar' | 'clock' }) => boolean;
    /**
     * Function called before the widgets open. `reason` can be `"buttonClick"` or `"focus"`. `widget` can be `"calendar"` or `"clock"`. If it returns `false`, the widget will not open.
     */
    shouldOpenWidgets?: (props: { reason: OpenReason; widget: 'calendar' | 'clock' }) => boolean;
    /**
     * Whether leading zeros should be rendered in datetime inputs.
     *
     * @default false
     */
    showLeadingZeros?: boolean;
    /**
     * Input value.
     *
     * @example new Date(2017, 0, 1, 22, 15)
     * @example [new Date(2017, 0, 1, 22, 15), new Date(2017, 0, 1, 23, 45)]
     * @example ["2017-01-01T22:15:00", "2017-01-01T23:45:00"]
     */
    value?: LooseValue;
    /** `aria-label` for the year input. */
    yearAriaLabel?: string;
    /**
     * `placeholder` for the year input.
     *
     * @default '----'
     */
    yearPlaceholder?: string;
  } & Omit<HTMLAttributes<HTMLDivElement>, 'class' | 'onchange' | 'onfocus'>;

  let {
    amPmAriaLabel,
    autoFocus,
    calendarAriaLabel,
    calendarIcon,
    calendarProps,
    class: className,
    clearAriaLabel,
    clearIcon,
    clockProps,
    closeWidgets: shouldCloseWidgetsOnSelect = true,
    customInputsForm,
    dayAriaLabel,
    dayPlaceholder,
    disableCalendar,
    disableClock,
    disabled,
    format,
    hourAriaLabel,
    hourPlaceholder,
    isCalendarOpen: isCalendarOpenProps = null,
    isClockOpen: isClockOpenProps = null,
    locale,
    maxDate,
    maxDetail = 'minute',
    minDate,
    minuteAriaLabel,
    minutePlaceholder,
    monthAriaLabel,
    monthPlaceholder,
    name = 'datetimerange',
    nativeInputAriaLabel,
    onCalendarClose,
    onCalendarOpen,
    onChange: onChangeProps,
    onClockClose,
    onClockOpen,
    onFocus: onFocusProps,
    onInvalidChange,
    openWidgetsOnFocus = true,
    portalContainer,
    rangeDivider = '–',
    required,
    secondAriaLabel,
    secondPlaceholder,
    shouldCloseWidgets,
    shouldOpenWidgets,
    showLeadingZeros,
    value,
    yearAriaLabel,
    yearPlaceholder,
    ...otherProps
  }: DateTimeRangePickerProps = $props();

  let isCalendarOpen = $state<boolean | null>(untrack(() => isCalendarOpenProps));
  let isClockOpen = $state<boolean | null>(untrack(() => isClockOpenProps));
  let wrapper = $state<HTMLDivElement>();
  let calendarWrapper = $state<HTMLDivElement>();
  let clockWrapper = $state<HTMLDivElement>();

  $effect(() => {
    isCalendarOpen = isCalendarOpenProps;
  });

  $effect(() => {
    isClockOpen = isClockOpenProps;
  });

  const valueFrom = $derived(Array.isArray(value) ? value[0] : value);
  const valueTo = $derived(Array.isArray(value) ? value[1] : undefined);

  function openCalendar({ reason }: { reason: OpenReason }) {
    if (shouldOpenWidgets && !shouldOpenWidgets({ reason, widget: 'calendar' })) {
      return;
    }

    isClockOpen = isClockOpen ? false : isCalendarOpen;
    isCalendarOpen = true;

    onCalendarOpen?.();
  }

  function closeCalendar({ reason }: { reason: CloseReason }) {
    if (shouldCloseWidgets && !shouldCloseWidgets({ reason, widget: 'calendar' })) {
      return;
    }

    isCalendarOpen = false;

    onCalendarClose?.();
  }

  function toggleCalendar() {
    if (isCalendarOpen) {
      closeCalendar({ reason: 'buttonClick' });
    } else {
      openCalendar({ reason: 'buttonClick' });
    }
  }

  function openClock({ reason }: { reason: OpenReason }) {
    if (shouldOpenWidgets && !shouldOpenWidgets({ reason, widget: 'clock' })) {
      return;
    }

    isCalendarOpen = isCalendarOpen ? false : isCalendarOpen;
    isClockOpen = true;

    onClockOpen?.();
  }

  function closeClock({ reason }: { reason: CloseReason }) {
    if (shouldCloseWidgets && !shouldCloseWidgets({ reason, widget: 'clock' })) {
      return;
    }

    isClockOpen = false;

    onClockClose?.();
  }

  function closeAllWidgets({ reason }: { reason: CloseReason }) {
    closeCalendar({ reason });
    closeClock({ reason });
  }

  function onChange(nextValue: Value, shouldCloseWidgets = shouldCloseWidgetsOnSelect) {
    if (shouldCloseWidgets) {
      closeAllWidgets({ reason: 'select' });
    }

    onChangeProps?.(nextValue);
  }

  function onChangeFrom(nextValueFrom: Date | null, shouldCloseWidgets: boolean) {
    onChange([nextValueFrom, valueTo ? new Date(valueTo) : null], shouldCloseWidgets);
  }

  function onChangeTo(nextValueTo: Date | null, shouldCloseWidgets: boolean) {
    onChange([valueFrom ? new Date(valueFrom) : null, nextValueTo], shouldCloseWidgets);
  }

  function withTimeOf(date: Date | null, source: string | Date | null | undefined): Date | null {
    if (!source || !date) {
      return date;
    }

    const sourceDate = new Date(source);
    const result = new Date(date);

    result.setHours(
      sourceDate.getHours(),
      sourceDate.getMinutes(),
      sourceDate.getSeconds(),
      sourceDate.getMilliseconds(),
    );

    return result;
  }

  function onDateChange(nextValue: Value, shouldCloseWidgets?: boolean) {
    // The calendar passes an array of values when selectRange is enabled
    const [rawNextValueFrom, rawNextValueTo] = Array.isArray(nextValue) ? nextValue : [nextValue];

    onChange(
      [
        withTimeOf(rawNextValueFrom ?? null, valueFrom),
        withTimeOf(rawNextValueTo ?? null, valueTo),
      ],
      shouldCloseWidgets,
    );
  }

  function onFocus(event: FocusEvent & { target: EventTarget | null }) {
    onFocusProps?.(event);

    const target = event.target as HTMLInputElement | null;

    if (disabled || !openWidgetsOnFocus || !target || target.dataset.select === 'true') {
      return;
    }

    switch (target.name) {
      case 'day':
      case 'month':
      case 'year': {
        if (isCalendarOpen) {
          return;
        }

        openCalendar({ reason: 'focus' });
        break;
      }
      case 'hour12':
      case 'hour24':
      case 'minute':
      case 'second': {
        if (isClockOpen) {
          return;
        }

        openClock({ reason: 'focus' });
        break;
      }
      default:
    }
  }

  function clear() {
    onChange(null);
  }

  function stopPropagation(event: Event) {
    event.stopPropagation();
  }

  function onOutsideAction(event: Event) {
    // Try event.composedPath first to handle clicks inside a Shadow DOM.
    const target = (event.composedPath?.()[0] ?? event.target) as Node | null;

    if (
      target &&
      wrapper &&
      !wrapper.contains(target) &&
      !calendarWrapper?.contains(target) &&
      !clockWrapper?.contains(target)
    ) {
      closeAllWidgets({ reason: 'outsideAction' });
    }
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeAllWidgets({ reason: 'escape' });
    }
  }

  $effect(() => {
    if (!isCalendarOpen && !isClockOpen) {
      return;
    }

    for (const eventName of outsideActionEvents) {
      document.addEventListener(eventName, onOutsideAction);
    }

    document.addEventListener('keydown', onKeyDown);

    return () => {
      for (const eventName of outsideActionEvents) {
        document.removeEventListener(eventName, onOutsideAction);
      }

      document.removeEventListener('keydown', onKeyDown);
    };
  });

  const commonInputProps = $derived({
    amPmAriaLabel,
    className: `${baseClassName}__inputGroup`,
    customInputsForm,
    dayAriaLabel,
    dayPlaceholder,
    disabled,
    format,
    hourAriaLabel,
    hourPlaceholder,
    locale,
    maxDate,
    maxDetail,
    minDate,
    minuteAriaLabel,
    minutePlaceholder,
    monthAriaLabel,
    monthPlaceholder,
    nativeInputAriaLabel,
    onInvalidChange,
    required,
    secondAriaLabel,
    secondPlaceholder,
    showLeadingZeros,
    yearAriaLabel,
    yearPlaceholder,
  });

  const maxDetailIndex = $derived(allViews.indexOf(maxDetail));
</script>

{#snippet defaultCalendarIcon()}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="19"
    height="19"
    viewBox="0 0 19 19"
    stroke="black"
    stroke-width="2"
    aria-hidden="true"
    class="{baseClassName}__calendar-button__icon {baseClassName}__button__icon"
  >
    <rect fill="none" height="15" width="15" x="2" y="2" />
    <line x1="6" x2="6" y1="0" y2="4" />
    <line x1="13" x2="13" y1="0" y2="4" />
  </svg>
{/snippet}

{#snippet defaultClearIcon()}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="19"
    height="19"
    viewBox="0 0 19 19"
    stroke="black"
    stroke-width="2"
    aria-hidden="true"
    class="{baseClassName}__clear-button__icon {baseClassName}__button__icon"
  >
    <line x1="4" x2="15" y1="4" y2="15" />
    <line x1="15" x2="4" y1="4" y2="15" />
  </svg>
{/snippet}

{#snippet calendar()}
  <Calendar
    {locale}
    {maxDate}
    {minDate}
    onChange={(nextValue) => onDateChange(nextValue)}
    selectRange
    {value}
    {...calendarProps}
  />
{/snippet}

{#snippet clock()}
  <Clock
    {locale}
    renderMinuteHand={maxDetailIndex > 0}
    renderSecondHand={maxDetailIndex > 1}
    value={valueFrom}
    {...clockProps}
  />
{/snippet}

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  {...otherProps}
  bind:this={wrapper}
  class={[
    baseClassName,
    `${baseClassName}--${isCalendarOpen || isClockOpen ? 'open' : 'closed'}`,
    `${baseClassName}--${disabled ? 'disabled' : 'enabled'}`,
    className,
  ]}
  onfocusin={onFocus}
>
  <div class="{baseClassName}__wrapper">
    <DateTimeInput
      {...commonInputProps}
      {autoFocus}
      name="{name}_from"
      onChange={onChangeFrom}
      value={valueFrom}
    />
    <span class="{baseClassName}__range-divider" data-testid="range-divider">
      {#if typeof rangeDivider === 'function'}
        {@render rangeDivider()}
      {:else}
        {rangeDivider}
      {/if}
    </span>
    <DateTimeInput
      {...commonInputProps}
      name="{name}_to"
      onChange={onChangeTo}
      value={valueTo}
    />
    {#if clearIcon !== null}
      <button
        aria-label={clearAriaLabel}
        class="{baseClassName}__clear-button {baseClassName}__button"
        data-testid="clear-button"
        {disabled}
        onclick={clear}
        onfocusin={stopPropagation}
        type="button"
      >
        {#if clearIcon === undefined}
          {@render defaultClearIcon()}
        {:else if typeof clearIcon === 'function'}
          {@render clearIcon()}
        {:else}
          {clearIcon}
        {/if}
      </button>
    {/if}
    {#if calendarIcon !== null && !disableCalendar}
      <button
        aria-expanded={isCalendarOpen || false}
        aria-label={calendarAriaLabel}
        class="{baseClassName}__calendar-button {baseClassName}__button"
        data-testid="calendar-button"
        {disabled}
        onclick={toggleCalendar}
        onfocusin={stopPropagation}
        type="button"
      >
        {#if calendarIcon === undefined}
          {@render defaultCalendarIcon()}
        {:else if typeof calendarIcon === 'function'}
          {@render calendarIcon()}
        {:else}
          {calendarIcon}
        {/if}
      </button>
    {/if}
  </div>

  {#if isCalendarOpen !== null && !disableCalendar}
    {#if portalContainer}
      <div
        bind:this={calendarWrapper}
        class={[`${baseClassName}__calendar`, `${baseClassName}__calendar--${isCalendarOpen ? 'open' : 'closed'}`]}
        use:portal={portalContainer}
      >
        {@render calendar()}
      </div>
    {:else}
      <div
        class={[`${baseClassName}__calendar`, `${baseClassName}__calendar--${isCalendarOpen ? 'open' : 'closed'}`]}
        use:fit={{ enabled: isCalendarOpen }}
      >
        {@render calendar()}
      </div>
    {/if}
  {/if}

  {#if isClockOpen !== null && !disableClock}
    {#if portalContainer}
      <div
        bind:this={clockWrapper}
        class={[`${baseClassName}__clock`, `${baseClassName}__clock--${isClockOpen ? 'open' : 'closed'}`]}
        use:portal={portalContainer}
      >
        {@render clock()}
      </div>
    {:else}
      <div
        class={[`${baseClassName}__clock`, `${baseClassName}__clock--${isClockOpen ? 'open' : 'closed'}`]}
        use:fit={{ enabled: isClockOpen }}
      >
        {@render clock()}
      </div>
    {/if}
  {/if}
</div>
