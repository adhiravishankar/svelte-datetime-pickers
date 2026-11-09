<script lang="ts" generics="T">
  import './Clock.css';
  import type { DateAdapter } from 'svelte-date-utils';

  import type { ClassValue } from 'svelte/elements';

  type ClockProps<T> = {
    /** Date adapter used to parse time values. Required. */
    adapter: DateAdapter<T>;
    /**
     * Class name(s) that will be added along with `"svelte-clock"` to the main `<time>` element.
     */
    class?: ClassValue;
    /**
     * Function that formats hour numbers rendered when `renderNumbers` is set. Receives the locale and an hour from 1 to 12.
     */
    formatHour?: (locale: string | undefined, hour: number) => string;
    /**
     * Hour hand length, in percents of the clock radius.
     *
     * @default 50
     */
    hourHandLength?: number;
    /**
     * Hour hand opposite length, in percents of the clock radius.
     *
     * @default 10
     */
    hourHandOppositeLength?: number;
    /**
     * Hour hand width, in pixels.
     *
     * @default 4
     */
    hourHandWidth?: number;
    /**
     * Hour marks length, in percents of the clock radius.
     *
     * @default 10
     */
    hourMarksLength?: number;
    /**
     * Hour marks width, in pixels.
     *
     * @default 3
     */
    hourMarksWidth?: number;
    /**
     * Locale used to format hour numbers.
     *
     * @example 'hu-HU'
     */
    locale?: string;
    /**
     * Minute hand length, in percents of the clock radius.
     *
     * @default 70
     */
    minuteHandLength?: number;
    /**
     * Minute hand opposite length, in percents of the clock radius.
     *
     * @default 10
     */
    minuteHandOppositeLength?: number;
    /**
     * Minute hand width, in pixels.
     *
     * @default 2
     */
    minuteHandWidth?: number;
    /**
     * Minute marks length, in percents of the clock radius.
     *
     * @default 6
     */
    minuteMarksLength?: number;
    /**
     * Minute marks width, in pixels.
     *
     * @default 1
     */
    minuteMarksWidth?: number;
    /**
     * Whether hour marks should be rendered.
     *
     * @default true
     */
    renderHourMarks?: boolean;
    /**
     * Whether the minute hand should be rendered.
     *
     * @default true
     */
    renderMinuteHand?: boolean;
    /**
     * Whether minute marks should be rendered.
     *
     * @default true
     */
    renderMinuteMarks?: boolean;
    /**
     * Whether hour numbers should be rendered.
     *
     * @default false
     */
    renderNumbers?: boolean;
    /**
     * Whether the second hand should be rendered.
     *
     * @default true
     */
    renderSecondHand?: boolean;
    /**
     * Second hand length, in percents of the clock radius.
     *
     * @default 90
     */
    secondHandLength?: number;
    /**
     * Second hand opposite length, in percents of the clock radius.
     *
     * @default 10
     */
    secondHandOppositeLength?: number;
    /**
     * Second hand width, in pixels.
     *
     * @default 1
     */
    secondHandWidth?: number;
    /**
     * Clock size, in pixels.
     *
     * @default 150
     */
    size?: number;
    /**
     * Whether the second hand should move smoothly. Only applies when `value` is `undefined`.
     *
     * @default false
     */
    useMillisecondPrecision?: boolean;
    /**
     * Time to display. When `undefined`, the clock shows the current time and keeps ticking. When `null`, no hands are rendered.
     *
     * @example new Date()
     * @example '22:15:00'
     */
    value?: T | string | null;
  };

  let {
    adapter,
    class: className,
    formatHour = (locale, hour) => new Intl.NumberFormat(locale).format(hour),
    hourHandLength = 50,
    hourHandOppositeLength = 10,
    hourHandWidth = 4,
    hourMarksLength = 10,
    hourMarksWidth = 3,
    locale,
    minuteHandLength = 70,
    minuteHandOppositeLength = 10,
    minuteHandWidth = 2,
    minuteMarksLength = 6,
    minuteMarksWidth = 1,
    renderHourMarks = true,
    renderMinuteHand = true,
    renderMinuteMarks = true,
    renderNumbers = false,
    renderSecondHand = true,
    secondHandLength = 90,
    secondHandOppositeLength = 10,
    secondHandWidth = 1,
    size = 150,
    useMillisecondPrecision = false,
    value,
  }: ClockProps<T> = $props();

  if (!adapter) throw new Error('Clock requires a date adapter.');

  const hourMarks = Array.from({ length: 12 }, (_, index) => index);
  const minuteMarks = Array.from({ length: 60 }, (_, index) => index).filter(
    (index) => index % 5 !== 0,
  );

  let now = $state(adapter.date());

  $effect(() => {
    if (value !== undefined) {
      return;
    }

    now = adapter.date();

    if (useMillisecondPrecision) {
      let frame = requestAnimationFrame(function tick() {
        now = adapter.date();
        frame = requestAnimationFrame(tick);
      });

      return () => cancelAnimationFrame(frame);
    }

    const interval = setInterval(() => {
      now = adapter.date();
    }, 1000);

    return () => clearInterval(interval);
  });

  function parseTime(input: T | string): T | null {
    if (typeof input !== 'string') return adapter.isValid(input) ? input : null;
    // Time-only strings, e.g. "22:15" or "22:15:30"
    const match = /^(\d{1,2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?$/.exec(input);

    if (match) {
      let date = adapter.date();
      date = adapter.setHours(date, Number(match[1]));
      date = adapter.setMinutes(date, Number(match[2]));
      date = adapter.setSeconds(date, Number(match[3] ?? 0));
      date = adapter.setMilliseconds(date, Number((match[4] ?? '0').padEnd(3, '0').slice(0, 3)));
      return date;
    }

    const date = adapter.date(input);
    return adapter.isValid(date) ? date : null;
  }

  const date = $derived(value === undefined ? now : value === null ? null : parseTime(value));

  const angles = $derived.by(() => {
    if (!date) {
      return null;
    }

    const hours = adapter.getHours(date) % 12;
    const minutes = adapter.getMinutes(date);
    const seconds = adapter.getSeconds(date);
    const milliseconds = useMillisecondPrecision ? adapter.getMilliseconds(date) : 0;

    return {
      hour: hours * 30 + minutes * 0.5 + seconds / 120,
      minute: minutes * 6 + seconds * 0.1,
      second: seconds * 6 + milliseconds * 0.006,
    };
  });

  const datetime = $derived(date ? adapter.toJsDate(date).toISOString() : undefined);
</script>

{#snippet hand(
  name: string,
  angle: number,
  length: number,
  oppositeLength: number,
  width: number,
)}
  <div class="svelte-clock__hand svelte-clock__{name}-hand" style:transform="rotate({angle}deg)">
    <div
      class="svelte-clock__hand__body svelte-clock__{name}-hand__body"
      style:width="{width}px"
      style:top="{50 - length / 2}%"
      style:bottom="{50 - oppositeLength / 2}%"
    ></div>
  </div>
{/snippet}

<time class={['svelte-clock', className]} {datetime} style:width="{size}px" style:height="{size}px">
  <div class="svelte-clock__face">
    {#if renderMinuteMarks}
      {#each minuteMarks as index (index)}
        <div class="svelte-clock__mark svelte-clock__minute-mark" style:transform="rotate({index * 6}deg)">
          <div
            class="svelte-clock__mark__body svelte-clock__minute-mark__body"
            style:width="{minuteMarksWidth}px"
            style:bottom="{100 - minuteMarksLength / 2}%"
          ></div>
        </div>
      {/each}
    {/if}
    {#if renderHourMarks}
      {#each hourMarks as index (index)}
        <div class="svelte-clock__mark svelte-clock__hour-mark" style:transform="rotate({index * 30}deg)">
          <div
            class="svelte-clock__mark__body svelte-clock__hour-mark__body"
            style:width="{hourMarksWidth}px"
            style:bottom="{100 - hourMarksLength / 2}%"
          ></div>
        </div>
      {/each}
    {/if}
    {#if renderNumbers}
      {#each hourMarks as index (index)}
        {@const hourNumber = index === 0 ? 12 : index}
        <div class="svelte-clock__mark" style:transform="rotate({index * 30}deg)">
          <div
            class="svelte-clock__mark__number"
            style:top="{hourMarksLength}%"
            style:transform="rotate({-index * 30}deg)"
          >
            {formatHour(locale, hourNumber)}
          </div>
        </div>
      {/each}
    {/if}
  </div>
  {#if angles}
    {@render hand('hour', angles.hour, hourHandLength, hourHandOppositeLength, hourHandWidth)}
    {#if renderMinuteHand}
      {@render hand(
        'minute',
        angles.minute,
        minuteHandLength,
        minuteHandOppositeLength,
        minuteHandWidth,
      )}
    {/if}
    {#if renderSecondHand}
      {@render hand(
        'second',
        angles.second,
        secondHandLength,
        secondHandOppositeLength,
        secondHandWidth,
      )}
    {/if}
  {/if}
</time>
