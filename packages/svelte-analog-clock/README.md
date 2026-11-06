# svelte-analog-clock

An analog clock for your Svelte 5 app. Svelte port of [React-Clock](https://github.com/wojtekmaj/react-clock).

## Usage

```svelte
<script lang="ts">
  import Clock from 'svelte-analog-clock';
</script>

<Clock value={new Date()} />
```

Styles are imported automatically. Elements use BEM class names starting with `svelte-clock`.

## Props

| Prop name                                                          | Description                                                                                                       | Default value                  |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| class                                                              | Class name(s) added along with `"svelte-clock"`.                                                                  | n/a                            |
| formatHour                                                         | `(locale, hour) => string`, used for numbers rendered with `renderNumbers`.                                       | `Intl.NumberFormat`            |
| hourHandLength, minuteHandLength, secondHandLength                 | Hand lengths, in percents of the clock radius.                                                                    | `50`, `70`, `90`               |
| hourHandOppositeLength, minuteHandOppositeLength, secondHandOppositeLength | Lengths of the tails of the hands, in percents of the clock radius.                                       | `10`                           |
| hourHandWidth, minuteHandWidth, secondHandWidth                    | Hand widths, in pixels.                                                                                           | `4`, `2`, `1`                  |
| hourMarksLength, minuteMarksLength                                 | Mark lengths, in percents of the clock radius.                                                                    | `10`, `6`                      |
| hourMarksWidth, minuteMarksWidth                                   | Mark widths, in pixels.                                                                                           | `3`, `1`                       |
| locale                                                             | Locale used to format hour numbers.                                                                               | User's browser settings        |
| renderHourMarks, renderMinuteMarks                                 | Whether to render marks.                                                                                          | `true`                         |
| renderMinuteHand, renderSecondHand                                 | Whether to render hands.                                                                                          | `true`                         |
| renderNumbers                                                      | Whether to render hour numbers.                                                                                   | `false`                        |
| size                                                               | Clock size, in pixels.                                                                                            | `150`                          |
| useMillisecondPrecision                                            | Whether the second hand moves smoothly. Only applies when `value` is `undefined`.                                 | `false`                        |
| value                                                              | A `Date` or a time string such as `"22:15:30"`. `undefined` shows the current time and keeps ticking; `null` renders no hands. | current time        |

## License

The MIT License.
