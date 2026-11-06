import { mount } from 'svelte';

import Test from './Test.svelte';

const target = document.getElementById('root');

if (!target) {
  throw new Error('Could not find root element');
}

mount(Test, { target });
