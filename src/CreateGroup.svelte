<script lang="ts">
  import { Modal } from 'carbon-components-svelte';
  export let send: (e: string) => void;
  export let open: boolean;
  export let close: () => void;
  let groupName: string;
</script>

<style>
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
  size="xs"
  modalHeading="Create group"
  on:close={close}
  {open}
  primaryButtonText="Confirm"
  secondaryButtonText="Cancel"
  on:click:button--secondary={close}
  on:submit={() => send(groupName)}>
  <form>
    <label for="group_name">Create group:</label>
    <input
      name="group_name"
      id="group_name"
      on:change={e => (groupName = e.currentTarget.value)} />
  </form>
</Modal>
