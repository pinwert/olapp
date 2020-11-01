<script lang="ts">
  import type { IAction } from './interfaces';
  import {
    Dropdown,
    Form,
    Modal,
    NumberInput,
    TextInput,
  } from 'carbon-components-svelte';
  import { _ } from 'svelte-intl';
  export let send: (e: IAction) => void;
  export let close: () => void;
  export let open: boolean;
  export let title: string;
  export let event: IAction;
  let label: string = (event && event.label) || '';
  let puntuaction: string = (event && event.puntuaction.toString()) || '0';
  const colors = [
    { id: '', text: $_('no_color') },
    { id: 'rgba(246, 71, 71, 1)', text: $_('red') },
    { id: 'rgba(44, 130, 201, 1)', text: $_('blue') },
    { id: 'rgba(77, 175, 124, 1)', text: $_('green') },
    { id: 'rgba(245, 215, 110, 1)', text: $_('yellow') },
  ];
  let colorIndex: number =
    (event && event.color && colors.findIndex(c => c.id === event.color)) || 0;
</script>

<style>
</style>

<Modal
  {open}
  modalHeading={title}
  on:close={close}
  primaryButtonText={$_('confirm')}
  secondaryButtonText={$_('cancel')}
  on:click:button--secondary={close}
  on:submit={() => {
    const newEvent = { label, puntuaction: Number(puntuaction), color: colors[colorIndex].id };
    send(newEvent);
  }}>
  <Form>
    <TextInput labelText={$_('label')} bind:value={label} />
    <Dropdown
      titleText={$_('color')}
      bind:selectedIndex={colorIndex}
      items={colors} />
    <NumberInput mobile label={$_('puntuation')} bind:value={puntuaction} />
  </Form>
</Modal>
