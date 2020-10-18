<script lang="ts">
  import { Form, Modal, TextInput } from 'carbon-components-svelte';
  export let send: (e: string) => void;
  export let open: boolean;
  export let close: () => void;
  let groupName: string = '';
</script>

<style>
</style>

<Modal
  size="xs"
  modalHeading="Create group"
  on:close={close}
  {open}
  primaryButtonText="Confirm"
  secondaryButtonText="Cancel"
  on:click:button--secondary={close}
  on:submit={() => send(groupName)}>
  <Form>
    <TextInput labelText="Create group:" value={groupName} />
  </Form>
</Modal>
