<script lang="ts">
  import { afterUpdate } from 'svelte';
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

  let students: Array<IStudent> =
    JSON.parse(localStorage.getItem('students')) || [];
  let groups: Array<string> = JSON.parse(localStorage.getItem('groups')) || [];
  let showActions: Array<IStudent> = [];
  let selecteds: Array<string> = [];
  let modalToShow: string = !groups.length ? 'showCreateGroup' : '';
  let groupSelected =
    localStorage.getItem('groupSelected') || (groups.length && groups[0]) || '';
  $: studentsInGroup = students.filter(s => s.group === groupSelected);
  let positiveEvents: Array<IAction> =
    JSON.parse(localStorage.getItem('positiveEvents')) || [];
  let negativeEvents: Array<IAction> =
    JSON.parse(localStorage.getItem('negativeEvents')) || [];
  let sortBy: 'alphabetical' | 'more-point' | 'less-points' = 'alphabetical';
  afterUpdate(() => {
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('groups', JSON.stringify(groups));
    localStorage.setItem('groupSelected', groupSelected);
    localStorage.setItem('positiveEvents', JSON.stringify(positiveEvents));
    localStorage.setItem('negativeEvents', JSON.stringify(negativeEvents));
  });
  const showModal = (m: string) => {
    modalToShow = m;
  };
  const setGroupSelected = g => {
    groupSelected = g;
  };
  const inportData = obj => {
    students = obj.students;
    groups = obj.groups;
    positiveEvents = obj.positiveEvents;
    negativeEvents = obj.negativeEvents;
  };
  const setSelecteds = (s: Array<string>) => {
    selecteds = s;
  };
  const onShowActions = (s: Array<IStudent>) => {
    showActions = s;
  };
  const setEvent = (event: IAction) => {
    console.log('-----', showActions, event);
    showActions.forEach(st => {
      const idx = students.findIndex(s => s.id === st.id);
      if (idx > -1) {
        students[idx].events = [
          ...students[idx].events,
          {
            eventType: event.label,
            createdAt: new Date().getTime(),
            puntuation: event.puntuaction,
          },
        ];
        students[idx].puntuation = students[idx].events.reduce((acc, s) => {
          acc = acc + s.puntuation;
          return acc;
        }, 0);
      }
    });
    showActions = [];
  };
  const close = () => {
    modalToShow = '';
  };
  const editStudent = (s: IStudent) => {
    const idx = students.findIndex(st => st.id === s.id);
    if (idx > -1) {
      students[idx] = s;
    }
    showActions = [];
  };
  const deleteStudent = (s: IStudent) => {
    students = students.filter(st => st.id !== s.id);
    showActions = [];
  };
</script>

<style>
</style>

<Layout
  {inportData}
  {setGroupSelected}
  {groupSelected}
  {groups}
  {students}
  {positiveEvents}
  {negativeEvents}
  {showModal}>
  <ButtonSet>
    <Button
      kind="secondary"
      on:click={() => setSelecteds(selecteds.length === studentsInGroup.length ? [] : (selecteds = studentsInGroup.map(s => s.id)))}>
      Select all
    </Button>
    {#if selecteds.length > 0}
      <Button
        on:click={() => onShowActions(selecteds.map(s =>
              studentsInGroup.find(st => st.id === s)
            ))}>
        Add event
      </Button>
    {/if}
    <Select
      inline
      labelText="Sort by:"
      bind:selected={sortBy}
      style={'padding-left: 20px;'}>
      <SelectItem value="alphabetical" text="Alphabetical" />
      <SelectItem value="more-points" text="More points" />
      <SelectItem value="less-points" text="Less points" />
    </Select>
  </ButtonSet>
  <StudentsTable
    students={studentsInGroup}
    {sortBy}
    {selecteds}
    {setSelecteds}
    {onShowActions} />
</Layout>
<CreateGroup
  {close}
  open={modalToShow === 'showCreateGroup'}
  send={group => {
    groups = [...groups, group];
    modalToShow = '';
  }} />
<Actions
  name={showActions.length && `${showActions[0].name} ${showActions.length > 1 ? `and ${showActions.length - 1} more` : ''}`}
  {positiveEvents}
  {negativeEvents}
  {setEvent}
  open={!!showActions.length}
  student={showActions.length === 1 ? showActions[0] : undefined}
  close={() => {
    showActions = [];
  }}
  {editStudent}
  {deleteStudent} />
<CreateStudent
  open={modalToShow === 'showCreateStudent'}
  {close}
  group={groupSelected}
  send={newStudent => {
    students = [...students, newStudent];
    modalToShow = '';
  }}
  {groups} />
<CreateEvent
  open={modalToShow === 'showCreatePositive'}
  {close}
  send={newEvent => {
    positiveEvents = [...positiveEvents, newEvent];
    modalToShow = '';
  }} />
<CreateEvent
  open={modalToShow === 'showCreateNegative'}
  {close}
  send={newEvent => {
    negativeEvents = [...negativeEvents, newEvent];
    modalToShow = '';
  }} />
