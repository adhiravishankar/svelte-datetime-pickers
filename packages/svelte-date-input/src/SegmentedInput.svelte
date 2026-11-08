<script lang="ts">
  import { getDaysInMonth, getUserLocale } from 'svelte-date-utils';
  import { onMount, untrack } from 'svelte';

  import Divider from './Divider.svelte';
  import SegmentInput from './SegmentInput.svelte';
  import SegmentSelect from './SegmentSelect.svelte';
  import {
    composeDate,
    emptyFields,
    fieldBySegment,
    fieldsFromDate,
    formatTime,
    fromNativeValue,
    toNativeValue,
    valueToDate,
  } from './shared/fields.js';
  import {
    getAmPmLabels,
    getDefaultFormatParts,
    getMonthNames,
    parseFormat,
  } from './shared/format.js';

  import type { Fields } from './shared/fields.js';
  import type { InputDetail, InputKind, LooseValuePiece, SegmentName } from './shared/types.js';

  type SegmentedInputProps = {
    /** `aria-label` for the AM/PM select. */
    amPmAriaLabel?: string;
    /** Automatically focuses the first field on mount. */
    autoFocus?: boolean;
    /** Base class name. Fields get `${className}__input`, dividers get `${className}__divider`, and so on. */
    className?: string;
    /** `form` attribute for the custom fields (but not the native input). */
    customInputsForm?: string;
    dayAriaLabel?: string;
    /** @default '--' */
    dayPlaceholder?: string;
    disabled?: boolean;
    /**
     * Input format based on Unicode Technical Standard #35. Supported tokens: `y`, `M`, `MM`, `MMM`, `MMMM`, `d`, `dd`, `H`, `HH`, `h`, `hh`, `m`, `mm`, `s`, `ss`, `a`.
     */
    format?: string;
    hourAriaLabel?: string;
    /** @default '--' */
    hourPlaceholder?: string;
    /** Which kind of value the input edits. */
    kind: InputKind;
    locale?: string;
    maxDate?: Date;
    /** The most detailed field the user shall see. */
    maxDetail?: InputDetail;
    minDate?: Date;
    minuteAriaLabel?: string;
    /** @default '--' */
    minutePlaceholder?: string;
    monthAriaLabel?: string;
    /** @default '--' */
    monthPlaceholder?: string;
    /** `name` of the native input. */
    name?: string;
    nativeInputAriaLabel?: string;
    /** Called when the value changes. For the `time` kind, the value is an `HH:mm[:ss]` string. */
    onChange?: (value: Date | string | null, shouldCloseWidgets: boolean) => void;
    /** Called when the fields contain an incomplete or invalid value. */
    onInvalidChange?: () => void;
    required?: boolean;
    secondAriaLabel?: string;
    /** @default '--' */
    secondPlaceholder?: string;
    showLeadingZeros?: boolean;
    value?: LooseValuePiece;
    yearAriaLabel?: string;
    /** @default '----' */
    yearPlaceholder?: string;
  };

  let {
    amPmAriaLabel,
    autoFocus,
    className = '',
    customInputsForm,
    dayAriaLabel,
    dayPlaceholder = '--',
    disabled,
    format,
    hourAriaLabel,
    hourPlaceholder = '--',
    kind,
    locale,
    maxDate,
    maxDetail,
    minDate,
    minuteAriaLabel,
    minutePlaceholder = '--',
    monthAriaLabel,
    monthPlaceholder = '--',
    name,
    nativeInputAriaLabel,
    onChange,
    onInvalidChange,
    required,
    secondAriaLabel,
    secondPlaceholder = '--',
    showLeadingZeros = false,
    value,
    yearAriaLabel,
    yearPlaceholder = '----',
  }: SegmentedInputProps = $props();

  let root = $state<HTMLDivElement>();

  const resolvedLocale = $derived(locale ?? getUserLocale());
  const detail = $derived<InputDetail>(maxDetail ?? (kind === 'date' ? 'month' : 'minute'));
  const parts = $derived(
    format ? parseFormat(format) : getDefaultFormatParts(resolvedLocale, kind, detail),
  );
  const present = $derived(
    new Set(parts.flatMap((part) => (part.type === 'segment' ? [part.segment] : []))),
  );
  const use12Hours = $derived(present.has('hour12'));
  const dividers = $derived(
    [...new Set(parts.flatMap((part) => (part.type === 'literal' ? [...part.text] : [])))]
      .filter((character) => !/\d/.test(character))
      .join(''),
  );

  const amPmLabels = $derived(getAmPmLabels(resolvedLocale));
  const amPmOptions = $derived([
    { label: amPmLabels[0], value: 'am' },
    { label: amPmLabels[1], value: 'pm' },
  ]);

  let fields = $state<Fields>(emptyFields());

  const dateValue = $derived(valueToDate(value, kind));
  // Primitive key, so that parents passing equal-but-new Date objects don't reset the fields
  const valueKey = $derived(
    dateValue
      ? kind === 'time'
        ? dateValue.getHours() * 3600 + dateValue.getMinutes() * 60 + dateValue.getSeconds()
        : dateValue.getTime()
      : null,
  );

  $effect(() => {
    void valueKey;
    const twelveHours = use12Hours;

    untrack(() => {
      fields = dateValue ? fieldsFromDate(dateValue, twelveHours) : emptyFields();
    });
  });

  function emit(date: Date): Date | string {
    return kind === 'time' ? formatTime(date, detail) : date;
  }

  function process(nextFields: Fields) {
    fields = nextFields;

    const result = composeDate({
      detail,
      fields: nextFields,
      max: kind === 'time' ? undefined : maxDate,
      min: kind === 'time' ? undefined : minDate,
      present,
      use12Hours,
    });

    switch (result.status) {
      case 'empty':
        if (valueKey !== null) {
          onChange?.(null, false);
        }
        break;
      case 'valid':
        onChange?.(emit(result.date), false);
        break;
      default:
        onInvalidChange?.();
    }
  }

  function setField(field: keyof Fields, next: string) {
    process({ ...fields, [field]: next });
  }

  function onNativeChange(event: Event & { currentTarget: HTMLInputElement }) {
    const date = fromNativeValue(event.currentTarget.value, kind);

    if (date) {
      fields = fieldsFromDate(date, use12Hours);
      onChange?.(emit(date), false);
    } else {
      fields = emptyFields();
      onChange?.(null, false);
    }
  }

  function navigate(element: HTMLElement, direction: -1 | 1) {
    const segments = [...(root?.querySelectorAll<HTMLElement>('[data-segment]') ?? [])];
    const target = segments[segments.indexOf(element) + direction];

    if (target) {
      target.focus();
    }
  }

  onMount(() => {
    if (autoFocus) {
      root?.querySelector<HTMLElement>('[data-segment]')?.focus();
    }
  });

  const nativeType = $derived(
    kind === 'date' ? 'date' : kind === 'time' ? 'time' : 'datetime-local',
  );
  const nativeStep = $derived(
    kind === 'date' ? undefined : detail === 'second' ? 1 : detail === 'hour' ? 3600 : 60,
  );
  const nativeValue = $derived(dateValue ? toNativeValue(dateValue, kind, detail) : '');
  const nativeMin = $derived(
    minDate && kind !== 'time' ? toNativeValue(minDate, kind, detail) : undefined,
  );
  const nativeMax = $derived(
    maxDate && kind !== 'time' ? toNativeValue(maxDate, kind, detail) : undefined,
  );

  const ariaLabels = $derived<Record<SegmentName, string | undefined>>({
    amPm: amPmAriaLabel,
    day: dayAriaLabel,
    hour12: hourAriaLabel,
    hour24: hourAriaLabel,
    minute: minuteAriaLabel,
    month: monthAriaLabel,
    second: secondAriaLabel,
    year: yearAriaLabel,
  });

  const placeholders = $derived<Record<SegmentName, string>>({
    amPm: '--',
    day: dayPlaceholder,
    hour12: hourPlaceholder,
    hour24: hourPlaceholder,
    minute: minutePlaceholder,
    month: monthPlaceholder,
    second: secondPlaceholder,
    year: yearPlaceholder,
  });

  function getBounds(segment: SegmentName): { max: number; maxLength: number; min: number } {
    switch (segment) {
      case 'year':
        return {
          max: maxDate && kind !== 'time' ? maxDate.getFullYear() : 275760,
          maxLength: 4,
          min: minDate && kind !== 'time' ? minDate.getFullYear() : 1,
        };
      case 'month':
        return { max: 12, maxLength: 2, min: 1 };
      case 'day': {
        const year = Number(fields.year);
        const month = Number(fields.month);
        const daysInMonth =
          fields.year && fields.month && month >= 1 && month <= 12
            ? getDaysInMonth(new Date(year, month - 1, 1))
            : 31;

        return { max: daysInMonth, maxLength: 2, min: 1 };
      }
      case 'hour12':
        return { max: 12, maxLength: 2, min: 1 };
      case 'hour24':
        return { max: 23, maxLength: 2, min: 0 };
      case 'minute':
      case 'second':
        return { max: 59, maxLength: 2, min: 0 };
      default:
        return { max: 0, maxLength: 0, min: 0 };
    }
  }

  function getMonthOptions(token: string) {
    return getMonthNames(resolvedLocale, token === 'MMM' ? 'short' : 'long').map(
      (label, index) => ({
        label,
        value: String(index + 1),
      }),
    );
  }
</script>

<div bind:this={root} class={className}>
  <input
    aria-label={nativeInputAriaLabel}
    {disabled}
    max={nativeMax}
    min={nativeMin}
    {name}
    onchange={onNativeChange}
    {required}
    step={nativeStep}
    style="visibility: hidden; position: absolute; z-index: -999;"
    type={nativeType}
    value={nativeValue}
  />
  {#each parts as part, index (index)}
    {#if part.type === 'literal'}
      <Divider class="{className}__divider" text={part.text} />
    {:else if part.segment === 'amPm'}
      <SegmentSelect
        ariaLabel={ariaLabels.amPm}
        {className}
        {disabled}
        form={customInputsForm}
        name="amPm"
        onChange={(next) => setField('amPm', next)}
        onNavigate={navigate}
        options={amPmOptions}
        placeholder={placeholders.amPm}
        {required}
        value={fields.amPm}
      />
    {:else if part.segment === 'month' && part.token.length >= 3}
      <SegmentSelect
        ariaLabel={ariaLabels.month}
        {className}
        {disabled}
        form={customInputsForm}
        name="month"
        onChange={(next) => setField('month', next)}
        onNavigate={navigate}
        options={getMonthOptions(part.token)}
        placeholder={placeholders.month}
        {required}
        value={fields.month}
      />
    {:else}
      {@const bounds = getBounds(part.segment)}
      {@const field = fieldBySegment[part.segment]}
      <SegmentInput
        ariaLabel={ariaLabels[part.segment]}
        {className}
        {disabled}
        {dividers}
        form={customInputsForm}
        max={bounds.max}
        maxLength={bounds.maxLength}
        min={bounds.min}
        name={part.segment}
        onChange={(next) => setField(field, next)}
        onNavigate={navigate}
        placeholder={placeholders[part.segment]}
        {required}
        showLeadingZeros={part.segment !== 'year' && (showLeadingZeros || part.token.length === 2)}
        value={fields[field]}
      />
    {/if}
  {/each}
</div>
