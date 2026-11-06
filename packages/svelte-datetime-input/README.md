# svelte-datetime-input

Segmented datetime input fields for your Svelte 5 app. Svelte port of `DateTimeInput` from [React-DateTime-Picker](https://github.com/wojtekmaj/react-datetime-picker), built on [svelte-date-input](../svelte-date-input).

## Usage

```svelte
<script lang="ts">
  import DateTimeInput from 'svelte-datetime-input';

  let value = $state<Date | null>(new Date());
</script>

<DateTimeInput name="datetime" onChange={(nextValue) => (value = nextValue)} {value} />
```

The component renders a native `<input type="datetime-local">` (hidden, used for form submission and validation) and one field per format token.

## Props

`maxDetail` (`"hour"`, `"minute"` by default, or `"second"`), `format`, `locale`, `minDate`, `maxDate`, `disabled`, `required`, `autoFocus`, `className`, `customInputsForm`, `name`, `nativeInputAriaLabel`, `showLeadingZeros`, `onChange(value, shouldCloseWidgets)`, `onInvalidChange`, `value`, and the `*AriaLabel` and `*Placeholder` props for every field. See [svelte-date-input](../svelte-date-input) for details.

## License

The MIT License.
