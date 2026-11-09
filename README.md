# svelte-datetimerange-picker

A datetime range picker for your Svelte 5 app, and the packages it is built from.

This is a Svelte port of [React-DateTimeRange-Picker](https://github.com/wojtekmaj/react-datetimerange-picker) and its internal dependencies. Every React dependency is replaced by a Svelte package in this monorepo:

| Package                                                               | Replaces                                                                                       | Description                                                                                            |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [`svelte-datetimerange-picker`](packages/svelte-datetimerange-picker) | [react-datetimerange-picker](https://github.com/wojtekmaj/react-datetimerange-picker)          | The datetime range picker.                                                                             |
| [`svelte-datetime-input`](packages/svelte-datetime-input)             | `DateTimeInput` of [react-datetime-picker](https://github.com/wojtekmaj/react-datetime-picker) | Segmented datetime input fields with a native `datetime-local` input.                                  |
| [`svelte-time-input`](packages/svelte-time-input)                     | `TimeInput` of [react-time-picker](https://github.com/wojtekmaj/react-time-picker)             | Segmented time input fields with a native `time` input.                                                |
| [`svelte-date-input`](packages/svelte-date-input)                     | `DateInput` of [react-date-picker](https://github.com/wojtekmaj/react-date-picker)             | Segmented date input fields. Also hosts the engine shared by the other two.                            |
| [`svelte-range-calendar`](packages/svelte-range-calendar)             | [react-calendar](https://github.com/wojtekmaj/react-calendar)                                  | Calendar with century, decade, year and month views and range selection.                               |
| [`svelte-analog-clock`](packages/svelte-analog-clock)                 | [react-clock](https://github.com/wojtekmaj/react-clock)                                        | Analog clock.                                                                                          |
| [`svelte-fit-action`](packages/svelte-fit-action)                     | [react-fit](https://github.com/wojtekmaj/react-fit)                                            | `fit` action keeping popups in the viewport, and `portal` action.                                      |
| [`svelte-date-utils`](packages/svelte-date-utils)                     | [@wojtekmaj/date-utils](https://github.com/wojtekmaj/date-utils)                               | Date helpers on native `Date`, date-fns, Day.js, Luxon or `@internationalized/date`, through adapters. |

`svelte-date-utils` keeps the API of `@wojtekmaj/date-utils` and adds `createDateUtils(adapter)`. It includes `AdapterDateFns`, `AdapterDayjs`, `AdapterLuxon` and `AdapterInternationalizedDate`, available from `svelte-date-utils/date-fns`, `svelte-date-utils/dayjs`, `svelte-date-utils/luxon` and `svelte-date-utils/internationalized` respectively. Svelte date components get their adapter from context; provide it once in an ancestor component with `provideDateAdapter` from `svelte-date-utils`. If no adapter is provided, a date component throws an error.

To use the Day.js adapter, install Day.js as an optional peer dependency:

```sh
npm install svelte-date-utils dayjs
```

```ts
import dayjs from 'dayjs';
import 'dayjs/locale/de';
import { createDateUtils } from 'svelte-date-utils';
import { AdapterDayjs } from 'svelte-date-utils/dayjs';

const dateUtils = createDateUtils(new AdapterDayjs({ locale: 'de' }));
const monthStart = dateUtils.getMonthStart(dayjs('2026-11-08'));
```

Day.js values are `Dayjs` objects. Import the Day.js locale you want to use before configuring the adapter; `weekStartsOn` can override that locale's first day of the week.

To use the `@internationalized/date` adapter, install that optional peer dependency:

```sh
npm install svelte-date-utils @internationalized/date
```

```ts
import { parseDate } from '@internationalized/date';
import { createDateUtils } from 'svelte-date-utils';
import { AdapterInternationalizedDate } from 'svelte-date-utils/internationalized';

const dateUtils = createDateUtils(new AdapterInternationalizedDate({ locale: 'en-GB' }));
const monthStart = dateUtils.getMonthStart(parseDate('2026-11-08'));
```

The adapter works with `CalendarDate`, `CalendarDateTime` and `ZonedDateTime` values. Set `locale` to control locale-based week rules; `weekStartsOn` can override the first day of the week.

The Svelte components emit and accept the values used by the adapter: native `Date` with `AdapterDate` or `AdapterDateFns`, Day.js `Dayjs` with `AdapterDayjs`, Luxon `DateTime` with `AdapterLuxon`, and `CalendarDate`, `CalendarDateTime` or `ZonedDateTime` with `AdapterInternationalizedDate`. For example, configure a date-fns adapter in a parent component, then render the picker beneath it:

```svelte
<script lang="ts">
  import DateTimeRangePicker from 'svelte-datetimerange-picker';
  import { AdapterDateFns } from 'svelte-date-utils/date-fns';
  import { provideDateAdapter } from 'svelte-date-utils';

  provideDateAdapter(new AdapterDateFns());

  let value = $state<[Date | null, Date | null]>([null, null]);
</script>

<DateTimeRangePicker {value} onChange={(nextValue) => (value = nextValue)} />
```

`make-event-props` and `clsx` are not needed: Svelte spreads rest props (including event handlers) onto elements and accepts arrays and objects in `class`.

## Install and usage

```sh
npm install svelte-datetimerange-picker
```

```svelte
<script lang="ts">
  import DateTimeRangePicker from 'svelte-datetimerange-picker';
  import { AdapterDate } from 'svelte-date-utils';
  import { provideDateAdapter } from 'svelte-date-utils';

  type ValuePiece = Date | null;

  type Value = ValuePiece | [ValuePiece, ValuePiece];

  provideDateAdapter(new AdapterDate());

  let value = $state<Value>([new Date(), new Date()]);
</script>

<DateTimeRangePicker onChange={(nextValue) => (value = nextValue)} {value} />
```

See the [picker README](packages/svelte-datetimerange-picker) for all props.

**Live demo:** the [sample page and Storybook](https://adhiravishankar.github.io/svelte-datetime-pickers/) are published on GitHub Pages.

## Development

Requires Node.js `^22.18.0`, `^24.11.0` or `>=26.0.0` (Vitest 5) and the npm version pinned in `packageManager` in the root `package.json`.

The repo uses TypeScript 6 and [Vite+](https://viteplus.dev): `vp test` runs the tests, `vp dev` / `vp build` run the test page, and `vp lint` / `vp fmt` (Oxlint and Oxfmt) lint and format the code. Packages are built with `@sveltejs/package`.

**Svelte files are not auto-formatted:** Oxfmt does not support `.svelte` files yet, so only their `<script>` blocks are linted (by Oxlint) and the files are otherwise formatted by hand.

```sh
npm install
npm run build        # builds every package in dependency order
npm test             # runs lint, type checks, format checks and unit tests in every package
npm run unit         # runs unit tests in Chromium
npm run tsc          # type-checks with svelte-check
npm run lint
npm run format
npm run dev          # watches the packages and starts the test page
npm run build:pages  # builds sample + storybook into _site/ for GitHub Pages
npm run publish:dry  # builds, tests and type-checks, then a publish dry run
npm run publish:all  # publishes every library to npm (--otp, --tag, --skip-checks)
```

Run `npm exec --workspace svelte-datetimerange-picker -- playwright install chromium-headless-shell` once before `npm run unit`.

`.npmrc` sets `min-release-age=14`, so dependencies must be at least 14 days old.

- [`test`](test) is a page with controls for trying out every option of the picker.
- [`sample`](sample) is a minimal usage example built with [Astro](https://astro.build). Run `npm install` at the repo root first (it resolves the picker through the workspace), then `cd sample && npm install && npm run dev`.
- [`storybook`](storybook) is a [Storybook](https://storybook.js.org) with stories for the six component packages. It is not part of the workspaces: `cd storybook && npm install && npm run dev` (port 6006).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

The MIT License.
