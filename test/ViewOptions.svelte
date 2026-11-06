<script lang="ts">
  type ViewOptionsProps = {
    disabled: boolean;
    renderInPortal: boolean;
    showLeadingZeros: boolean;
    showNeighboringMonth: boolean;
    showWeekNumbers: boolean;
  };

  let {
    disabled = $bindable(),
    renderInPortal = $bindable(),
    showLeadingZeros = $bindable(),
    showNeighboringMonth = $bindable(),
    showWeekNumbers = $bindable(),
  }: ViewOptionsProps = $props();

  const uid = $props.id();
</script>

<fieldset>
  <legend>View options</legend>

  <div>
    <input bind:checked={disabled} id="{uid}-disabled" type="checkbox" />
    <label for="{uid}-disabled">Disabled</label>
  </div>

  <div>
    <input bind:checked={showLeadingZeros} id="{uid}-leading-zeros" type="checkbox" />
    <label for="{uid}-leading-zeros">Show leading zeros</label>
  </div>

  <div>
    <input bind:checked={showWeekNumbers} id="{uid}-week-numbers" type="checkbox" />
    <label for="{uid}-week-numbers">Show week numbers</label>
  </div>

  <div>
    <input bind:checked={showNeighboringMonth} id="{uid}-neighboring-month" type="checkbox" />
    <label for="{uid}-neighboring-month">Show neighboring month's days</label>
  </div>

  <div>
    <input bind:checked={renderInPortal} id="{uid}-portal" type="checkbox" />
    <label for="{uid}-portal">Render in portal</label>
  </div>
</fieldset>
