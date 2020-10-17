<script lang="ts">
  import { afterUpdate } from 'svelte';
  import Actions from './Actions.svelte';
  import { Button, ButtonSet } from 'carbon-components-svelte';
  import CreateEvent from './CreateEvent.svelte';
  import CreateGroup from './CreateGroup.svelte';
  import CreateStudent from './CreateStudent.svelte';
  import EditStudent from './EditStudent.svelte';
  import History from './History.svelte';
  import type { IAction, IStudent } from './interfaces';
  import StudentsTable from './StudentsTable.svelte';
  import Layout from './Layout.svelte';

  let students: Array<IStudent> =
    JSON.parse(localStorage.getItem('students')) || [];
  let groups: Array<string> = JSON.parse(localStorage.getItem('groups')) || [];
  let showHistory: IStudent;
  let showActions: Array<IStudent> = [];
  let selecteds: Array<string> = [];
  let showEditStudent: IStudent;
  let modalToShow: string = !groups.length ? 'showCreateGroup' : '';
  let groupSelected =
    localStorage.getItem('groupSelected') || (groups.length && groups[0]) || '';
  let studentsInGroup: Array<IStudent> = students.filter(
    s => s.group === groupSelected
  );
  let positiveEvents: Array<IAction> =
    JSON.parse(localStorage.getItem('positiveEvents')) || [];
  let negativeEvents: Array<IAction> =
    JSON.parse(localStorage.getItem('negativeEvents')) || [];
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
  const onShowHistory = student => {
    showHistory = student;
  };
  const setSelecteds = (s: Array<string>) => {
    selecteds = s;
  };
  const onShowActions = (s: Array<IStudent>) => {
    showActions = s;
  };
  const setEvent = (event: IAction) => {
    showActions.forEach(st => {
      const idx = students.findIndex(s => s.id === st.id);
      if (idx > -1) {
        students[idx].events.push({
          eventType: event.label,
          createdAt: new Date().getTime(),
          puntuation: event.puntuaction,
        });
        students[idx].events = [...students[idx].events];
      }
    });
    showActions = [];
  };
  const close = () => {
    modalToShow = '';
  };
  const onEditStudent = (s: IStudent) => {
    showEditStudent = s;
  };
  const editStudent = (s: IStudent) => {
    const idx = students.findIndex(st => st.id === s.id);
    if (idx > -1) {
      students[idx] = s;
      students = [...students];
    }
    showEditStudent = undefined;
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
  </ButtonSet>
  <StudentsTable
    students={studentsInGroup}
    {onShowHistory}
    {selecteds}
    {setSelecteds}
    {onShowActions}
    {onEditStudent} />
</Layout>
<CreateGroup
  {close}
  open={modalToShow === 'showCreateGroup'}
  send={group => {
    groups.push(group);
    groups = [...groups];
    modalToShow = '';
  }} />
<Actions
  {positiveEvents}
  {negativeEvents}
  {setEvent}
  open={!!showActions.length}
  close={() => {
    showActions = [];
  }} />
<History
  open={!!showHistory}
  student={showHistory}
  close={() => {
    showHistory = undefined;
  }} />
<CreateStudent
  open={modalToShow === 'showCreateStudent'}
  {close}
  group={groupSelected}
  send={newStudent => {
    students.push(newStudent);
    students = [...students];
    modalToShow = '';
  }}
  {groups} />
<CreateEvent
  open={modalToShow === 'showCreatePositive'}
  {close}
  send={newEvent => {
    positiveEvents.push(newEvent);
    positiveEvents = [...positiveEvents];
    modalToShow = '';
  }} />
<CreateEvent
  open={modalToShow === 'showCreateNegative'}
  {close}
  send={newEvent => {
    negativeEvents.push(newEvent);
    negativeEvents = [...negativeEvents];
    modalToShow = '';
  }} />
<EditStudent
  open={!!showEditStudent}
  close={() => {
    showEditStudent = undefined;
  }}
  send={editStudent}
  student={showEditStudent} />
