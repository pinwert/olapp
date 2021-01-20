import { writable } from 'svelte/store';

import type { IAction, IStudent } from './interfaces';

export const students = writable(
  (JSON.parse(localStorage.getItem('students')) || []) as Array<IStudent>
);
students.subscribe(value => {
  localStorage.setItem('students', JSON.stringify(value));
});
const groupsStored = JSON.parse(localStorage.getItem('groups')) || [];
export const groups = writable(groupsStored as Array<string>);
groups.subscribe(value => {
  localStorage.setItem('groups', JSON.stringify(value));
});

export const groupSelected = writable(
  localStorage.getItem('groupSelected') ||
    (groupsStored.length && groupsStored[0]) ||
    ''
);
groupSelected.subscribe(value => {
  localStorage.setItem('groupSelected', value);
});

export const positiveEvents = writable(
  (JSON.parse(localStorage.getItem('positiveEvents')) || []) as Array<IAction>
);
positiveEvents.subscribe(value => {
  localStorage.setItem('positiveEvents', JSON.stringify(value));
});
export const negativeEvents = writable(
  (JSON.parse(localStorage.getItem('negativeEvents')) || []) as Array<IAction>
);
negativeEvents.subscribe(value => {
  localStorage.setItem('negativeEvents', JSON.stringify(value));
});

export const showActions = writable([] as Array<IStudent>);
export const selecteds = writable([] as Array<string>);

export const session = writable(
  (JSON.parse(localStorage.getItem('session')) || {}) as {
    [id: string]: Array<string>;
  }
);

session.subscribe(value => {
  localStorage.setItem('session', JSON.stringify(value));
});

export const journey = writable(
  (JSON.parse(localStorage.getItem('journey')) || []) as Array<string>
);

journey.subscribe(value => {
  localStorage.setItem('journey', JSON.stringify(value));
});

export const from = writable(
  (JSON.parse(localStorage.getItem('from')) || []) as number
);

from.subscribe(value => {
  localStorage.setItem('from', JSON.stringify(value));
});

export const to = writable(
  (JSON.parse(localStorage.getItem('to')) || []) as number
);

to.subscribe(value => {
  localStorage.setItem('to', JSON.stringify(value));
});
