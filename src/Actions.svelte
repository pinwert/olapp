<script lang="ts">
  import type { IAction } from './interfaces';
  export let setEvent: (e: IAction) => void;

  export let positiveEvents: Array<IAction>;
  export let negativeEvents: Array<IAction>;
</script>

<style>
  .row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .column {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .positive {
    background-color: rgba(23, 150, 23);
    padding: 20px;
    margin: 20px;
    border-radius: 6px;
  }
  .negative {
    background-color: rgba(150, 23, 23);
    padding: 20px;
    margin: 20px;
    border-radius: 6px;
  }
  .event {
    border-radius: 6px;
    background-color: rgba(23, 23, 23, 0.3);
    padding: 20px;
    margin: 20px;
    color: white;
  }
</style>

<div class="row">
  <div class="positive column">
    {#each positiveEvents as event}
      <div class="event" on:click={() => setEvent(event)}>{event.label}</div>
    {/each}
  </div>
  <div class="negative column">
    {#each negativeEvents as event}
      <div class="event" on:click={() => setEvent(event)}>{event.label}</div>
    {/each}
  </div>
</div>
