<script lang="ts">
  import { Modal } from 'carbon-components-svelte';
  import type { IStudent } from './interfaces';
  export let student: IStudent;
  export let close: () => void;
  export let open: boolean;
</script>

<style>
  tr {
    border-bottom: 10px solid white;
  }
  td {
    text-align: center;
    background-color: rgb(102, 100, 100, 0.3);
    padding: 10px;
    border: none;
    white-space: nowrap;
  }
  .table {
    width: 100%;
    border-collapse: collapse;
    max-width: min(1000px, 90%);
  }
</style>

{#if student}
  <Modal
    {open}
    passiveModal
    modalHeading={`History for: ${student.name}`}
    on:close={close}>
    <table class="table">
      <thead>
        <tr>
          <th>event</th>
          <th>date</th>
          <th>Punctuation</th>
        </tr>
      </thead>
      <tbody>
        {#each student.events as event}
          <tr>
            <td>{event.eventType}</td>
            <td>
              {(() => {
                const d = new Date(event.createdAt);
                const ye = new Intl.DateTimeFormat('en', {
                  year: 'numeric',
                }).format(d);
                const mo = new Intl.DateTimeFormat('en', {
                  month: 'short',
                }).format(d);
                const da = new Intl.DateTimeFormat('en', {
                  day: '2-digit',
                }).format(d);
                return `${da}-${mo}-${ye}`;
              })()}
            </td>
            <td>{event.puntuation}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </Modal>
{/if}
