<script lang="ts">
  import { Form, Modal, TextInput } from 'carbon-components-svelte';
  import { _ } from 'svelte-intl';
  export let send: (e: string) => void;
  export let open: boolean;
  export let close: () => void;
  let groupName: string = '';
</script>

<style>
</style>

<Modal
  size="xs"
  modalHeading={$_('create_group')}
  on:close={close}
  {open}
  primaryButtonText={$_('confirm')}
  secondaryButtonText={$_('cancel')}
  on:click:button--secondary={close}
  on:submit={() => send(groupName)}>
  <Form>
    <TextInput labelText={$_('create_group') + ':'} bind:value={groupName} />
  </Form>
</Modal>
