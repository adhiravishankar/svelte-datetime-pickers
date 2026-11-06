# svelte-range-calendar

A calendar for your Svelte 5 app, with century, decade, year and month views and range selection. Svelte port of [React-Calendar](https://github.com/wojtekmaj/react-calendar).

## Usage

```svelte
<script lang="ts">
  import Calendar from 'svelte-range-calendar';

  let value = $state<Date | [Date | null, Date | null] | null>(new Date());
</script>

<Calendar onChange={(nextValue) => (value = nextValue)} selectRange {value} />
```

Styles are imported automatically. Elements use BEM class names starting with `svelte-calendar`.

`value` is controlled: update it from `onChange`. With `selectRange`, `onChange` is called with `[from, to]` once both ends are selected (`to` is the end of the last day).

## Props

| Prop name                                                     | Description                                                                                                         | Default value                    |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| value                                                         | A `Date`, a date string, or a `[from, to]` array of them.                                                           | n/a                              |
| onChange                                                      | `(value, event) => void`, called when the user selects a value.                                                     | n/a                              |
| selectRange                                                   | Whether the user selects a range.                                                                                   | `false`                          |
| allowPartialRange                                             | Whether `onChange` is called with `[from, null]` after the first click of a range.                                  | `false`                          |
| returnValue                                                   | `"start"`, `"end"` or `"range"`; which date `onChange` receives when `selectRange` is off.                          | `"start"`                        |
| minDate, maxDate                                              | Dates the user can select. Partially overlapping periods stay selectable.                                           | n/a                              |
| minDetail, maxDetail                                          | Least and most detailed view: `"century"`, `"decade"`, `"year"`, `"month"`.                                         | `"century"`, `"month"`           |
| view (bindable), defaultView                                  | Displayed view.                                                                                                     | `maxDetail`                      |
| activeStartDate (bindable), defaultActiveStartDate            | Beginning of the displayed period.                                                                                  | start of the value, or today     |
| goToRangeStartOnSelect                                        | Whether to go to the start of the value when it changes.                                                            | `true`                           |
| locale, calendarType                                          | Locale, and `"gregory"`, `"hebrew"`, `"islamic"` or `"iso8601"`. The type defaults to one matching the locale.      | browser locale                   |
| showNavigation, showNeighboringMonth, showWeekNumbers, showFixedNumberOfWeeks, showNeighboringDecade, showNeighboringCentury | Display options.                            | `true`, `true`, `false`, `false`, `true`, `true` |
| prevLabel, nextLabel, prev2Label, next2Label                  | Navigation button content. `null` hides the button.                                                                 | `‹`, `›`, `«`, `»`               |
| prevAriaLabel, nextAriaLabel, prev2AriaLabel, next2AriaLabel, navigationAriaLabel, navigationAriaLive | Accessibility labels.                                               | n/a                              |
| navigationLabel                                               | Snippet receiving `{ date, label, locale, view }`.                                                                  | n/a                              |
| tileClassName, tileContent, tileDisabled                      | Class (or function), snippet and predicate receiving `{ activeStartDate, date, view }`.                             | n/a                              |
| formatDay, formatLongDate, formatMonth, formatMonthYear, formatShortWeekday, formatWeekday, formatYear | `(locale, date) => string` formatters.                             | `Intl.DateTimeFormat`            |
| onActiveStartDateChange, onViewChange, onDrillDown, onDrillUp | Called with `{ action, activeStartDate, value, view }`.                                                             | n/a                              |
| onClickDay, onClickMonth, onClickYear, onClickDecade          | `(date, event) => void`.                                                                                            | n/a                              |
| class                                                         | Class name(s) added along with `"svelte-calendar"`.                                                                 | n/a                              |

## License

The MIT License.
