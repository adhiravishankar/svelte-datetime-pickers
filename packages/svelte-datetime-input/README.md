# svelte-datetime-input

Segmented datetime input fields for your Svelte 5 app. Svelte port of `DateTimeInput` from [React-DateTime-Picker](https://github.com/wojtekmaj/react-datetime-picker), built on [svelte-date-input](../svelte-date-input).

## Installation

```sh
npm install svelte-datetime-input svelte-date-utils
```

Requires Svelte 5 or later. It installs `svelte-date-input` as a dependency.

## Usage

```svelte
<script lang="ts">
  import DateTimeInput from 'svelte-datetime-input';
  import { AdapterDate } from 'svelte-date-utils';
  import { provideDateAdapter } from 'svelte-date-utils/svelte';

  provideDateAdapter(new AdapterDate());
  let value = $state<Date | null>(new Date());
</script>

<DateTimeInput name="datetime" onChange={(nextValue) => (value = nextValue)} {value} />
```

The adapter is required and comes from Svelte context. Call `provideDateAdapter(adapter)` in this component or an ancestor before rendering `DateTimeInput`; without it, the input throws an error. The adapter determines the date object type accepted by `value` and returned by `onChange`. `AdapterDate` uses native `Date`; date-fns, Luxon and `@internationalized/date` adapters are exported from `svelte-date-utils/date-fns`, `svelte-date-utils/luxon` and `svelte-date-utils/internationalized`.

The component renders a native `<input type="datetime-local">` (hidden, used for form submission and validation) and one field per format token.

## Props

`maxDetail` (`"hour"`, `"minute"` by default, or `"second"`), `format`, `locale`, `minDate`, `maxDate`, `disabled`, `required`, `autoFocus`, `className`, `customInputsForm`, `name`, `nativeInputAriaLabel`, `showLeadingZeros`, `onChange(value, shouldCloseWidgets)`, `onInvalidChange`, `value`, and the `*AriaLabel` and `*Placeholder` props for every field. See [svelte-date-input](../svelte-date-input) for details.

## Part of a monorepo

`svelte-datetime-input` is part of the [svelte-datetime-pickers monorepo](https://github.com/adhiravishankar/svelte-datetime-pickers). See the [live demo and Storybook](https://adhiravishankar.github.io/svelte-datetime-pickers/).

## License

The MIT License.
