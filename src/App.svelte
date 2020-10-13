<script lang="ts">
  import { afterUpdate } from 'svelte';

  interface IAction {
    puntuaction: number;
    label: string;
  }
  interface IEvent {
    eventType: string;
    createdAt: number;
    puntuation: number;
  }
  interface IStudent {
    id: string;
    name: string;
    group: string;
    events: Array<IEvent>;
  }
  let students: Array<IStudent> =
    JSON.parse(localStorage.getItem('students')) || [];
  let groups: Array<string> = JSON.parse(localStorage.getItem('groups')) || [];
  let showHistory: string;
  let showActions: string;
  let showCreateGroup: boolean = !groups.length;
  let showCreateStudent: boolean;
  let showCreatePositive: boolean;
  let showCreateNegative: boolean;
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

  function exportData() {
    var dataUri =
      'data:application/json;charset=utf-8,' +
      encodeURIComponent(
        JSON.stringify({
          students,
          groups,
          groupSelected,
          positiveEvents,
          negativeEvents,
        })
      );
    let element = document.createElement('a');
    element.setAttribute('href', dataUri);
    element.setAttribute('download', 'data.json');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  function inportData() {
    let element = document.createElement('input');
    element.setAttribute('type', 'file');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();
    element.onblur = () => document.body.removeChild(element);
    element.onchange = () => {
      const reader = new FileReader();
      reader.onload = event => {
        console.log(event.target.result);
        const obj = JSON.parse(event.target.result as string);
        students = obj.students;
        groups = obj.groups;
        positiveEvents = obj.positiveEvents;
        negativeEvents = obj.negativeEvents;
      };
      reader.readAsText(element.files[0]);
      document.body.removeChild(element);
    };
  }
</script>

<style>
  main {
    justify-content: flex-start !important;
    height: 100%;
    width: 100%;
  }
  header {
    display: flex;
    height: 60px;
    max-height: 60px;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    width: 100%;
    padding: 0 20px;
  }
  button {
    padding: 7px 20px;
    margin: 0 20px;
  }
  select {
    min-width: 100px;
  }
  tr {
    border-bottom: 10px solid white;
  }
  td {
    text-align: center;
    background-color: rgb(102, 100, 100, 0.3);
    padding: 10px;
    border: none;
    white-space: nowrap;
  }
  .title {
    font-size: 22px;
    font-weight: bold;
  }
  .table {
    width: 100%;
    border-collapse: collapse;
    max-width: min(1000px, 90%);
  }
  .modal {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: rgba(23, 23, 23, 0.6);
  }
  .row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .card {
    background-color: white;
    border: 1px solid rgb(102, 100, 100);
    border-radius: 6px;
    box-shadow: 1px 1px 1px 3px rgb(102, 100, 100);
    padding: 20px;
    width: max-content;
    max-width: min(1000px, 90%);
  }
  .column {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .positive {
    background-color: rgba(23, 150, 23);
    padding: 20px;
    margin: 20px;
    border-radius: 6px;
  }
  .negative {
    background-color: rgba(150, 23, 23);
    padding: 20px;
    margin: 20px;
    border-radius: 6px;
  }
  .event {
    border-radius: 6px;
    background-color: rgba(23, 23, 23, 0.3);
    padding: 20px;
    margin: 20px;
    color: white;
  }
  .close {
    position: absolute;
    border-radius: 6px;
    top: 20px;
    right: 20px;
  }
</style>

<main class="column">
  {#if !showCreateGroup}
    <header>
      <label for="groups">Change group:</label>
      <select
        name="groups"
        id="groups"
        value={groupSelected}
        on:blur={e => {
          groupSelected = e.currentTarget.value;
        }}
        on:change={e => {
          groupSelected = e.currentTarget.value;
        }}>
        {#each groups as group}
          <option value={group}>{group}</option>
        {/each}
      </select>
      <button on:click={() => (showCreateGroup = true)}>Create Group</button>
      <button on:click={() => (showCreateStudent = true)}>Create Student</button>
      <button on:click={() => (showCreatePositive = true)}>Create Positive</button>
      <button on:click={() => (showCreateNegative = true)}>Create Negative</button>
      <button on:click={exportData}>Download data</button>
      <button on:click={inportData}>Import data</button>
    </header>
    <table class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Group</th>
          <th>Punctuation</th>
          <th>Historic</th>
        </tr>
      </thead>
      <tbody>
        {#each students.filter(s => s.group === groupSelected) as student}
          <tr
            on:click={() => {
              showActions = student.id;
            }}>
            <td>{student.name}</td>
            <td>{student.group}</td>
            <td>
              {student.events.reduce((acc, s) => {
                acc = acc + s.puntuation;
                return acc;
              }, 0)}
            </td>
            <td
              on:click={e => {
                e.preventDefault();
                e.stopImmediatePropagation();
                showHistory = student.id;
              }}>
              View
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}
    <div class="modal">
      <button
        class="close"
        on:click={() => {
          showCreateGroup = false;
        }}>Close</button>
      <div class="card">
        <span class="title">Create group</span>
        <form
          on:submit={e => {
            e.preventDefault();
            groups.push(new FormData(e.currentTarget)
                .get('group_name')
                .toString());
            groups = [...groups];
            showCreateGroup = false;
          }}>
          <label for="group_name">Create group:</label>
          <input name="group_name" id="group_name" />
          <button>Create</button>
        </form>
      </div>
    </div>
  {/if}
  {#if showActions}
    <div class="modal">
      <button
        class="close"
        on:click={() => {
          showActions = '';
        }}>Close</button>
      <div class="card row">
        <div class="positive column">
          {#each positiveEvents as event}
            <div
              class="event"
              on:click={() => {
                const idx = students.findIndex(s => s.id === showActions);
                if (idx > -1) students[idx].events.push({
                    eventType: event.label,
                    createdAt: new Date().getTime(),
                    puntuation: event.puntuaction,
                  });
                students[idx].events = [...students[idx].events];
                showActions = '';
              }}>
              {event.label}
            </div>
          {/each}
        </div>
        <div class="negative column">
          {#each negativeEvents as event}
            <div
              class="event"
              on:click={() => {
                const idx = students.findIndex(s => s.id === showActions);
                if (idx > -1) students[idx].events.push({
                    eventType: event.label,
                    createdAt: new Date().getTime(),
                    puntuation: event.puntuaction,
                  });
                students[idx].events = [...students[idx].events];
                showActions = '';
              }}>
              {event.label}
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}
  {#if showHistory}
    <div class="modal">
      <button
        class="close"
        on:click={() => {
          showHistory = '';
        }}>Close</button>
      <div class="card">
        <table class="table">
          <thead>
            <tr>
              <th>event</th>
              <th>date</th>
              <th>Punctuation</th>
            </tr>
          </thead>
          <tbody>
            {#each students.find(s => s.id === showHistory).events as event}
              <tr>
                <td>{event.eventType}</td>
                <td>
                  {(() => {
                    const d = new Date(event.createdAt);
                    const ye = new Intl.DateTimeFormat('en', {
                      year: 'numeric',
                    }).format(d);
                    const mo = new Intl.DateTimeFormat('en', {
                      month: 'short',
                    }).format(d);
                    const da = new Intl.DateTimeFormat('en', {
                      day: '2-digit',
                    }).format(d);
                    return `${da}-${mo}-${ye}`;
                  })()}
                </td>
                <td>{event.puntuation}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
  {#if showCreateStudent}
    <div class="modal">
      <button
        class="close"
        on:click={() => {
          showCreateStudent = false;
        }}>Close</button>
      <form
        class="card"
        on:submit={e => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          const newStudent = { id: `${data.get('group')}_${data.get('name')}`, name: data
              .get('name')
              .toString(), group: data.get('group').toString(), events: [] };
          students.push(newStudent);
          students = [...students];
          showCreateStudent = false;
        }}>
        <span class="title">Create student</span>
        {#if groups.length}
          <label for="group">Group:</label>
          <select name="group" id="group">
            {#each groups as group}
              <option value={group}>{group}</option>
            {/each}
          </select>
        {/if}
        <label for="name">name:</label>
        <input name="name" id="name" />
        <button>Create</button>
      </form>
    </div>
  {/if}
  {#if showCreatePositive}
    <div class="modal">
      <button
        class="close"
        on:click={() => {
          showCreatePositive = false;
        }}>Close</button>
      <form
        class="card"
        on:submit={e => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          const newPositiveEvent = { label: data
              .get('label')
              .toString(), puntuaction: Number(data
                .get('puntuaction')
                .toString()) };
          positiveEvents.push(newPositiveEvent);
          positiveEvents = [...positiveEvents];
          showCreatePositive = false;
        }}>
        <span class="title">Create Positive Event</span>
        <label for="label">label:</label>
        <input name="label" id="label" />
        <label for="puntuaction">puntuaction:</label>
        <input name="puntuaction" id="puntuaction" />
        <button>Create</button>
      </form>
    </div>
  {/if}
  {#if showCreateNegative}
    <div class="modal">
      <button
        class="close"
        on:click={() => {
          showCreateNegative = false;
        }}>Close</button>
      <form
        class="card"
        on:submit={e => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          const newNegativeEvent = { label: data
              .get('label')
              .toString(), puntuaction: Number(data
                .get('puntuaction')
                .toString()) };
          negativeEvents.push(newNegativeEvent);
          negativeEvents = [...negativeEvents];
          showCreateNegative = false;
        }}>
        <span class="title">Create Positive Event</span>
        <label for="label">label:</label>
        <input name="label" id="label" />
        <label for="puntuaction">puntuaction:</label>
        <input name="puntuaction" id="puntuaction" />
        <button>Create</button>
      </form>
    </div>
  {/if}
</main>
