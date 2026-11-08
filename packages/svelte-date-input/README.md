# svelte-date-input

Segmented date input fields for your Svelte 5 app, plus the engine shared with [svelte-time-input](../svelte-time-input) and [svelte-datetime-input](../svelte-datetime-input). Svelte port of the input part of [React-Date-Picker](https://github.com/wojtekmaj/react-date-picker).

The component renders a native `<input type="date">` (hidden, used for form submission and validation) and one field per format token. Fields move focus automatically while typing and on arrow keys, and the value is only reported once all fields form a valid date.

## Installation

```sh
npm install svelte-date-input
```

Requires Svelte 5 or later.

## Usage

```svelte
<script lang="ts">
  import DateInput from 'svelte-date-input';

  let value = $state<Date | null>(new Date());
</script>

<DateInput name="date" onChange={(nextValue) => (value = nextValue)} {value} />
```

## Props

`className`, `customInputsForm`, `disabled`, `format`, `locale`, `maxDate`, `minDate`, `name`, `nativeInputAriaLabel`, `onChange(value, shouldCloseWidgets)`, `onInvalidChange`, `required`, `showLeadingZeros`, `value`, `autoFocus`, `dayAriaLabel`, `monthAriaLabel`, `yearAriaLabel`, `dayPlaceholder`, `monthPlaceholder`, `yearPlaceholder`, and `maxDetail` (`"month"` by default, or `"year"`). They behave like the props of [svelte-datetimerange-picker](../svelte-datetimerange-picker).

Fields get class names `${className}__input`, `${className}__day` (and `__month`, `__year`, …), `${className}__divider` and `${className}__leadingZero`.

## Building blocks

`SegmentedInput` (with a `kind` of `"date"`, `"time"` or `"datetime"`), `SegmentInput`, `SegmentSelect`, `Divider`, and the `parseFormat`, `getDefaultFormatParts`, `getMonthNames` and `getAmPmLabels` helpers are exported for building other inputs.

## Part of a monorepo

`svelte-date-input` is part of the [svelte-datetime-pickers monorepo](https://github.com/adhiravishankar/svelte-datetime-pickers). See the [live demo and Storybook](https://adhiravishankar.github.io/svelte-datetime-pickers/).

## License

The MIT License.
