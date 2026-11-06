<script lang="ts">
  let { locale = $bindable() }: { locale: string | undefined } = $props();

  const uid = $props.id();

  const presets = [
    { label: 'Auto', value: undefined },
    { label: 'en-US', value: 'en-US' },
    { label: 'fr-FR', value: 'fr-FR' },
    { label: 'ar-EG', value: 'ar-EG' },
  ];

  const localePattern = '^[a-z]{2}(-[A-Z0-9]{2,3})?$';

  let customLocale = $state<HTMLInputElement>();

  function onCustomSubmit(event: SubmitEvent) {
    event.preventDefault();

    locale = customLocale?.value;
  }
</script>

<fieldset>
  <legend>Locale</legend>

  {#each presets as preset (preset.label)}
    <div>
      <input
        checked={locale === preset.value}
        id="{uid}-{preset.label}"
        name="locale"
        onchange={() => (locale = preset.value)}
        type="radio"
      />
      <label for="{uid}-{preset.label}">{preset.label}</label>
    </div>
  {/each}
  <form onsubmit={onCustomSubmit}>
    <label for="{uid}-custom">Custom locale:</label>
    &nbsp;
    {#key locale}
      <input
        bind:this={customLocale}
        id="{uid}-custom"
        name="customLocale"
        pattern={localePattern}
        type="text"
        value={locale ?? ''}
      />
    {/key}
    &nbsp;
    <button style="display: none" type="submit">Set locale</button>
    <button disabled={locale === undefined} onclick={() => (locale = undefined)} type="button">
      Reset locale
    </button>
  </form>
</fieldset>
