# svelte-fit-action

Svelte actions for popups. Svelte port of [React-Fit](https://github.com/wojtekmaj/react-fit).

## Installation

```sh
npm install svelte-fit-action
```

Requires Svelte 5 or later.

## Usage

```svelte
<script lang="ts">
  import { fit, portal } from 'svelte-fit-action';

  let open = $state(false);
</script>

<div style="position: relative">
  <button onclick={() => (open = !open)}>Toggle</button>
  <div use:fit={{ enabled: open }}>Popup content</div>
</div>
```

### `fit`

Positions an element absolutely next to its offset parent: below and aligned to the start by default. When the element would overflow the viewport, it flips above and/or aligns to the end instead.

| Option      | Description                                                              | Default  |
| ----------- | ------------------------------------------------------------------------ | -------- |
| `enabled`   | When `false`, the positioning styles set by the action are removed.      | `true`   |
| `mainAxis`  | `"y"` places the element below/above, `"x"` places it to the right/left. | `"y"`    |
| `spacing`   | Minimum distance, in pixels, to keep from the edge of the container.     | `8`      |
| `container` | Element to fit in.                                                       | viewport |

### `portal`

Moves an element into another element, e.g. `<div use:portal={document.body}>`. When the target is `null` or `undefined`, the element stays in place.

## Part of a monorepo

`svelte-fit-action` is part of the [svelte-datetime-pickers monorepo](https://github.com/adhiravishankar/svelte-datetime-pickers). See the [live demo and Storybook](https://adhiravishankar.github.io/svelte-datetime-pickers/).

## License

The MIT License.
