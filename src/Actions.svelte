<script lang="ts">
  import type { IAction, IStudent } from './interfaces';
  import {
    Button,
    ButtonSet,
    DataTable,
    DatePicker,
    DatePickerInput,
    Tag,
    NumberInput,
    Form,
    Checkbox,
    Modal,
    Tabs,
    Tab,
    TabContent,
    TextInput,
    Toggle,
  } from 'carbon-components-svelte';
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
  export let name: string;
  export let student: IStudent;
  export let setEvent: (e: IAction, when?: number) => void;
  export let close: () => void;
  export let open: boolean;
  export let maxByGroup: number;
  let newStudent = student;
  let studentName = student ? student.name : '';
  let label: string = '';
  let puntuation: string;
  let deleteIt: boolean;
  let showDelete: boolean;
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
    ? events.reduce((acc, s) => {
        acc = acc + s.puntuation;
        return acc;
      }, 0)
    : 0;
  let positive = student
    ? events.filter(e => e.puntuation >= 0).length / student.events.length || 0
    : 0;
  let ponderated = student ? totalPuntuation / maxByGroup || 0 : 0;
  beforeUpdate(() => {
    if (student && (!newStudent || newStudent.name !== student.name)) {
      events = student.events.filter(
        e =>
          (!$from || new Date($from).getTime() < e.createdAt) &&
          (!$to || new Date($to).getTime() > e.createdAt)
      );
      studentName = student.name;
      newStudent = student;
      positive =
        events.filter(e => e.puntuation >= 0).length / student.events.length ||
        0;
      totalPuntuation = events.reduce((acc, s) => {
        acc = acc + s.puntuation;
        return acc;
      }, 0);
      ponderated = totalPuntuation / maxByGroup || 0;
    }
  });
</script>

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
        {#if student.events.length}
          <Tab label={$_('history')} />
        {/if}
        <Tab label={$_('edit')} />
      {/if}
      <div slot="content">
        <TabContent>
          {#each $positiveEvents as event}
            <div class="event" on:click={() => setEvent(event, date)}>
              {event.label}
              ({event.puntuaction})
            </div>
          {/each}

          <DatePicker datePickerType="single" bind:value={date}>
            <DatePickerInput
              size="sm"
              labelText={$_('when')}
              placeholder="mm/dd/yyyy"
            />
          </DatePicker>
        </TabContent>
        <TabContent>
          {#each $negativeEvents as event}
            <div class="event" on:click={() => setEvent(event, date)}>
              {event.label}
              ({event.puntuaction})
            </div>
          {/each}

          <DatePicker datePickerType="single" bind:value={date}>
            <DatePickerInput
              size="sm"
              labelText={$_('when')}
              placeholder="mm/dd/yyyy"
            />
          </DatePicker>
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
          {#if student.events.length}
            <TabContent>
              <DataTable
                sortable
                headers={[
                  { key: 'eventType', value: 'Event' },
                  { key: 'createdAt', value: 'Date' },
                  { key: 'puntuation', value: 'Puntuation' },
                ]}
                rows={student.events
                  .filter(
                    e =>
                      (!$from || new Date($from).getTime() < e.createdAt) &&
                      (!$to || new Date($to).getTime() > e.createdAt)
                  )
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
              />
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
                  }}
                >Delete</Button
                >
                <Button
                  kind="secondary"
                  on:click={() => {
                    studentName = student.name;
                  }}
                >Cancel</Button
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
{/if}

<style>
  .event {
    border-radius: 6px;
    background-color: rgba(23, 23, 23, 0.3);
    padding: 20px;
    margin: 20px;
    color: white;
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
</style>
