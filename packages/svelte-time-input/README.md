# svelte-time-input

Segmented time input fields for your Svelte 5 app. Svelte port of the input part of [React-Time-Picker](https://github.com/wojtekmaj/react-time-picker), built on [svelte-date-input](../svelte-date-input).

## Usage

```svelte
<script lang="ts">
  import TimeInput from 'svelte-time-input';

  let value = $state<string | null>('22:15');
</script>

<TimeInput name="time" onChange={(nextValue) => (value = nextValue)} {value} />
```

`value` is an `HH:mm[:ss]` string (a `Date` is accepted too) and `onChange` receives such a string, or `null`.

## Props

`maxDetail` (`"hour"`, `"minute"` by default, or `"second"`), `format`, `locale`, `disabled`, `required`, `autoFocus`, `className`, `customInputsForm`, `name`, `nativeInputAriaLabel`, `showLeadingZeros`, `onChange`, `onInvalidChange`, and the `hour`/`minute`/`second`/`amPm` `*AriaLabel` and `*Placeholder` props. See [svelte-date-input](../svelte-date-input) for details.

## License

The MIT License.
