<script lang="ts" generics="T">
  import './Calendar.css';

  import { createDateUtils, getUserLocale } from 'svelte-date-utils';
  import { getDateAdapter } from 'svelte-date-utils';
  import { untrack } from 'svelte';

  import Navigation from './Navigation.svelte';
  import {
    addDays as addAdapterDays,
    getBegin as getDateBegin,
    getBeginOfWeek as getAdapterBeginOfWeek,
    getCalendarType,
    getDaysBetween as getAdapterDaysBetween,
    getEnd as getDateEnd,
    getRange as getDateRange,
    getWeekNumber as getAdapterWeekNumber,
    isRangeWithinRange as isDateRangeWithinRange,
    isWeekend as isAdapterWeekend,
    normalizeValue as normalizeDateValue,
    shiftDate as shiftAdapterDate,
    tileTypes,
    views,
  } from './shared/dates.js';
  import {
    formatDay as defaultFormatDay,
    formatLongDate as defaultFormatLongDate,
    formatMonth as defaultFormatMonth,
    formatMonthYear as defaultFormatMonthYear,
    formatShortWeekday as defaultFormatShortWeekday,
    formatWeekday as defaultFormatWeekday,
    formatYear as defaultFormatYear,
  } from './shared/formatters.js';

  import type { Snippet } from 'svelte';
  import type { ClassValue } from 'svelte/elements';
  import type { Formatter } from './shared/formatters.js';
  import type {
    CalendarType,
    Detail,
    LooseValue,
    NavigationAction,
    NavigationLabelArgs,
    Range,
    DateType,
    ReturnValue,
    TileArgs,
    Value,
    View,
    ViewCallbackProperties,
  } from './shared/types.js';

  type CalendarProps<T> = {
    /**
     * The beginning of the period that shall be displayed. Can be bound.
     */
    activeStartDate?: T | null;
    /**
     * Whether a partial range (only the first end selected) should be passed to `onChange`. Only applies when `selectRange` is set.
     *
     * @default false
     */
    allowPartialRange?: boolean;
    /**
     * Type of calendar that should be used. Can be `"gregory"`, `"hebrew"`, `"islamic"` or `"iso8601"`. Defaults to a type matching the locale.
     */
    calendarType?: CalendarType;
    /**
     * Class name(s) that will be added along with `"svelte-calendar"` to the main `<div>` element.
     */
    class?: ClassValue;
    /**
     * The beginning of the period that shall be displayed by default.
     */
    defaultActiveStartDate?: T;
    /**
     * Calendar view that shall be displayed by default.
     */
    defaultView?: View;
    formatDay?: Formatter<T>;
    formatLongDate?: Formatter<T>;
    formatMonth?: Formatter<T>;
    formatMonthYear?: Formatter<T>;
    formatShortWeekday?: Formatter<T>;
    formatWeekday?: Formatter<T>;
    formatYear?: Formatter<T>;
    /**
     * Whether to go to the beginning of the selected range when it changes.
     *
     * @default true
     */
    goToRangeStartOnSelect?: boolean;
    /**
     * Locale that should be used by the calendar. Can be any [IETF language tag](https://en.wikipedia.org/wiki/IETF_language_tag).
     */
    locale?: string;
    /**
     * Maximum date that the user can select. Periods partially overlapped by `maxDate` will also be selectable.
     */
    maxDate?: T;
    /**
     * The most detailed view that the user shall see. Clicking an item in this view selects a date.
     *
     * @default 'month'
     */
    maxDetail?: Detail;
    /**
     * Minimum date that the user can select. Periods partially overlapped by `minDate` will also be selectable.
     */
    minDate?: T;
    /**
     * The least detailed view that the user shall see.
     *
     * @default 'century'
     */
    minDetail?: Detail;
    navigationAriaLabel?: string;
    navigationAriaLive?: 'off' | 'polite' | 'assertive';
    /**
     * Custom content of the navigation label.
     */
    navigationLabel?: Snippet<[NavigationLabelArgs<T>]>;
    next2AriaLabel?: string;
    /**
     * Content of the "jump forward" button. Setting it to `null` hides the button.
     *
     * @default '»'
     */
    next2Label?: string | null;
    nextAriaLabel?: string;
    /**
     * Content of the "next" button. Setting it to `null` hides the button.
     *
     * @default '›'
     */
    nextLabel?: string | null;
    onActiveStartDateChange?: (args: ViewCallbackProperties<T>) => void;
    /**
     * Function called when the user selects a value. When `selectRange` is set, receives a `[from, to]` array.
     */
    onChange?: (value: Value<T>, event: MouseEvent) => void;
    onClickDay?: (value: T, event: MouseEvent) => void;
    onClickDecade?: (value: T, event: MouseEvent) => void;
    onClickMonth?: (value: T, event: MouseEvent) => void;
    onClickYear?: (value: T, event: MouseEvent) => void;
    onDrillDown?: (args: ViewCallbackProperties<T>) => void;
    onDrillUp?: (args: ViewCallbackProperties<T>) => void;
    onViewChange?: (args: ViewCallbackProperties<T>) => void;
    prev2AriaLabel?: string;
    /**
     * Content of the "jump backward" button. Setting it to `null` hides the button.
     *
     * @default '«'
     */
    prev2Label?: string | null;
    prevAriaLabel?: string;
    /**
     * Content of the "previous" button. Setting it to `null` hides the button.
     *
     * @default '‹'
     */
    prevLabel?: string | null;
    /**
     * Which dates shall be passed by the calendar to the `onChange` function when `selectRange` is not set.
     *
     * @default 'start'
     */
    returnValue?: ReturnValue;
    /**
     * Whether the user can select a range of dates.
     *
     * @default false
     */
    selectRange?: boolean;
    showFixedNumberOfWeeks?: boolean;
    /**
     * @default true
     */
    showNavigation?: boolean;
    /**
     * @default true
     */
    showNeighboringCentury?: boolean;
    /**
     * @default true
     */
    showNeighboringDecade?: boolean;
    /**
     * @default true
     */
    showNeighboringMonth?: boolean;
    /**
     * @default false
     */
    showWeekNumbers?: boolean;
    /**
     * Class name(s) added to tiles. Can be a function receiving `{ activeStartDate, date, view }`.
     */
    tileClassName?: ClassValue | ((args: TileArgs<T>) => ClassValue);
    /**
     * Custom content rendered inside tiles.
     */
    tileContent?: Snippet<[TileArgs<T>]>;
    /**
     * Function that returns `true` for dates that should be disabled.
     */
    tileDisabled?: (args: TileArgs<T>) => boolean;
    /**
     * Calendar value. Can be a single date or a range.
     */
    value?: LooseValue<T>;
    /**
     * Currently displayed view. Can be bound.
     */
    view?: View;
  };

  type TileInfo<T> = {
    ariaLabel?: string;
    classes: ClassValue[];
    date: T;
    disabled: boolean;
    label: string;
  };

  let {
    activeStartDate = $bindable(),
    allowPartialRange = false,
    calendarType,
    class: className,
    defaultActiveStartDate,
    defaultView,
    formatDay = defaultFormatDay as unknown as Formatter<T>,
    formatLongDate = defaultFormatLongDate as unknown as Formatter<T>,
    formatMonth = defaultFormatMonth as unknown as Formatter<T>,
    formatMonthYear = defaultFormatMonthYear as unknown as Formatter<T>,
    formatShortWeekday = defaultFormatShortWeekday as unknown as Formatter<T>,
    formatWeekday = defaultFormatWeekday as unknown as Formatter<T>,
    formatYear = defaultFormatYear as unknown as Formatter<T>,
    goToRangeStartOnSelect = true,
    locale,
    maxDate,
    maxDetail = 'month',
    minDate,
    minDetail = 'century',
    navigationAriaLabel,
    navigationAriaLive,
    navigationLabel,
    next2AriaLabel,
    next2Label = '»',
    nextAriaLabel,
    nextLabel = '›',
    onActiveStartDateChange,
    onChange,
    onClickDay,
    onClickDecade,
    onClickMonth,
    onClickYear,
    onDrillDown,
    onDrillUp,
    onViewChange,
    prev2AriaLabel,
    prev2Label = '«',
    prevAriaLabel,
    prevLabel = '‹',
    returnValue = 'start',
    selectRange = false,
    showFixedNumberOfWeeks = false,
    showNavigation = true,
    showNeighboringCentury = true,
    showNeighboringDecade = true,
    showNeighboringMonth = true,
    showWeekNumbers = false,
    tileClassName,
    tileContent,
    tileDisabled,
    value,
    view = $bindable(),
  }: CalendarProps<T> = $props();

  const adapter = getDateAdapter<T>('Calendar');

  const dateUtils = $derived(createDateUtils(adapter));
  const getBegin = (type: DateType, date: T) => getDateBegin(adapter, type, date);
  const getEnd = (type: DateType, date: T) => getDateEnd(adapter, type, date);
  const getRange = (type: DateType, date: T) => getDateRange(adapter, type, date);
  const normalizeValue = (value: LooseValue<T> | undefined) => normalizeDateValue(adapter, value);
  const compareBefore = (a: T, b: T) => adapter.isBefore(a, b);
  const compareAfter = (a: T, b: T) => adapter.isAfter(a, b);
  const rangeWithin = (a: Range<T>, b: Range<T>) => isDateRangeWithinRange(adapter, a, b);
  const addDays = (date: T, days: number) => addAdapterDays(adapter, date, days);
  const getBeginOfWeek = (date: T, type: CalendarType) => getAdapterBeginOfWeek(adapter, date, type);
  const getDaysBetween = (from: T, to: T) => getAdapterDaysBetween(adapter, from, to);
  const getWeekNumber = (date: T, type: CalendarType) => getAdapterWeekNumber(adapter, date, type);
  const isWeekend = (date: T, type: CalendarType) => isAdapterWeekend(adapter, date, type);
  const shiftDate = (view: View, date: T, amount: number, double = false) =>
    shiftAdapterDate(adapter, view, date, amount, double);
  const isRangeWithinRange = rangeWithin;
  const dateAt = (year: number, month: number, day = 1) =>
    adapter.setDate(adapter.setMonth(adapter.setYear(adapter.date(), year), month), day);

  const effectiveLocale = $derived(locale ?? getUserLocale());
  const effectiveCalendarType = $derived(calendarType ?? getCalendarType(effectiveLocale));
  const formatValue = (formatter: Formatter<T>, defaultFormatter: Formatter<Date>, date: T) =>
    formatter === (defaultFormatter as unknown as Formatter<T>)
      ? defaultFormatter(effectiveLocale, adapter.toJsDate(date))
      : formatter(effectiveLocale, date);

  const allowedViews = $derived(
    views.slice(
      views.indexOf(minDetail),
      Math.max(views.indexOf(maxDetail), views.indexOf(minDetail)) + 1,
    ),
  );

  function resolveView(wanted: View): View {
    if (allowedViews.includes(wanted)) {
      return wanted;
    }

    return views.indexOf(wanted) > views.indexOf(maxDetail)
      ? maxDetail
      : (allowedViews[0] ?? maxDetail);
  }

  function clampStart(date: T, forView: View): T {
    let result = date;

    if (minDate) {
      const min = getBegin(forView, minDate);
      if (compareBefore(result, min)) {
        result = min;
      }
    }

    if (maxDate) {
      const max = getBegin(forView, maxDate);
      if (compareAfter(result, max)) {
        result = max;
      }
    }

    return result;
  }

  if (activeStartDate === undefined || activeStartDate === null) {
    untrack(() => {
      const [from] = normalizeValue(value);
      const initialView = resolveView(view ?? defaultView ?? maxDetail);

      activeStartDate = clampStart(
        getBegin(initialView, defaultActiveStartDate ?? from ?? adapter.date()),
        initialView,
      );
    });
  }

  const currentView = $derived(resolveView(view ?? defaultView ?? maxDetail));
  const currentStart = $derived(activeStartDate ?? getBegin(currentView, adapter.date()));
  const viewIndex = $derived(allowedViews.indexOf(currentView));
  const tileType = $derived(tileTypes[currentView]);
  const valueType = $derived(tileTypes[maxDetail]);

  let pendingStart = $state<T | null>(null);
  let hover = $state<T | null>(null);

  let previousFromKey: string | null | undefined;

  $effect(() => {
    const [from] = normalizeValue(value);
    const fromKey = from ? dateUtils.getISOLocalDateTime(from) : null;

    // Reading `to` so that changing only the end of the range resets selection in progress too
    void normalizeValue(value)[1];

    untrack(() => {
      pendingStart = null;
      hover = null;

      if (
        previousFromKey !== undefined &&
        fromKey !== previousFromKey &&
        from &&
        goToRangeStartOnSelect
      ) {
        setStart(clampStart(getBegin(currentView, from), currentView), 'onChange');
      }

      previousFromKey = fromKey;
    });
  });

  function callbackProperties(action: NavigationAction, forView: View, start: T | null) {
    return {
      action,
      activeStartDate: start,
      value,
      view: forView,
    } satisfies ViewCallbackProperties<T>;
  }

  function setStart(next: T, action: NavigationAction) {
    activeStartDate = next;
    onActiveStartDateChange?.(callbackProperties(action, currentView, next));
  }

  function setView(next: View, nextStart: T, action: NavigationAction) {
    view = next;
    activeStartDate = nextStart;

    const properties = callbackProperties(action, next, nextStart);

    onViewChange?.(properties);
    onActiveStartDateChange?.(properties);

    if (action === 'drillDown') {
      onDrillDown?.(properties);
    } else if (action === 'drillUp') {
      onDrillUp?.(properties);
    }
  }

  function drillUp() {
    const nextView = allowedViews[viewIndex - 1];

    if (nextView) {
      setView(nextView, getBegin(nextView, currentStart), 'drillUp');
    }
  }

  function drillDown(date: T) {
    const nextView = allowedViews[viewIndex + 1];

    if (nextView) {
      setView(nextView, getBegin(nextView, date), 'drillDown');
    }
  }

  function select(date: T, event: MouseEvent) {
    if (selectRange) {
      if (!pendingStart) {
        pendingStart = date;
        hover = date;

        if (allowPartialRange) {
          onChange?.([getBegin(valueType, date), null], event);
        }

        return;
      }

      const [from, to] = compareBefore(pendingStart, date)
        ? [pendingStart, date]
        : [date, pendingStart];

      pendingStart = null;
      hover = null;

      onChange?.([getBegin(valueType, from), getEnd(valueType, to)], event);
      return;
    }

    if (returnValue === 'range') {
      onChange?.(getRange(valueType, date), event);
    } else if (returnValue === 'end') {
      onChange?.(getEnd(valueType, date), event);
    } else {
      onChange?.(getBegin(valueType, date), event);
    }
  }

  function onTileClick(date: T, event: MouseEvent) {
    const handler = {
      century: onClickDecade,
      decade: onClickYear,
      month: onClickDay,
      year: onClickMonth,
    }[currentView];
    handler?.(date, event);

    if (viewIndex < allowedViews.length - 1) {
      drillDown(date);
    } else {
      select(date, event);
    }
  }

  // Navigation
  const prevStart = $derived(shiftDate(currentView, currentStart, -1));
  const nextStart = $derived(shiftDate(currentView, currentStart, 1));
  const prev2Start = $derived(shiftDate(currentView, currentStart, -1, true));
  const next2Start = $derived(shiftDate(currentView, currentStart, 1, true));

  const prevDisabled = $derived(minDate ? compareBefore(getEnd(currentView, prevStart), minDate) : false);
  const nextDisabled = $derived(maxDate ? compareAfter(nextStart, maxDate) : false);
  const prev2Disabled = $derived(minDate ? compareBefore(getEnd(currentView, prev2Start), minDate) : false);
  const next2Disabled = $derived(maxDate ? compareAfter(next2Start, maxDate) : false);

  const navigationLabelText = $derived.by(() => {
    switch (currentView) {
      case 'century':
      case 'decade': {
        const [from, to] = getRange(currentView, currentStart);
        return `${formatValue(formatYear, defaultFormatYear, from)} – ${formatValue(formatYear, defaultFormatYear, to)}`;
      }
      case 'year':
        return formatValue(formatYear, defaultFormatYear, currentStart);
      case 'month':
        return formatValue(formatMonthYear, defaultFormatMonthYear, currentStart);
    }
  });

  // Tiles
  const selection = $derived.by((): Range<T> | null => {
    if (pendingStart) {
      return [getBegin(valueType, pendingStart), getEnd(valueType, pendingStart)];
    }

    const [from, to] = normalizeValue(value);

    return from ? [getBegin(valueType, from), getEnd(valueType, to ?? from)] : null;
  });

  const hoverRange = $derived.by((): Range<T> | null => {
    if (!selectRange || !pendingStart || !hover) {
      return null;
    }

    const [from, to] = compareBefore(pendingStart, hover)
      ? [pendingStart, hover]
      : [hover, pendingStart];

    return [getBegin(valueType, from), getEnd(valueType, to)];
  });

  function getTileClasses(date: T, base: string, modifiers: string[]): ClassValue[] {
    const tileRange = getRange(tileType, date);
    const classes: ClassValue[] = [
      'svelte-calendar__tile',
      base,
      ...modifiers.map((m) => `${base}--${m}`),
    ];
    const contains = (range: Range<T>, point: T) => isRangeWithinRange([point, point], range);

    const now = adapter.date();
    if (isRangeWithinRange(tileRange, [now, now])) {
      classes.push('svelte-calendar__tile--now');
    }

    if (selection) {
      if (isRangeWithinRange(tileRange, selection)) {
        classes.push('svelte-calendar__tile--active');
      } else if (isRangeWithinRange(selection, tileRange)) {
        classes.push('svelte-calendar__tile--hasActive');
      }

      if (selectRange) {
        const isStart = contains(tileRange, selection[0]);
        const isEnd = contains(tileRange, selection[1]);

        if (isRangeWithinRange(tileRange, selection)) {
          classes.push('svelte-calendar__tile--range');
        }
        if (isStart) {
          classes.push('svelte-calendar__tile--rangeStart');
        }
        if (isEnd) {
          classes.push('svelte-calendar__tile--rangeEnd');
        }
        if (isStart && isEnd) {
          classes.push('svelte-calendar__tile--rangeBothEnds');
        }
      }
    }

    if (hoverRange && isRangeWithinRange(hoverRange, tileRange)) {
      const isStart = contains(tileRange, hoverRange[0]);
      const isEnd = contains(tileRange, hoverRange[1]);

      classes.push('svelte-calendar__tile--hover');
      if (isStart) {
        classes.push('svelte-calendar__tile--hoverStart');
      }
      if (isEnd) {
        classes.push('svelte-calendar__tile--hoverEnd');
      }
      if (isStart && isEnd) {
        classes.push('svelte-calendar__tile--hoverBothEnds');
      }
    }

    const extra =
      typeof tileClassName === 'function'
        ? tileClassName({ activeStartDate: currentStart, date, view: currentView })
        : tileClassName;

    if (extra) {
      classes.push(extra);
    }

    return classes;
  }

  function isTileDisabled(date: T): boolean {
    const [from, to] = getRange(tileType, date);

    if ((minDate && compareBefore(to, minDate)) || (maxDate && compareAfter(from, maxDate))) {
      return true;
    }

    return tileDisabled?.({ activeStartDate: currentStart, date, view: currentView }) ?? false;
  }

  function makeTile(
    date: T,
    label: string,
    base: string,
    modifiers: string[],
    ariaLabel?: string,
  ): TileInfo<T> {
    return {
      ariaLabel,
      classes: getTileClasses(date, base, modifiers),
      date,
      disabled: isTileDisabled(date),
      label,
    };
  }

  const monthLayout = $derived.by(() => {
    if (currentView !== 'month') {
      return null;
    }

    const monthStart = dateUtils.getMonthStart(currentStart);
    const neighbors = showNeighboringMonth || showFixedNumberOfWeeks;
    const weekBegin = getBeginOfWeek(monthStart, effectiveCalendarType);
    const first = neighbors ? weekBegin : monthStart;
    const last = showFixedNumberOfWeeks
      ? addDays(weekBegin, 41)
      : neighbors
        ? addDays(getBeginOfWeek(dateUtils.getMonthEnd(monthStart), effectiveCalendarType), 6)
        : dateUtils.getMonthEnd(monthStart);
    const count = getDaysBetween(first, last) + 1;
    const blanks = neighbors ? 0 : getDaysBetween(weekBegin, monthStart);
    const rows = Math.ceil((blanks + count) / 7);

    return {
      blanks,
      tiles: Array.from({ length: count }, (_, index) => {
        const date = addDays(first, index);
        const modifiers: string[] = [];

        if (isWeekend(date, effectiveCalendarType)) {
          modifiers.push('weekend');
        }
        if (adapter.getMonth(date) !== adapter.getMonth(monthStart)) {
          modifiers.push('neighboringMonth');
        }

        return makeTile(
          date,
          formatValue(formatDay, defaultFormatDay, date),
          'svelte-calendar__month-view__days__day',
          modifiers,
          formatValue(formatLongDate, defaultFormatLongDate, date),
        );
      }),
      weekdays: Array.from({ length: 7 }, (_, index) => addDays(weekBegin, index)),
      weekNumbers: Array.from({ length: rows }, (_, index) =>
        getWeekNumber(addDays(weekBegin, index * 7), effectiveCalendarType),
      ),
    };
  });

  const otherTiles = $derived.by((): TileInfo<T>[] => {
    const year = adapter.getYear(currentStart);

    switch (currentView) {
      case 'year':
        return Array.from({ length: 12 }, (_, index) => {
          const date = dateAt(year, index, 1);

          return makeTile(
            date,
            formatValue(formatMonth, defaultFormatMonth, date),
            'svelte-calendar__year-view__months__month',
            [],
            formatValue(formatMonthYear, defaultFormatMonthYear, date),
          );
        });
      case 'decade': {
        const from = showNeighboringDecade ? -1 : 0;
        const to = showNeighboringDecade ? 11 : 9;

        return Array.from({ length: to - from + 1 }, (_, index) => {
          const date = dateAt(year + from + index, 0, 1);

          return makeTile(
            date,
            formatValue(formatYear, defaultFormatYear, date),
            'svelte-calendar__decade-view__years__year',
            index + from < 0 || index + from > 9 ? ['neighboringDecade'] : [],
          );
        });
      }
      case 'century': {
        const from = showNeighboringCentury ? -1 : 0;
        const to = showNeighboringCentury ? 10 : 9;

        return Array.from({ length: to - from + 1 }, (_, index) => {
          const offset = index + from;
          const date = dateAt(year + offset * 10, 0, 1);
          const end = dateAt(year + offset * 10 + 9, 0, 1);

          return makeTile(
            date,
            `${formatValue(formatYear, defaultFormatYear, date)} – ${formatValue(formatYear, defaultFormatYear, end)}`,
            'svelte-calendar__century-view__decades__decade',
            offset < 0 || offset > 9 ? ['neighboringCentury'] : [],
          );
        });
      }
      default:
        return [];
    }
  });
</script>

{#snippet tile(info: TileInfo<T>)}
  <button
    class={info.classes}
    disabled={info.disabled}
    onclick={(event) => onTileClick(info.date, event)}
    onfocus={() => (hover = info.date)}
    onmouseover={() => (hover = info.date)}
    type="button"
  >
    {#if info.ariaLabel}
      <abbr aria-label={info.ariaLabel}>{info.label}</abbr>
    {:else}
      {info.label}
    {/if}
    {#if tileContent}
      {@render tileContent({ activeStartDate: currentStart, date: info.date, view: currentView })}
    {/if}
  </button>
{/snippet}

{#snippet defaultLabel()}
  {#if navigationLabel}
      {@render navigationLabel({
      date: currentStart,
      label: navigationLabelText,
      locale: effectiveLocale,
      view: currentView,
    })}
  {:else}
    {navigationLabelText}
  {/if}
{/snippet}

<div class={['svelte-calendar', selectRange && 'svelte-calendar--selectRange', className]}>
  {#if showNavigation}
    <Navigation
      drillUpDisabled={viewIndex <= 0}
      label={defaultLabel}
      labelAriaLabel={navigationAriaLabel}
      labelAriaLive={navigationAriaLive}
      {next2AriaLabel}
      {next2Disabled}
      {next2Label}
      next2Visible={currentView !== 'century'}
      {nextAriaLabel}
      {nextDisabled}
      {nextLabel}
      onDrillUp={drillUp}
      onNext={() => setStart(nextStart, 'next')}
      onNext2={() => setStart(next2Start, 'next2')}
      onPrev={() => setStart(prevStart, 'prev')}
      onPrev2={() => setStart(prev2Start, 'prev2')}
      {prev2AriaLabel}
      {prev2Disabled}
      {prev2Label}
      prev2Visible={currentView !== 'century'}
      {prevAriaLabel}
      {prevDisabled}
      {prevLabel}
    />
  {/if}
  <div
    class="svelte-calendar__viewContainer"
    onmouseleave={() => (hover = null)}
    role="presentation"
  >
    {#if monthLayout}
      <div class="svelte-calendar__month-view">
        {#if showWeekNumbers}
          <div class="svelte-calendar__month-view__weekNumbers">
            {#each monthLayout.weekNumbers as weekNumber, index (index)}
              <div class="svelte-calendar__tile">{weekNumber}</div>
            {/each}
          </div>
        {/if}
        <div class="svelte-calendar__month-view__body">
          <div class="svelte-calendar__month-view__weekdays">
            {#each monthLayout.weekdays as weekday (dateUtils.getISOLocalDateTime(weekday))}
              <div class="svelte-calendar__month-view__weekdays__weekday">
                <abbr
                  aria-label={formatValue(formatWeekday, defaultFormatWeekday, weekday)}
                  title={formatValue(formatWeekday, defaultFormatWeekday, weekday)}
                >
                  {formatValue(formatShortWeekday, defaultFormatShortWeekday, weekday)}
                </abbr>
              </div>
            {/each}
          </div>
          <div class="svelte-calendar__tiles svelte-calendar__month-view__days">
            {#each { length: monthLayout.blanks } as _, index (index)}
              <div aria-hidden="true"></div>
            {/each}
            {#each monthLayout.tiles as info (dateUtils.getISOLocalDateTime(info.date))}
              {@render tile(info)}
            {/each}
          </div>
        </div>
      </div>
    {:else}
      <div class="svelte-calendar__{currentView}-view">
        <div
          class="svelte-calendar__tiles svelte-calendar__{currentView}-view__{currentView === 'year'
            ? 'months'
            : currentView === 'decade'
              ? 'years'
              : 'decades'}"
        >
          {#each otherTiles as info (dateUtils.getISOLocalDateTime(info.date))}
            {@render tile(info)}
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>
