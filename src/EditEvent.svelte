<script lang="ts">
  import type { IAction, IEvent } from './interfaces';
  import { Modal, Tabs, Tab, TabContent } from 'carbon-components-svelte';
  import { negativeEvents, positiveEvents } from './store';
  import CreateEvent from './CreateEvent.svelte';
  import { _ } from 'svelte-intl';
  export let close: () => void;
  export let open: boolean;
  let eventSelected: IAction;
</script>

<style>
  .event {
    border-radius: 6px;
    background-color: rgba(23, 23, 23, 0.3);
    padding: 20px;
    margin: 20px;
    color: white;
  }
</style>

<Modal
  size="lg"
  {open}
  modalHeading={$_('edit_event')}
  on:close={close}
  passiveModal>
  <Tabs type="container">
    <Tab
      label={$_('edit_positive')}
      style="background-color: rgba(23, 150, 23,0.3);" />
    <Tab
      label={$_('edit_negative')}
      style="background-color: rgba(150, 23, 23,0.3);" />
    <div slot="content">
      <TabContent>
        {#each $positiveEvents as event}
          <div class="event" on:click={() => (eventSelected = event)}>
            {event.label}
            ({event.puntuaction})
          </div>
        {/each}
      </TabContent>
      <TabContent>
        {#each $negativeEvents as event}
          <div class="event" on:click={() => (eventSelected = event)}>
            {event.label}
            ({event.puntuaction})
          </div>
        {/each}
      </TabContent>
    </div>
  </Tabs>
</Modal>
{#if eventSelected}
  <CreateEvent
    open={!!eventSelected}
    event={eventSelected}
    close={() => (eventSelected = undefined)}
    title={$_('edit_event')}
    send={newEvent => {
      const idx = $negativeEvents.findIndex(e => e.label === eventSelected.label);
      if (idx > -1) {
        $negativeEvents[idx] = newEvent;
        negativeEvents.set($negativeEvents);
      } else {
        const idx = $positiveEvents.findIndex(e => e.label === eventSelected.label);
        if (idx > -1) {
          $positiveEvents[idx] = newEvent;
          positiveEvents.set($positiveEvents);
        }
      }
      eventSelected = undefined;
    }} />
{/if}
