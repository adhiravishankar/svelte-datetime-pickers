# svelte-datetimerange-picker

A datetime range picker for your Svelte 5 app, and the packages it is built from.

This is a Svelte port of [React-DateTimeRange-Picker](https://github.com/wojtekmaj/react-datetimerange-picker) and its internal dependencies. Every React dependency is replaced by a Svelte package in this monorepo:

| Package                                                          | Replaces                                                                                                   | Description                                                                 |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| [`svelte-datetimerange-picker`](packages/svelte-datetimerange-picker) | [react-datetimerange-picker](https://github.com/wojtekmaj/react-datetimerange-picker)                  | The datetime range picker.                                                  |
| [`svelte-datetime-input`](packages/svelte-datetime-input)        | `DateTimeInput` of [react-datetime-picker](https://github.com/wojtekmaj/react-datetime-picker)             | Segmented datetime input fields with a native `datetime-local` input.       |
| [`svelte-time-input`](packages/svelte-time-input)                | `TimeInput` of [react-time-picker](https://github.com/wojtekmaj/react-time-picker)                         | Segmented time input fields with a native `time` input.                     |
| [`svelte-date-input`](packages/svelte-date-input)                | `DateInput` of [react-date-picker](https://github.com/wojtekmaj/react-date-picker)                         | Segmented date input fields. Also hosts the engine shared by the other two. |
| [`svelte-range-calendar`](packages/svelte-range-calendar)        | [react-calendar](https://github.com/wojtekmaj/react-calendar)                                              | Calendar with century, decade, year and month views and range selection.    |
| [`svelte-analog-clock`](packages/svelte-analog-clock)            | [react-clock](https://github.com/wojtekmaj/react-clock)                                                    | Analog clock.                                                               |
| [`svelte-fit-action`](packages/svelte-fit-action)                | [react-fit](https://github.com/wojtekmaj/react-fit)                                                        | `fit` action keeping popups in the viewport, and `portal` action.           |

`make-event-props` and `clsx` are not needed: Svelte spreads rest props (including event handlers) onto elements and accepts arrays and objects in `class`.

## Development

```sh
yarn install
yarn build   # builds every package in dependency order
yarn unit    # runs unit tests in Chromium (run `yarn workspace svelte-datetimerange-picker playwright install chromium-headless-shell` once)
yarn tsc     # type-checks with svelte-check
yarn lint
yarn format
yarn dev     # watches the packages and starts the test page
```

- [`test`](test) is a page with controls for trying out every option of the picker.
- [`sample`](sample) is a minimal usage example that installs the published package.

## License

The MIT License.
