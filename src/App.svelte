<script lang="ts">
  import { afterUpdate } from 'svelte';
  import Actions from './Actions.svelte';
  import CreateEvent from './CreateEvent.svelte';
  import CreateGroup from './CreateGroup.svelte';
  import CreateStudent from './CreateStudent.svelte';
  import Header from './Header.svelte';
  import History from './History.svelte';
  import type { IAction, IStudent } from './interfaces';
  import Modal from './Modal.svelte';
  import StudentsTable from './StudentsTable.svelte';

  let students: Array<IStudent> =
    JSON.parse(localStorage.getItem('students')) || [];
  let groups: Array<string> = JSON.parse(localStorage.getItem('groups')) || [];
  let showHistory: IStudent;
  let showActions: Array<IStudent> = [];
  let selecteds: Array<string> = [];
  let modalToShow: string = !groups.length ? 'showCreateGroup' : '';
  let groupSelected =
    localStorage.getItem('groupSelected') || (groups.length && groups[0]) || '';

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
</script>

<style>
  main {
    justify-content: flex-start !important;
    height: 100%;
    width: 100%;
  }
  .column {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>

<main class="column">
  <Header
    inportData={obj => {
      students = obj.students;
      groups = obj.groups;
      positiveEvents = obj.positiveEvents;
      negativeEvents = obj.negativeEvents;
    }}
    setGroupSelected={g => {
      groupSelected = g;
    }}
    {groupSelected}
    {groups}
    {students}
    {positiveEvents}
    {negativeEvents}
    showModal={m => {
      modalToShow = m;
    }} />
  <StudentsTable
    students={students.filter(s => s.group === groupSelected)}
    onShowHistory={student => {
      showHistory = student;
    }}
    {selecteds}
    setSelecteds={s => {
      selecteds = s;
    }}
    onShowActions={s => {
      showActions = s;
    }} />
  {#if selecteds.length > 0}
    <button
      on:click={() => {
        showActions = selecteds.map(s => students.find(st => st.id === s));
      }}>Add event
    </button>
  {/if}
  {#if modalToShow === 'showCreateGroup'}
    <Modal
      title="Create group"
      close={() => {
        modalToShow = '';
      }}>
      <CreateGroup
        send={group => {
          groups.push(group);
          groups = [...groups];
          modalToShow = '';
        }} />
    </Modal>
  {/if}
  {#if showActions.length}
    <Modal
      title="Set event"
      close={() => {
        showActions = [];
      }}>
      <Actions
        {positiveEvents}
        {negativeEvents}
        setEvent={event => {
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
        }} />
    </Modal>
  {/if}
  {#if showHistory}
    <Modal
      title={`History for: ${showHistory.name}`}
      close={() => {
        showHistory = undefined;
      }}>
      <History student={showHistory} />
    </Modal>
  {/if}
  {#if modalToShow === 'showCreateStudent'}
    <Modal
      title="Create student"
      close={() => {
        modalToShow = '';
      }}>
      <CreateStudent
        send={newStudent => {
          students.push(newStudent);
          students = [...students];
          modalToShow = '';
        }}
        {groups} />
    </Modal>
  {/if}
  {#if modalToShow === 'showCreatePositive'}
    <Modal
      title="Create positive event"
      close={() => {
        modalToShow = '';
      }}>
      <CreateEvent
        send={newEvent => {
          positiveEvents.push(newEvent);
          positiveEvents = [...positiveEvents];
          modalToShow = '';
        }} />
    </Modal>
  {/if}
  {#if modalToShow === 'showCreateNegative'}
    <Modal
      title="Create negative event"
      close={() => {
        modalToShow = '';
      }}>
      <CreateEvent
        send={newEvent => {
          negativeEvents.push(newEvent);
          negativeEvents = [...negativeEvents];
          modalToShow = '';
        }} />
    </Modal>
  {/if}
</main>
