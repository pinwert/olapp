<script lang="ts">
  import { Checkbox, Grid, Row, Tile, Column } from 'carbon-components-svelte';
  import { cardColors } from './colors';
  import type { IStudent } from './interfaces';

  import { journey, selecteds, session, showActions, from, to } from './store';
  export let students: Array<IStudent>;
  export let sortBy: 'alphabetical' | 'more-points' | 'less-points';

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

<div class="container">
  <Grid fullWidth noGutter>
    <Row>
      {#each sortedStudents as student}
        <Column>
          <div class="card">
            <Tile
              light={$selecteds.includes(student.id)}
              style={'border-radius: 10px; box-shadow: 1px 1px 3px grey; padding:0px; ' +
                ($journey.includes(student.id)
                  ? 'cursor: default; background-color: rgba(240,128,128, 0.4);'
                  : 'cursor: pointer;')}
              on:click={() => showActions.set([student])}
            >
              <div class="row">
                <Checkbox
                  style={'padding: 10px 20px; flex:0'}
                  checked={$selecteds.includes(student.id)}
                  on:click={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (!$selecteds.includes(student.id)) {
                      selecteds.set([...$selecteds, student.id]);
                    } else {
                      const idx = $selecteds.indexOf(student.id);
                      if (idx > -1) $selecteds.splice(idx, 1);
                      selecteds.set([...$selecteds]);
                    }
                  }}
                />
                {#if $session[student.id]}
                  <div class="flags">
                    {#each $session[student.id] as color}
                      <div class="flag" style="--color: {color};" />
                    {/each}
                  </div>
                {/if}
                <div class="number">
                  {(!$from && !$to && student.puntuation) ||
                    student.events
                      .filter(
                        e =>
                          (!$from || new Date($from).getTime() < e.createdAt) &&
                          (!$to || new Date($to).getTime() > e.createdAt)
                      )
                      .reduce((acc, s) => {
                        acc = acc + s.puntuation;
                        return acc;
                      }, 0)}
                </div>
              </div>
              <div
                class="name"
                style={'background-color: ' +
                  cardColors[
                    student.name
                      ? student.name.trim().charCodeAt(0) % cardColors.length
                      : 0
                  ].replace('1)', '0.5)')}
              >
                {student.name}
              </div>
            </Tile>
          </div>
        </Column>
      {/each}
    </Row>
  </Grid>
</div>

<style>
  .container {
    flex: 1;
    overflow-y: auto;
  }
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
  }
  .name {
    font-size: 18px;
    padding: 0 10px;
    font-weight: 500;
    padding: 20px;
    text-align: center;
    color: black;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
  .number {
    font-size: 20px;
    padding: 10px 20px;
    font-weight: 500;
  }
  .flags {
    position: absolute;
    top: 0px;
    right: -7px;
    display: flex;
    flex-direction: column;
  }
  .flag {
    background-color: var(--color);
    border-radius: 50%;
    width: 15px;
    height: 15px;
    margin-bottom: 3px;
    box-shadow: 1px 1px grey;
  }
</style>
