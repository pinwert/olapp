<script lang="ts">
  import type { IStudent } from './interfaces';

  export let send: (e: IStudent) => void;
  export let groups: Array<string>;
</script>

<style>
  button {
    padding: 7px 20px;
    margin: 0 20px;
    background-color: rgba(30, 130, 30, 1);
    color: white;
    border-radius: 6px;
  }
  select {
    min-width: 100px;
  }
</style>

<form
  on:submit={e => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    send({
      id: `${data.get('group')}_${data.get('name')}`,
      name: data.get('name').toString(),
      group: data.get('group').toString(),
      events: [],
    });
  }}>
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
