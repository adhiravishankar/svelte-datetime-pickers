<script lang="ts">
  type SegmentSelectProps = {
    ariaLabel?: string;
    className: string;
    disabled?: boolean;
    form?: string;
    name: string;
    onChange: (value: string) => void;
    onNavigate: (element: HTMLElement, direction: -1 | 1) => void;
    options: { label: string; value: string }[];
    placeholder: string;
    required?: boolean;
    value: string;
  };

  let {
    ariaLabel,
    className,
    disabled,
    form,
    name,
    onChange,
    onNavigate,
    options,
    placeholder,
    required,
    value,
  }: SegmentSelectProps = $props();

  function onKeyDown(event: KeyboardEvent & { currentTarget: HTMLSelectElement }) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      onNavigate(event.currentTarget, event.key === 'ArrowLeft' ? -1 : 1);
    }
  }
</script>

<select
  aria-label={ariaLabel}
  class={[`${className}__input`, `${className}__${name}`]}
  data-input="true"
  data-segment={name}
  data-select="true"
  {disabled}
  {form}
  {name}
  onchange={(event) => onChange(event.currentTarget.value)}
  onkeydown={onKeyDown}
  {required}
  {value}
>
  <option value="">{placeholder}</option>
  {#each options as option (option.value)}
    <option value={option.value}>{option.label}</option>
  {/each}
</select>
