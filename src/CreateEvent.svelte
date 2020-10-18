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
  export let title: string;
  let label: string = '';
  let puntuaction: string = '0';
</script>

<style>
</style>

<Modal
  {open}
  modalHeading={title}
  on:close={close}
  primaryButtonText="Confirm"
  secondaryButtonText="Cancel"
  on:click:button--secondary={close}
  on:submit={() => {
    const newEvent = { label, puntuaction: Number(puntuaction) };
    send(newEvent);
  }}>
  <Form>
    <TextInput labelText="Label" value={label} />
    <NumberInput mobile label="Puntuation" value={puntuaction} />
  </Form>
</Modal>
