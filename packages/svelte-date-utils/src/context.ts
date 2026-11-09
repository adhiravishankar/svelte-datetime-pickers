import { getContext, setContext } from 'svelte';
import type { DateAdapter } from './types.js';

const dateAdapterContextKey = Symbol.for('svelte-date-utils.date-adapter');

/** Makes an adapter available to date components rendered below the current Svelte component. */
export function provideDateAdapter<T>(adapter: DateAdapter<T>): void {
  setContext(dateAdapterContextKey, adapter);
}

/** Reads the adapter from the current component tree, throwing when no provider is present. */
export function getDateAdapter<T>(componentName: string): DateAdapter<T> {
  const adapter = getContext<DateAdapter<T> | undefined>(dateAdapterContextKey);
  if (!adapter) {
    throw new Error(
      `${componentName} requires a date adapter context. Call provideDateAdapter(adapter) in a parent component.`,
    );
  }
  return adapter;
}
