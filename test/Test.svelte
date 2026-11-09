<script lang="ts">
  import DateTimeRangePicker from 'svelte-datetimerange-picker';
  import { AdapterDate } from 'svelte-date-utils';
  import { provideDateAdapter } from 'svelte-date-utils/svelte';

  import LocaleOptions from './LocaleOptions.svelte';
  import MaxDetailOptions from './MaxDetailOptions.svelte';
  import ValidityOptions from './ValidityOptions.svelte';
  import ValueOptions from './ValueOptions.svelte';
  import ViewOptions from './ViewOptions.svelte';

  import './Test.css';

  import type { Detail, LooseValue } from './shared/types.js';

  const now = new Date();
  const adapter = new AdapterDate();
  provideDateAdapter(adapter);

  const nineteenNinetyFive = new Date(1995, now.getUTCMonth() + 1, 15, 12);
  const fifteenthOfNextMonth = new Date(now.getUTCFullYear(), now.getUTCMonth() + 1, 15, 12);

  let portalContainer = $state<HTMLDivElement>();
  let disabled = $state(false);
  let locale = $state<string>();
  let maxDate = $state<Date | undefined>(fifteenthOfNextMonth);
  let maxDetail = $state<Detail>('minute');
  let minDate = $state<Date | undefined>(nineteenNinetyFive);
  let renderInPortal = $state(false);
  let required = $state(true);
  let showLeadingZeros = $state(true);
  let showNeighboringMonth = $state(false);
  let showWeekNumbers = $state(false);
  let value = $state<LooseValue>(now);
</script>

<div class="Test">
  <header>
    <h1>svelte-datetimerange-picker test page</h1>
  </header>
  <div class="Test__container">
    <aside class="Test__container__options">
      <MaxDetailOptions bind:maxDetail />
      <ValidityOptions bind:maxDate bind:minDate bind:required />
      <LocaleOptions bind:locale />
      <ValueOptions bind:value />
      <ViewOptions
        bind:disabled
        bind:renderInPortal
        bind:showLeadingZeros
        bind:showNeighboringMonth
        bind:showWeekNumbers
      />
    </aside>
    <main class="Test__container__content">
      <form
        onsubmit={(event) => {
          event.preventDefault();

          console.warn('Calendar triggered submitting the form.');
          console.log(event);
        }}
      >
        <DateTimeRangePicker
          calendarProps={{
            class: 'myCustomCalendarClassName',
            showNeighboringMonth,
            showWeekNumbers,
          }}
          class="myCustomDateTimeRangePickerClassName"
          data-testid="myCustomDateTimeRangePicker"
          {disabled}
          {locale}
          {maxDate}
          {maxDetail}
          {minDate}
          name="myCustomName"
          onCalendarClose={() => console.log('Calendar closed')}
          onCalendarOpen={() => console.log('Calendar opened')}
          onChange={(nextValue) => (value = nextValue)}
          onClockClose={() => console.log('Clock closed')}
          onClockOpen={() => console.log('Clock opened')}
          portalContainer={renderInPortal ? portalContainer : undefined}
          {required}
          {showLeadingZeros}
          {value}
        />
        <div bind:this={portalContainer}></div>
        <br />
        <br />
        <button type="submit">Submit</button>
      </form>
    </main>
  </div>
</div>
