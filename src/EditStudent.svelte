<script lang="ts">
  import type { IStudent } from './interfaces';
  import { Modal } from 'carbon-components-svelte';

  export let send: (e: IStudent) => void;
  export let student: IStudent;
  export let open: boolean;
  export let close: () => void;
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

<Modal {open} modalHeading="Edit student" on:close={close}>
  {#if student}
    <form
      on:submit={e => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        send({
          id: student.id,
          name: data.get('name').toString(),
          group: data.get('group').toString(),
          disabled: !!data.get('disabled'),
          events: student.events,
        });
      }}>
      <label for="name">name:</label>
      <input name="name" id="name" value={student.name} />

      <label for="disabled">disabled:</label>
      <input
        name="disabled"
        id="disabled"
        type="checkbox"
        checked={student.disabled} />
      <button>Save</button>
    </form>
  {/if}
</Modal>
