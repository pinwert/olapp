<script lang="ts">
  import Export from './Export.svelte';
  import Inport from './Inport.svelte';
  import type { IAction, IStudent } from './interfaces';

  export let inportData: (obj: {
    students: Array<IStudent>;
    groups: Array<string>;
    positiveEvents: Array<IAction>;
    negativeEvents: Array<IAction>;
  }) => void;
  export let setGroupSelected: (g: string) => void;
  export let groupSelected: string;
  export let groups: Array<string>;
  export let students: Array<IStudent>;
  export let positiveEvents: Array<IAction>;
  export let negativeEvents: Array<IAction>;
  export let showModal: (m: string) => void;
</script>

<style>
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
</style>

<header>
  <label for="groups">Change group:</label>
  <select
    name="groups"
    id="groups"
    value={groupSelected}
    on:blur={e => {
      setGroupSelected(e.currentTarget.value);
    }}
    on:change={e => {
      setGroupSelected(e.currentTarget.value);
    }}>
    {#each groups as group}
      <option value={group}>{group}</option>
    {/each}
  </select>
  <button on:click={() => showModal('showCreateGroup')}>Create Group</button>
  <button on:click={() => showModal('showCreateStudent')}>Create Student</button>
  <button on:click={() => showModal('showCreatePositive')}>Create Positive</button>
  <button on:click={() => showModal('showCreateNegative')}>Create Negative</button>
  <Export {students} {groups} {positiveEvents} {negativeEvents} />
  <Inport {inportData} />
</header>
