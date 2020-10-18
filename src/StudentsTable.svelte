<script lang="ts">
  import { Checkbox, Grid, Row, Tile, Column } from 'carbon-components-svelte';
  import { beforeUpdate } from 'svelte';

  import type { IStudent } from './interfaces';

  export let students: Array<IStudent>;
  export let sortBy: 'alphabetical' | 'more-points' | 'less-points';
  export let selecteds: Array<string>;
  export let onShowActions: (s: Array<IStudent>) => void;
  export let setSelecteds: (s: Array<string>) => void;
  $: sortedStudents =
    sortBy &&
    students.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'alphabetical':
          const nameA = (a.name || '').toUpperCase();
          const nameB = (b.name || '').toUpperCase();
          if (nameA > nameB) {
            comparison = 1;
          } else if (nameA < nameB) {
            comparison = -1;
          }
          return comparison;
        case 'less-points':
          if ((a.puntuation || 0) > (b.puntuation || 0)) {
            comparison = 1;
          } else if ((a.puntuation || 0) < (b.puntuation || 0)) {
            comparison = -1;
          }
          return comparison;
        case 'more-points':
          if ((a.puntuation || 0) < (b.puntuation || 0)) {
            comparison = 1;
          } else if ((a.puntuation || 0) > (b.puntuation || 0)) {
            comparison = -1;
          }
          return comparison;
      }
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
        <div class="card">
          <Tile
            light={selecteds.includes(student.id)}
            on:click={() => onShowActions([student])}
            style="cursor: pointer;">
            <div class="row">
              <Checkbox
                style="padding: 10px"
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
                {student.puntuation || student.events.reduce((acc, s) => {
                    acc = acc + s.puntuation;
                    return acc;
                  }, 0)}
              </div>
            </div>
            <div class="name">{student.name}</div>
          </Tile>
        </div>
      </Column>
    {/each}
  </Row>
</Grid>
