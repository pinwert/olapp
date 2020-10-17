<script lang="ts">
  import type { IAction } from './interfaces';
  import { Modal } from 'carbon-components-svelte';
  export let send: (e: IAction) => void;
  export let close: () => void;
  export let open: boolean;
  let label: string;
  let puntuaction: number;
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
  modalHeading="Create positive event"
  on:close={close}
  primaryButtonText="Confirm"
  secondaryButtonText="Cancel"
  on:click:button--secondary={close}
  on:submit={() => {
    const newNegativeEvent = { label: label, puntuaction: Number(puntuaction) };
    send(newNegativeEvent);
  }}>
  <form>
    <label for="label">label:</label>
    <input
      name="label"
      id="label"
      on:change={e => (label = e.currentTarget.value)} />
    <label for="puntuaction">puntuaction:</label>
    <input
      name="puntuaction"
      id="puntuaction"
      on:change={e => (puntuaction = e.currentTarget.value)} />
  </form>
</Modal>
