<script lang="ts">
  import { Checkbox, Grid, Row, Tile, Column } from 'carbon-components-svelte';

  import type { IStudent } from './interfaces';

  export let students: Array<IStudent>;
  export let selecteds: Array<string>;
  export let onShowHistory: (s: IStudent) => void;
  export let onShowActions: (s: Array<IStudent>) => void;
  export let setSelecteds: (s: Array<string>) => void;
  export let onEditStudent: (s: IStudent) => void;
  let sortedStudents = students.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    let comparison = 0;
    if (nameA > nameB) {
      comparison = 1;
    } else if (nameA < nameB) {
      comparison = -1;
    }
    return comparison;
  });
</script>

<style>
  .card {
    padding: 10px;
    padding-left: 0px;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
  }
  .row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
  }
  .name {
    font-size: 18px;
    padding: 0 10px;
    font-weight: 500;
  }
  .number {
    font-size: 20px;
    font-weight: 500;
  }
</style>

<Grid fullWidth noGutter>
  <Row>
    {#each sortedStudents as student}
      <Column>
        <div class="card" on:click={() => onShowActions([student])}>
          <Tile light={selecteds.includes(student.id)}>
            <div class="row">
              <Checkbox
                checked={selecteds.includes(student.id)}
                on:click={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (!selecteds.includes(student.id)) {
                    setSelecteds([...selecteds, student.id]);
                  } else {
                    const idx = selecteds.indexOf(student.id);
                    if (idx > -1) selecteds.splice(idx, 1);
                    setSelecteds([...selecteds]);
                  }
                }} />
              <div class="number">
                {student.events.reduce((acc, s) => {
                  acc = acc + s.puntuation;
                  return acc;
                }, 0)}
              </div>
            </div>
            <div class="name">{student.name}</div>
            <div class="row">
              <div
                on:click={e => {
                  e.preventDefault();
                  e.stopImmediatePropagation();
                  onShowHistory(student);
                }}>
                View
              </div>
              <div
                on:click={e => {
                  e.preventDefault();
                  e.stopImmediatePropagation();
                  onEditStudent(student);
                }}>
                Edit
              </div>
            </div>
          </Tile>
        </div>
      </Column>
    {/each}
  </Row>
</Grid>
