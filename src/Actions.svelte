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
    Tile,
  } from 'carbon-components-svelte';
  import { beforeUpdate } from 'svelte';
  export let name: string;
  export let student: IStudent;
  export let setEvent: (e: IAction) => void;
  export let editStudent: (e: IStudent) => void;
  export let deleteStudent: (e: IStudent) => void;
  export let positiveEvents: Array<IAction>;
  export let negativeEvents: Array<IAction>;
  export let close: () => void;
  export let open: boolean;
  let newStudent = student;
  let studentName = student ? student.name : '';
  let label: string = '';
  let puntuation: string;
  let deleteIt: boolean;
  let showDelete: boolean;
  beforeUpdate(() => {
    if (student && (!newStudent || newStudent.name !== student.name)) {
      studentName = student.name;
      newStudent = student;
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
    modalHeading={`Set event: ${name || ''}`}
    on:close={close}
    passiveModal>
    <Tabs type="container">
      <Tab
        label="Add positive"
        style="background-color: rgba(23, 150, 23,0.3);" />
      <Tab
        label="Add negative"
        style="background-color: rgba(150, 23, 23,0.3);" />
      <Tab label="Add comment" />
      {#if student}
        {#if student.events.length}
          <Tab label="History" />
        {/if}
        <Tab label="Edit" />
      {/if}
      <div slot="content">
        <TabContent>
          {#each positiveEvents as event}
            <div class="event" on:click={() => setEvent(event)}>
              {event.label}
              ({event.puntuaction})
            </div>
          {/each}
        </TabContent>
        <TabContent>
          {#each negativeEvents as event}
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
                console.log(')', studentName);
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
