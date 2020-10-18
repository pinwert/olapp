<script lang="ts">
  import type { IAction } from './interfaces';
  import {
    Form,
    Modal,
    NumberInput,
    TextInput,
  } from 'carbon-components-svelte';
  export let send: (e: IAction) => void;
  export let close: () => void;
  export let open: boolean;
  let label: string;
  let puntuaction: string;
</script>

<style>
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
  <Form>
    <TextInput labelText="Label" value={label} />
    <NumberInput label="Puntuation" value={puntuaction} />
  </Form>
</Modal>
