<script lang="ts">
  type SegmentInputProps = {
    ariaLabel?: string;
    /** Base class name; the input gets `${className}__input` and `${className}__${name}`. */
    className: string;
    disabled?: boolean;
    /** Characters that move focus to the next field when typed. */
    dividers?: string;
    form?: string;
    max: number;
    maxLength: number;
    min: number;
    name: string;
    onChange: (value: string) => void;
    onNavigate: (element: HTMLElement, direction: -1 | 1) => void;
    placeholder: string;
    required?: boolean;
    showLeadingZeros?: boolean;
    value: string;
  };

  let {
    ariaLabel,
    className,
    disabled,
    dividers = '',
    form,
    max,
    maxLength,
    min,
    name,
    onChange,
    onNavigate,
    placeholder,
    required,
    showLeadingZeros = false,
    value,
  }: SegmentInputProps = $props();

  const hasLeadingZero = $derived(showLeadingZeros && value !== '' && Number(value) < 10);

  function onInput(event: Event & { currentTarget: HTMLInputElement }) {
    const element = event.currentTarget;
    const raw = element.value.replace(/\D/g, '');
    const normalized = raw === '' ? '' : String(Number(raw));

    element.value = normalized;
    onChange(normalized);

    if (raw.length >= maxLength || (raw !== '' && Number(raw) * 10 > max)) {
      onNavigate(element, 1);
    }
  }

  function onKeyDown(event: KeyboardEvent & { currentTarget: HTMLInputElement }) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }

    const element = event.currentTarget;

    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      onNavigate(element, event.key === 'ArrowLeft' ? -1 : 1);
    } else if (event.key === 'Backspace' && element.value === '') {
      event.preventDefault();
      onNavigate(element, -1);
    } else if (event.key.length === 1 && dividers.includes(event.key)) {
      event.preventDefault();
      onNavigate(element, 1);
    }
  }

  function onFocus(event: FocusEvent & { currentTarget: HTMLInputElement }) {
    event.currentTarget.select();
  }
</script>

{#if hasLeadingZero}
  <span class="{className}__leadingZero">0</span>
{/if}
<input
  aria-label={ariaLabel}
  class={[
    `${className}__input`,
    `${className}__${name.replace(/12|24/, '')}`,
    hasLeadingZero && `${className}__input--hasLeadingZero`,
  ]}
  data-input="true"
  data-segment={name}
  {disabled}
  {form}
  inputmode="numeric"
  {max}
  {min}
  {name}
  oninput={onInput}
  onfocus={onFocus}
  onkeydown={onKeyDown}
  {placeholder}
  {required}
  step="1"
  style:width="{Math.max(1, (value || placeholder).length)}ch"
  type="number"
  {value}
/>
