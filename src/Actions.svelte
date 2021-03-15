<script lang="ts">
  import { cardColors } from './colors';
  import type { IAction, IStudent } from './interfaces';
  import {
    Button,
    ButtonSet,
    Checkbox,
    DataTable,
    DatePicker,
    DatePickerInput,
    Form,
    Grid,
    Icon,
    Modal,
    NumberInput,
    Row,
    Tab,
    TabContent,
    Tabs,
    Tag,
    TextInput,
    Toggle,
  } from 'carbon-components-svelte';
  import Delete20 from 'carbon-icons-svelte/lib/Delete20';
  import { DonutChart } from '@carbon/charts-svelte';
  import {
    journey,
    showActions,
    students,
    negativeEvents,
    positiveEvents,
    from,
    to,
  } from './store';
  import { beforeUpdate } from 'svelte';
  import { _ } from 'svelte-intl';
  import { Alignments } from '@carbon/charts/interfaces';
  export let name: string;
  export let student: IStudent;
  export let setEvent: (e: IAction, when?: number) => void;
  export let deleteEvent: (index: number) => void;
  export let close: () => void;
  export let open: boolean;
  export let maxByGroup: number;
  let newStudent = student;
  let studentName = student ? student.name : '';
  let label: string = '';
  let puntuation: string;
  let deleteIt: boolean;
  let showDelete: boolean;
  let showDeleteEvent: number | undefined;
  let date = Date.now();
  const editStudent = (s: IStudent) => {
    const idx = $students.findIndex(st => st.id === s.id);
    if (idx > -1) {
      $students[idx] = s;
      students.set($students);
    }
    showActions.set([]);
  };
  const deleteStudent = (s: IStudent) => {
    students.set($students.filter(st => st.id !== s.id));
    showActions.set([]);
  };
  let events = student
    ? student.events.filter(
        e =>
          (!$from || new Date($from).getTime() < e.createdAt) &&
          (!$to || new Date($to).getTime() > e.createdAt)
      )
    : [];
  let totalPuntuation = student
    ? events.reduce((acc, e) => {
        acc = acc + e.puntuation;
        return acc;
      }, 0)
    : 0;
  let positive = student
    ? events.filter(e => e.puntuation >= 0).length / events.length || 0
    : 0;
  let ponderated = student ? totalPuntuation / maxByGroup || 0 : 0;
  beforeUpdate(() => {
    if (student /* && (!newStudent || newStudent.name !== student.name)*/) {
      events = student.events.filter(
        e =>
          (!$from || new Date($from).getTime() < e.createdAt) &&
          (!$to || new Date($to).getTime() > e.createdAt)
      );
      studentName = student.name;
      newStudent = student;
      positive =
        events.filter(e => e.puntuation >= 0).length / events.length || 0;
      totalPuntuation = events.reduce((acc, e) => {
        acc = acc + e.puntuation;
        return acc;
      }, 0);
      ponderated = totalPuntuation / maxByGroup || 0;
    }
  });
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://unpkg.com/@carbon/charts/styles.min.css"
  />
</svelte:head>

{#if open}
  <Modal
    size="lg"
    hasForm
    {open}
    modalHeading={$_('set_event', { name: name || '' })}
    on:close={close}
    passiveModal
  >
    {#if student}
      <div class="row">
        <div class="column">
          <Toggle
            labelText={$_('in_class')}
            labelA="No"
            labelB="Yes"
            toggled={!$journey.includes(student.id)}
            on:click={e => {
              e.stopPropagation();
              e.preventDefault();
              if (!$journey.includes(student.id)) {
                journey.set([...$journey, student.id]);
              } else {
                const idx = $journey.indexOf(student.id);
                if (idx > -1) $journey.splice(idx, 1);
                journey.set([...$journey]);
              }
            }}
          />
        </div>
        <div class="column">
          Puntuation
          <Tag>{totalPuntuation.toFixed(2)}</Tag>
        </div>
        <div class="column">
          Calculated
          <Tag type="blue">{((positive + ponderated) / 2).toFixed(2)}</Tag>
        </div>
        <div class="column">
          Nº Pos / Nº total
          <Tag>{positive.toFixed(2)}</Tag>
        </div>
        <div class="column">
          My / Max
          <Tag>{ponderated.toFixed(2)}</Tag>
        </div>
      </div>
    {/if}
    <Tabs type="container">
      <Tab
        label={$_('add_positive')}
        style="background-color: rgba(23, 150, 23,0.3);"
      />
      <Tab
        label={$_('add_negative')}
        style="background-color: rgba(150, 23, 23,0.3);"
      />
      <Tab label={$_('add_comment')} />
      {#if student}
        {#if events.length}
          <Tab label={$_('history')} />
        {/if}
        <Tab label={$_('edit')} />
      {/if}
      <div slot="content">
        <TabContent>
          <Grid fullWidth noGutter>
            <DatePicker datePickerType="single" bind:value={date}>
              <DatePickerInput
                size="sm"
                labelText={$_('when')}
                placeholder="mm/dd/yyyy"
              />
            </DatePicker>
            <Row>
              {#each $positiveEvents as event}
                <div
                  class="event"
                  on:click={() => setEvent(event, date)}
                  style={`background-color: ${cardColors[
                    event.label
                      ? event.label.trim().charCodeAt(0) % cardColors.length
                      : 0
                  ].replace('1)', '0.4)')}`}
                >
                  {event.label}
                  <span class="value">
                    {event.puntuaction}
                  </span>
                </div>
              {/each}
            </Row>
          </Grid>
        </TabContent>
        <TabContent>
          <Grid fullWidth noGutter>
            <DatePicker datePickerType="single" bind:value={date}>
              <DatePickerInput
                size="sm"
                labelText={$_('when')}
                placeholder="mm/dd/yyyy"
              />
            </DatePicker>
            <Row>
              {#each $negativeEvents as event}
                <div
                  class="event"
                  on:click={() => setEvent(event, date)}
                  style={`background-color: ${cardColors[
                    event.label
                      ? event.label.trim().charCodeAt(0) % cardColors.length
                      : 0
                  ].replace('1)', '0.4)')}`}
                >
                  {event.label}
                  <span class="value">
                    {event.puntuaction}
                  </span>
                </div>
              {/each}
            </Row>
          </Grid>
        </TabContent>
        <TabContent>
          <Form
            on:submit={() => {
              setEvent({ label: label, puntuaction: Number(puntuation) });
            }}
          >
            <TextInput labelText="Label" bind:value={label} />
            <NumberInput mobile label="Puntuation" bind:value={puntuation} />
            <DatePicker datePickerType="single" bind:value={date}>
              <DatePickerInput
                size="sm"
                labelText={$_('when')}
                placeholder="mm/dd/yyyy"
              />
            </DatePicker>
            <ButtonSet style="padding-top: 10px;">
              <Button type="submit">Submit</Button>
            </ButtonSet>
          </Form>
        </TabContent>
        {#if student}
          {#if events.length}
            <TabContent>
              <Row>
                <div class="card">
                  <DonutChart
                    data={[
                      {
                        group: 'Positive',
                        value: events.reduce((acc, e) => {
                          if (e.puntuation > 0) ++acc;
                          return acc;
                        }, 0),
                      },
                      {
                        group: 'Negative',
                        value: events.reduce((acc, e) => {
                          if (e.puntuation < 0) ++acc;
                          return acc;
                        }, 0),
                      },
                    ]}
                    options={{
                      resizable: true,
                      donut: {
                        center: {
                          label: 'Positive/Negative',
                        },
                        alignment: Alignments.CENTER,
                      },
                      color: {
                        scale: {
                          Positive: 'rgba(23, 150, 23,0.3)',
                          Negative: 'rgba(150, 23, 23,0.3)',
                        },
                      },
                      height: '300px',
                    }}
                  />
                </div>
                <div class="card">
                  <DonutChart
                    data={events.reduce((acc, e) => {
                      if (e.puntuation > 0) {
                        const selected = acc.find(a => a.group === e.eventType);
                        if (selected) ++selected.value;
                        else acc.push({ group: e.eventType, value: 1 });
                      }

                      return acc;
                    }, [])}
                    options={{
                      resizable: true,
                      donut: {
                        center: {
                          label: 'Positives',
                        },
                        alignment: Alignments.CENTER,
                      },
                      height: '300px',
                    }}
                  />
                </div>
                <div class="card">
                  <DonutChart
                    data={events.reduce((acc, e) => {
                      if (e.puntuation < 0) {
                        const selected = acc.find(a => a.group === e.eventType);
                        if (selected) ++selected.value;
                        else acc.push({ group: e.eventType, value: 1 });
                      }

                      return acc;
                    }, [])}
                    options={{
                      resizable: true,
                      donut: {
                        center: {
                          label: 'Negatives',
                        },
                        alignment: Alignments.CENTER,
                      },
                      height: '300px',
                    }}
                  />
                </div>
              </Row>
              <DataTable
                sortable
                headers={[
                  { key: 'eventType', value: 'Event' },
                  { key: 'createdAt', value: 'Date' },
                  { key: 'puntuation', value: 'Puntuation' },
                  { key: 'delete', value: 'Delete' },
                ]}
                rows={events
                  .sort((a, b) => a.createdAt - b.createdAt)
                  .map((s, idx) => ({
                    ...s,
                    createdAt: (() => {
                      const d = new Date(s.createdAt);
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
                    })(),
                    id: idx,
                  }))}
              >
                <span slot="cell" let:row let:cell>
                  {#if cell.key === 'delete'}
                    <div
                      class="delete"
                      on:click={() => {
                        showDeleteEvent = row.id;
                      }}
                    >
                      <Icon render={Delete20} />
                    </div>
                  {:else}{cell.value}{/if}
                </span>
              </DataTable>
            </TabContent>
          {/if}
          <TabContent>
            <Form
              on:submit={e => {
                e.preventDefault();
                editStudent({ ...student, name: studentName });
              }}
            >
              <TextInput labelText="Name" bind:value={studentName} />
              <ButtonSet>
                <Button
                  kind="danger"
                  on:click={() => {
                    showDelete = true;
                  }}>Delete</Button
                >
                <Button
                  kind="secondary"
                  on:click={() => {
                    studentName = student.name;
                  }}>Cancel</Button
                >
                <Button type="submit">Save</Button>
              </ButtonSet>
            </Form>
          </TabContent>
        {/if}
      </div>
    </Tabs>
  </Modal>

  <Modal
    open={showDelete}
    modalHeading={`Confirm delete: ${name || ''}`}
    on:submit={() => {
      showDelete = false;
      deleteStudent(student);
    }}
    on:close={() => {
      showDelete = false;
    }}
    secondaryButtonText="Cancel"
    on:click:button--secondary={() => {
      showDelete = false;
    }}
    primaryButtonText="Proceed"
    primaryButtonDisabled={!deleteIt}
  >
    <Checkbox labelText="I am sure to delete it" bind:checked={deleteIt} />
  </Modal>

  <Modal
    open={typeof showDeleteEvent === 'number'}
    modalHeading={`Confirm delete`}
    on:submit={() => {
      deleteEvent(showDeleteEvent);
      showDeleteEvent = undefined;
    }}
    on:close={() => {
      showDeleteEvent = undefined;
    }}
    secondaryButtonText="Cancel"
    on:click:button--secondary={() => {
      showDeleteEvent = undefined;
    }}
    primaryButtonText="Proceed"
  >
    <p>Are you sure to delete this event</p>
  </Modal>
{/if}

<style>
  .event {
    border-radius: 6px;
    background-color: rgba(23, 23, 23, 0.1);
    padding: 20px;
    margin: 20px;
    color: black;
    min-width: 20%;
    display: flex;
    justify-content: space-between;
  }
  .value {
    color: black;
    background-color: white;
    border-radius: 50%;
    padding: 0px 6px 1px;
  }
  .row {
    display: flex;
    justify-content: space-between;
    flex: 1;
  }
  .column {
    display: flex;
    flex: 1;
    justify-content: space-between;
    flex-direction: column;
    padding-bottom: 5px;
  }
  .card {
    padding: 3%;
    padding-left: 0px;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    flex: 1;
  }
  .delete {
    cursor: pointer;
  }
</style>
