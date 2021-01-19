<script lang="ts">
  import { Modal, DatePicker, DatePickerInput } from 'carbon-components-svelte';
  import { students } from './store';
  import { _ } from 'svelte-intl';
  export let close: () => void;
  export let open: boolean;
  let date = Date.now();
</script>

<Modal
  {open}
  modalHeading={$_('clear_events')}
  on:close={close}
  primaryButtonText={$_('confirm')}
  secondaryButtonText={$_('cancel')}
  on:click:button--secondary={close}
  on:submit={() => {
    const d = new Date(date).getTime();
    const newStudents = $students.map(s => ({
      ...s,
      events: s.events.filter(e => {
        return e.createdAt > d;
      }),
    }));
    students.set(newStudents);
    close();
  }}
>
  <DatePicker datePickerType="single" bind:value={date}>
    <DatePickerInput
      size="sm"
      labelText={$_('when')}
      placeholder="mm/dd/yyyy"
    />
  </DatePicker>
</Modal>

<style>
</style>
