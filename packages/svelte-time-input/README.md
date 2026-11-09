# svelte-time-input

Segmented time input fields for your Svelte 5 app. Svelte port of the input part of [React-Time-Picker](https://github.com/wojtekmaj/react-time-picker), built on [svelte-date-input](../svelte-date-input).

## Installation

```sh
npm install svelte-time-input svelte-date-utils
```

Requires Svelte 5 or later. It installs `svelte-date-input` as a dependency.

## Usage

```svelte
<script lang="ts">
  import TimeInput from 'svelte-time-input';
  import { AdapterDate } from 'svelte-date-utils';
  import { provideDateAdapter } from 'svelte-date-utils/svelte';

  provideDateAdapter(new AdapterDate());
  let value = $state<string | null>('22:15');
</script>

<TimeInput name="time" onChange={(nextValue) => (value = nextValue)} {value} />
```

The adapter is required and comes from Svelte context. Call `provideDateAdapter(adapter)` in this component or an ancestor before rendering `TimeInput`; without it, the input throws an error. The public time value remains an `HH:mm[:ss]` string, while the adapter supplies date operations used internally. `AdapterDate` uses native `Date`; date-fns, Luxon and `@internationalized/date` adapters are exported from `svelte-date-utils/date-fns`, `svelte-date-utils/luxon` and `svelte-date-utils/internationalized`.

`value` is an `HH:mm[:ss]` string (a `Date` is accepted too) and `onChange` receives such a string, or `null`.

## Props

`maxDetail` (`"hour"`, `"minute"` by default, or `"second"`), `format`, `locale`, `disabled`, `required`, `autoFocus`, `className`, `customInputsForm`, `name`, `nativeInputAriaLabel`, `showLeadingZeros`, `onChange`, `onInvalidChange`, and the `hour`/`minute`/`second`/`amPm` `*AriaLabel` and `*Placeholder` props. See [svelte-date-input](../svelte-date-input) for details.

## Part of a monorepo

`svelte-time-input` is part of the [svelte-datetime-pickers monorepo](https://github.com/adhiravishankar/svelte-datetime-pickers). See the [live demo and Storybook](https://adhiravishankar.github.io/svelte-datetime-pickers/).

## License

The MIT License.
