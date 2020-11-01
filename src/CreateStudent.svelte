<script lang="ts">
  import type { IStudent } from './interfaces';
  import {
    Form,
    Modal,
    Select,
    SelectItem,
    TextInput,
  } from 'carbon-components-svelte';
  import { _ } from 'svelte-intl';
  export let send: (e: IStudent) => void;
  export let groups: Array<string>;
  export let close: () => void;
  export let open: boolean;
  let name: string = '';
  export let group: string;
</script>

<style>
</style>

<Modal
  {open}
  modalHeading={$_('create_student')}
  on:close={close}
  primaryButtonText={$_('confirm')}
  secondaryButtonText={$_('cancel')}
  on:click:button--secondary={close}
  on:submit={() => {
    send({
      id: `${name}_${new Date().getTime()}`,
      name: name,
      group: group,
      events: [],
      puntuation: 0,
    });
  }}>
  <Form>
    {#if groups.length}
      <Select labelText={$_('group')} bind:selected={group}>
        {#each groups as group}
          <SelectItem value={group} text={group} />
        {/each}
      </Select>
    {/if}
    <TextInput labelText={$_('name')} bind:value={name} />
  </Form>
</Modal>
