<script lang="ts">
  import type { IAction, IStudent } from './interfaces';
  import {
    Button,
    ButtonSet,
    DataTable,
    TextInput,
    NumberInput,
    Form,
    Checkbox,
    Modal,
    Tabs,
    Tab,
    TabContent,
  } from 'carbon-components-svelte';
  import {
    showActions,
    students,
    negativeEvents,
    positiveEvents,
  } from './store';
  import { beforeUpdate } from 'svelte';
  import { _ } from 'svelte-intl';
  export let name: string;
  export let student: IStudent;
  export let setEvent: (e: IAction) => void;
  export let close: () => void;
  export let open: boolean;
  export let maxByGroup: number;
  let newStudent = student;
  let studentName = student ? student.name : '';
  let label: string = '';
  let puntuation: string;
  let deleteIt: boolean;
  let showDelete: boolean;
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

  let positive = student
    ? student.events.filter(e => e.puntuation >= 0).length /
        student.events.length || 0
    : 0;
  let ponderated = student ? student.puntuation / maxByGroup || 0 : 0;
  beforeUpdate(() => {
    if (student && (!newStudent || newStudent.name !== student.name)) {
      studentName = student.name;
      newStudent = student;
      positive =
        student.events.filter(e => e.puntuation >= 0).length /
          student.events.length || 0;
      ponderated = student.puntuation / maxByGroup || 0;
    }
  });
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

{#if open}
  <Modal
    size="lg"
    {open}
    modalHeading={$_('set_event', { name: name || '' })}
    on:close={close}
    passiveModal>
    {#if student}
      <div class="row">
        Puntuation:
        {student.puntuation}
        Calculated:
        {((positive + ponderated) / 2).toFixed(2)}
        Positive:
        {positive.toFixed(2)}
        Ponderated:
        {ponderated.toFixed(2)}
      </div>
    {/if}
    <Tabs type="container">
      <Tab
        label={$_('add_positive')}
        style="background-color: rgba(23, 150, 23,0.3);" />
      <Tab
        label={$_('add_negative')}
        style="background-color: rgba(150, 23, 23,0.3);" />
      <Tab label={$_('add_comment')} />
      {#if student}
        {#if student.events.length}
          <Tab label={$_('history')} />
        {/if}
        <Tab label={$_('edit')} />
      {/if}
      <div slot="content">
        <TabContent>
          {#each $positiveEvents as event}
            <div class="event" on:click={() => setEvent(event)}>
              {event.label}
              ({event.puntuaction})
            </div>
          {/each}
        </TabContent>
        <TabContent>
          {#each $negativeEvents as event}
            <div class="event" on:click={() => setEvent(event)}>
              {event.label}
              ({event.puntuaction})
            </div>
          {/each}
        </TabContent>
        <TabContent>
          <Form
            on:submit={() => {
              setEvent({ label: label, puntuaction: Number(puntuation) });
            }}>
            <TextInput labelText="Label" bind:value={label} />
            <NumberInput mobile label="Puntuation" bind:value={puntuation} />
            <ButtonSet style="padding-top: 10px;">
              <Button type="submit">Submit</Button>
            </ButtonSet>
          </Form>
        </TabContent>
        {#if student}
          {#if student.events.length}
            <TabContent>
              <DataTable
                sortable
                headers={[{ key: 'eventType', value: 'Event' }, { key: 'createdAt', value: 'Date' }, { key: 'puntuation', value: 'Puntuation' }]}
                rows={student.events.map((s, idx) => ({
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
                }))} />
            </TabContent>
          {/if}
          <TabContent>
            <Form
              on:submit={e => {
                e.preventDefault();
                editStudent({ ...student, name: studentName });
              }}>
              <TextInput labelText="Name" bind:value={studentName} />
              <ButtonSet>
                <Button
                  kind="danger"
                  on:click={() => {
                    showDelete = true;
                  }}>
                  Delete
                </Button>
                <Button
                  kind="secondary"
                  on:click={() => {
                    studentName = student.name;
                  }}>
                  Cancel
                </Button>
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
    primaryButtonDisabled={!deleteIt}>
    <Checkbox labelText="I am sure to delete it" bind:checked={deleteIt} />
  </Modal>
{/if}
