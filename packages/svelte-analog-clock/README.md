# svelte-analog-clock

An analog clock for your Svelte 5 app. Svelte port of [React-Clock](https://github.com/wojtekmaj/react-clock).

## Installation

```sh
npm install svelte-analog-clock svelte-date-utils
```

Requires Svelte 5 or later.

## Usage

```svelte
<script lang="ts">
  import Clock from 'svelte-analog-clock';
  import { AdapterDate } from 'svelte-date-utils';
  import { provideDateAdapter } from 'svelte-date-utils';

  provideDateAdapter(new AdapterDate());
</script>

<Clock value={new Date()} />
```

Install `svelte-date-utils` alongside the clock. Its adapter is required and comes from Svelte context. Call `provideDateAdapter(adapter)` in this component or an ancestor before rendering `Clock`; without it, the clock throws an error. The adapter determines the date object type accepted by `value`. `AdapterDate` uses native `Date`; date-fns, Luxon and `@internationalized/date` adapters are exported from `svelte-date-utils/date-fns`, `svelte-date-utils/luxon` and `svelte-date-utils/internationalized`.

Styles are imported automatically. Elements use BEM class names starting with `svelte-clock`.

## Props

| Prop name                                                                  | Description                                                                                                                    | Default value           |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| class                                                                      | Class name(s) added along with `"svelte-clock"`.                                                                               | n/a                     |
| formatHour                                                                 | `(locale, hour) => string`, used for numbers rendered with `renderNumbers`.                                                    | `Intl.NumberFormat`     |
| hourHandLength, minuteHandLength, secondHandLength                         | Hand lengths, in percents of the clock radius.                                                                                 | `50`, `70`, `90`        |
| hourHandOppositeLength, minuteHandOppositeLength, secondHandOppositeLength | Lengths of the tails of the hands, in percents of the clock radius.                                                            | `10`                    |
| hourHandWidth, minuteHandWidth, secondHandWidth                            | Hand widths, in pixels.                                                                                                        | `4`, `2`, `1`           |
| hourMarksLength, minuteMarksLength                                         | Mark lengths, in percents of the clock radius.                                                                                 | `10`, `6`               |
| hourMarksWidth, minuteMarksWidth                                           | Mark widths, in pixels.                                                                                                        | `3`, `1`                |
| locale                                                                     | Locale used to format hour numbers.                                                                                            | User's browser settings |
| renderHourMarks, renderMinuteMarks                                         | Whether to render marks.                                                                                                       | `true`                  |
| renderMinuteHand, renderSecondHand                                         | Whether to render hands.                                                                                                       | `true`                  |
| renderNumbers                                                              | Whether to render hour numbers.                                                                                                | `false`                 |
| size                                                                       | Clock size, in pixels.                                                                                                         | `150`                   |
| useMillisecondPrecision                                                    | Whether the second hand moves smoothly. Only applies when `value` is `undefined`.                                              | `false`                 |
| value                                                                      | A `Date` or a time string such as `"22:15:30"`. `undefined` shows the current time and keeps ticking; `null` renders no hands. | current time            |

## Part of a monorepo

`svelte-analog-clock` is part of the [svelte-datetime-pickers monorepo](https://github.com/adhiravishankar/svelte-datetime-pickers). See the [live demo and Storybook](https://adhiravishankar.github.io/svelte-datetime-pickers/).

## License

The MIT License.
