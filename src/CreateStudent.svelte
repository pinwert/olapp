<script lang="ts">
  import type { IStudent } from './interfaces';
  import { Modal } from 'carbon-components-svelte';
  export let send: (e: IStudent) => void;
  export let groups: Array<string>;
  export let close: () => void;
  export let open: boolean;
  let name: string;
  export let group: string;
</script>

<style>
  button {
    padding: 7px 20px;
    margin: 20px;
    background-color: rgba(30, 130, 30, 1);
    color: white;
    border-radius: 6px;
    align-self: flex-end;
  }
  select {
    min-width: 100px;
  }
  form {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-width: 300px;
  }
  label {
    padding: 20px 0 10px;
  }
</style>

<Modal
  {open}
  modalHeading="Create student"
  on:close={close}
  primaryButtonText="Confirm"
  secondaryButtonText="Cancel"
  on:click:button--secondary={close}
  on:submit={() => {
    send({ id: `${group}_${name}`, name: name, group: group, events: [] });
  }}>
  <form>
    {#if groups.length}
      <label for="group">Group:</label>
      <select
        name="group"
        id="group"
        on:blur={e => (group = e.currentTarget.value)}
        on:change={e => (group = e.currentTarget.value)}>
        {#each groups as group}
          <option value={group}>{group}</option>
        {/each}
      </select>
    {/if}
    <label for="name">name:</label>
    <input
      name="name"
      id="name"
      on:change={e => (name = e.currentTarget.value)} />
  </form>
</Modal>
