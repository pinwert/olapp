<script lang="ts">
  import type { IStudent } from './interfaces';

  export let students: Array<IStudent>;
  export let selecteds: Array<string>;
  export let onShowHistory: (s: IStudent) => void;
  export let onShowActions: (s: Array<IStudent>) => void;
  export let setSelecteds: (s: Array<string>) => void;
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

<table class="table">
  <thead>
    <tr>
      <th>select</th>
      <th>Name</th>
      <th>Group</th>
      <th>Punctuation</th>
      <th>Historic</th>
    </tr>
  </thead>
  <tbody>
    {#each students as student}
      <tr
        on:click={() => {
          onShowActions([student]);
        }}>
        <td>
          <input
            type="checkbox"
            on:click={e => {
              e.stopImmediatePropagation();
            }}
            on:change={e => {
              if (e.currentTarget.checked) {
                setSelecteds([...selecteds, student.id]);
              } else {
                const idx = selecteds.indexOf(student.id);
                if (idx > -1) selecteds.splice(idx, 1);
                setSelecteds([...selecteds]);
              }
            }} />
        </td>
        <td>{student.name}</td>
        <td>{student.group}</td>
        <td>
          {student.events.reduce((acc, s) => {
            acc = acc + s.puntuation;
            return acc;
          }, 0)}
        </td>
        <td
          on:click={e => {
            e.preventDefault();
            e.stopImmediatePropagation();
            onShowHistory(student);
          }}>
          View
        </td>
      </tr>
    {/each}
  </tbody>
</table>
