// Shared reactive store for the currently visible section
import { writable } from 'svelte/store';

/** @type {import('svelte/store').Writable<string>} */
export const activeSection = writable('me');

