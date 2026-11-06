import type { Preview } from '@storybook/svelte-vite';

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    controls: { expanded: true },
  },
};

export default preview;
