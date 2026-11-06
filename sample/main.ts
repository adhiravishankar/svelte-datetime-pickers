import { mount } from 'svelte';

import Sample from './Sample.svelte';

const target = document.getElementById('root');

if (!target) {
  throw new Error('Could not find root element');
}

mount(Sample, { target });
