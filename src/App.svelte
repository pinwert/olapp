<script lang="ts">
  import './translations';
  import { _ } from 'svelte-intl';
  import Actions from './Actions.svelte';
  import {
    Button,
    ButtonSet,
    Row,
    SelectItem,
    Select,
  } from 'carbon-components-svelte';
  import CreateEvent from './CreateEvent.svelte';
  import CreateGroup from './CreateGroup.svelte';
  import CreateStudent from './CreateStudent.svelte';
  import type { IAction, IStudent } from './interfaces';
  import StudentsTable from './StudentsTable.svelte';
  import Layout from './Layout.svelte';
  import EditEvent from './EditEvent.svelte';
  import {
    groups,
    groupSelected,
    journey,
    negativeEvents,
    positiveEvents,
    selecteds,
    session,
    showActions,
    students,
    from,
    to,
  } from './store';
  import ClearEvents from './ClearEvents.svelte';

  let modalToShow: string = !$groups.length ? 'showCreateGroup' : '';
  $: studentsInGroup = $students.filter(s => s.group === $groupSelected);
  let sortBy: 'alphabetical' | 'more-points' | 'less-points' = 'alphabetical';
  const showModal = (m: string) => {
    modalToShow = m;
  };
  const setEvent = (event: IAction, when: number) => {
    $showActions.forEach(st => {
      const idx = $students.findIndex(s => s.id === st.id);
      if (
        idx > -1 &&
        (!$journey.includes(st.id) || $showActions.length === 1)
      ) {
        $students[idx].events = [
          ...$students[idx].events,
          {
            eventType: event.label,
            createdAt: new Date(when).getTime(),
            puntuation: event.puntuaction,
          },
        ];
        if (
          event.color &&
          (!$session[st.id] || !$session[st.id].includes(event.color))
        ) {
          $session[st.id] = [...($session[st.id] || []), event.color];
        }

        $students[idx].puntuation = $students[idx].events.reduce((acc, s) => {
          acc = acc + s.puntuation;
          return acc;
        }, 0);

        students.set($students);
        session.set($session);
      }
    });
    showActions.set([]);
  };
  const deleteEvent = (eventIndex: number) => {
    $showActions.forEach(st => {
      const idx = $students.findIndex(s => s.id === st.id);
      if (idx > -1 && $showActions.length === 1) {
        const ev =
          $positiveEvents.find(
            e => e.label === $students[idx].events[eventIndex].eventType
          ) ||
          $negativeEvents.find(
            e => e.label === $students[idx].events[eventIndex].eventType
          );

        if (ev?.color && $session[st.id]?.includes(ev.color)) {
          const colorIdx = $session[st.id].indexOf(ev.color);
          $session[st.id].splice(colorIdx, 1);
          $session[st.id] = [...$session[st.id]];
        }
        $students[idx].events.splice(eventIndex, 1);
        $students[idx].events = [...$students[idx].events];

        $students[idx].puntuation = $students[idx].events.reduce((acc, s) => {
          acc = acc + s.puntuation;
          return acc;
        }, 0);

        students.set($students);
        session.set($session);
      }
    });
  };
  const close = () => {
    modalToShow = '';
  };
  const randomIndex = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  const selectRandom = () => {
    const idx = randomIndex(
      0,
      $selecteds.length ? $selecteds.length - 1 : studentsInGroup.length - 1
    );
    const student = $selecteds.length
      ? studentsInGroup.find(s => s.id === $selecteds[idx])
      : studentsInGroup[idx];
    showActions.set([student]);
  };
  $: maxByGroup = studentsInGroup.reduce((ac: number, s: IStudent) => {
    const p = s.events
      .filter(
        e =>
          (!$from || new Date($from).getTime() < e.createdAt) &&
          (!$to || new Date($to).getTime() > e.createdAt)
      )
      .reduce((acc, s) => {
        acc = acc + s.puntuation;
        return acc;
      }, 0);
    if (p > ac) return p;
    return ac;
  }, 0);

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
  }
</script>

<Layout {showModal}>
  <Row style="min-height: 48px;">
    <ButtonSet>
      <Button
        kind="ghost"
        on:click={() =>
          selecteds.set(
            $selecteds.length === studentsInGroup.length
              ? []
              : studentsInGroup.map(s => s.id)
          )}
      >
        {$selecteds.length === studentsInGroup.length
          ? $_('unselect_all')
          : $_('select_all')}
      </Button>
      <Button kind="ghost" on:click={selectRandom}>{$_('select_random')}</Button
      >
      {#if $selecteds.length > 0}
        <Button
          on:click={() =>
            showActions.set(
              $selecteds.map(s => studentsInGroup.find(st => st.id === s))
            )}
        >
          {$_('add_event')}
        </Button>
      {/if}
      <Select inline labelText={$_('sort_by')} bind:selected={sortBy}>
        <SelectItem value="alphabetical" text={$_('alphabetical')} />
        <SelectItem value="more-points" text={$_('more_points')} />
        <SelectItem value="less-points" text={$_('less_points')} />
      </Select>
      <Button kind="ghost" on:click={() => showModal('showCreateStudent')}>
        {$_('new_student')}
      </Button>
    </ButtonSet>
  </Row>
  <StudentsTable students={studentsInGroup} {sortBy} />
</Layout>
<CreateGroup
  {close}
  open={modalToShow === 'showCreateGroup'}
  send={group => {
    groups.set([...$groups, group]);
    modalToShow = '';
  }}
/>
{#if $showActions.length}
  <Actions
    name={$showActions.length &&
      `${$showActions[0].name} ${
        $showActions.length > 1 ? `and ${$showActions.length - 1} more` : ''
      }`}
    {setEvent}
    {deleteEvent}
    open={!!$showActions.length}
    student={$showActions.length === 1 ? $showActions[0] : undefined}
    {maxByGroup}
    close={() => {
      showActions.set([]);
    }}
  />
{/if}
<CreateStudent
  open={modalToShow === 'showCreateStudent'}
  {close}
  group={$groupSelected}
  send={newStudent => {
    students.set([...$students, newStudent]);
    modalToShow = '';
  }}
  groups={$groups}
/>
<CreateEvent
  event={undefined}
  open={modalToShow === 'showCreateEvent'}
  {close}
  title={$_('create_event')}
  send={newEvent => {
    if (newEvent.puntuaction < 0) {
      negativeEvents.set([...$negativeEvents, newEvent]);
    } else {
      positiveEvents.set([...$positiveEvents, newEvent]);
    }
    modalToShow = '';
  }}
/>

<EditEvent open={modalToShow === 'showEditEvent'} {close} />
<ClearEvents open={modalToShow === 'showClearEvents'} {close} />

<style>
  :global(.bx--select--inline .bx--select-input) {
    margin-bottom: 0.25em;
    margin-top: 0.25em;
  }
</style>
