<script lang="ts">
  import type { Snippet } from 'svelte';

  type NavigationProps = {
    drillUpDisabled: boolean;
    label: Snippet;
    labelAriaLabel?: string;
    labelAriaLive?: 'off' | 'polite' | 'assertive';
    next2AriaLabel?: string;
    next2Disabled: boolean;
    next2Label: string | null;
    next2Visible: boolean;
    nextAriaLabel?: string;
    nextDisabled: boolean;
    nextLabel: string | null;
    onDrillUp: () => void;
    onNext: () => void;
    onNext2: () => void;
    onPrev: () => void;
    onPrev2: () => void;
    prev2AriaLabel?: string;
    prev2Disabled: boolean;
    prev2Label: string | null;
    prev2Visible: boolean;
    prevAriaLabel?: string;
    prevDisabled: boolean;
    prevLabel: string | null;
  };

  let {
    drillUpDisabled,
    label,
    labelAriaLabel,
    labelAriaLive,
    next2AriaLabel,
    next2Disabled,
    next2Label,
    next2Visible,
    nextAriaLabel,
    nextDisabled,
    nextLabel,
    onDrillUp,
    onNext,
    onNext2,
    onPrev,
    onPrev2,
    prev2AriaLabel,
    prev2Disabled,
    prev2Label,
    prev2Visible,
    prevAriaLabel,
    prevDisabled,
    prevLabel,
  }: NavigationProps = $props();
</script>

<div class="svelte-calendar__navigation">
  {#if prev2Label !== null && prev2Visible}
    <button
      aria-label={prev2AriaLabel}
      class="svelte-calendar__navigation__arrow svelte-calendar__navigation__prev2-button"
      disabled={prev2Disabled}
      onclick={onPrev2}
      type="button"
    >
      {prev2Label}
    </button>
  {/if}
  {#if prevLabel !== null}
    <button
      aria-label={prevAriaLabel}
      class="svelte-calendar__navigation__arrow svelte-calendar__navigation__prev-button"
      disabled={prevDisabled}
      onclick={onPrev}
      type="button"
    >
      {prevLabel}
    </button>
  {/if}
  <button
    aria-label={labelAriaLabel}
    aria-live={labelAriaLive}
    class="svelte-calendar__navigation__label"
    disabled={drillUpDisabled}
    onclick={onDrillUp}
    style:flex-grow="1"
    type="button"
  >
    <span class="svelte-calendar__navigation__label__labelText">
      {@render label()}
    </span>
  </button>
  {#if nextLabel !== null}
    <button
      aria-label={nextAriaLabel}
      class="svelte-calendar__navigation__arrow svelte-calendar__navigation__next-button"
      disabled={nextDisabled}
      onclick={onNext}
      type="button"
    >
      {nextLabel}
    </button>
  {/if}
  {#if next2Label !== null && next2Visible}
    <button
      aria-label={next2AriaLabel}
      class="svelte-calendar__navigation__arrow svelte-calendar__navigation__next2-button"
      disabled={next2Disabled}
      onclick={onNext2}
      type="button"
    >
      {next2Label}
    </button>
  {/if}
</div>
