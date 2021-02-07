<script lang="ts">
  import {
    Button,
    Header,
    HeaderUtilities,
    HeaderAction,
    HeaderPanelLinks,
    HeaderPanelDivider,
    HeaderPanelLink,
    SideNav,
    SideNavItems,
    SideNavLink,
    SkipToContent,
    Content,
    Grid,
    Row,
    Column,
    DatePicker,
    DatePickerInput,
  } from 'carbon-components-svelte';
  import { _ } from 'svelte-intl';
  import {
    journey,
    groups,
    groupSelected,
    negativeEvents,
    positiveEvents,
    session,
    students,
    from,
    to,
  } from './store';

  let isSideNavOpen = false;
  let isOpen = false;

  export let showModal: (m: string) => void;

  function inport() {
    let element = document.createElement('input');
    element.setAttribute('type', 'file');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();
    element.onblur = () => document.body.removeChild(element);
    element.onchange = () => {
      const reader = new FileReader();
      reader.onload = event => {
        const obj = JSON.parse(event.target.result as string);
        inportData(obj);
      };
      reader.readAsText(element.files[0]);
      document.body.removeChild(element);
    };
  }

  const inportData = obj => {
    students.set(obj.students);
    groups.set(obj.groups);
    positiveEvents.set(obj.positiveEvents);
    negativeEvents.set(obj.negativeEvents);
  };

  function exportData() {
    var dataUri =
      'data:application/json;charset=utf-8,' +
      encodeURIComponent(
        JSON.stringify({
          students: $students,
          groups: $groups,
          positiveEvents: $positiveEvents,
          negativeEvents: $negativeEvents,
        })
      );
    let element = document.createElement('a');
    element.setAttribute('href', dataUri);
    element.setAttribute('download', 'data.json');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }
</script>

<Header company="OLAPP" platformName={$groupSelected} bind:isSideNavOpen>
  <div slot="skip-to-content">
    <SkipToContent />
  </div>
  <Button kind="ghost" on:click={() => journey.set([])}>
    {$_('init_journey')}
  </Button>
  <Button kind="ghost" on:click={() => session.set({})}>
    {$_('clean_session')}
  </Button>
  <HeaderUtilities>
    <HeaderAction bind:isOpen>
      <HeaderPanelLinks>
        <HeaderPanelDivider>{$_('create')}:</HeaderPanelDivider>
        <HeaderPanelLink on:click={() => showModal('showCreateGroup')}>
          {$_('new_group')}
        </HeaderPanelLink>
        <HeaderPanelLink on:click={() => showModal('showCreateStudent')}>
          {$_('new_student')}
        </HeaderPanelLink>
        <HeaderPanelLink on:click={() => showModal('showCreateEvent')}>
          {$_('new_event')}
        </HeaderPanelLink>
        <HeaderPanelDivider>{$_('edit')}:</HeaderPanelDivider>
        <HeaderPanelLink on:click={() => showModal('showEditEvent')}>
          {$_('edit_event')}
        </HeaderPanelLink>
        <HeaderPanelLink
          on:click={() => {
            exportData();
            showModal('showClearEvents');
          }}
        >
          {$_('clear_events')}
        </HeaderPanelLink>

        <HeaderPanelDivider>{$_('export_inport')}</HeaderPanelDivider>
        <HeaderPanelLink on:click={exportData}>
          {$_('export_data')}
        </HeaderPanelLink>
        <HeaderPanelLink on:click={inport}>{$_('import_data')}</HeaderPanelLink>
      </HeaderPanelLinks>
    </HeaderAction>
  </HeaderUtilities>
</Header>

<SideNav bind:isOpen={isSideNavOpen}>
  <SideNavItems>
    {#each $groups as group}
      <SideNavLink
        text={group}
        on:click={() => {
          groupSelected.set(group);
        }}
      />
    {/each}
    <div class="date">
      <DatePicker datePickerType="single" bind:value={$from}>
        <DatePickerInput
          size="sm"
          labelText={$_('from')}
          placeholder="mm/dd/yyyy"
        />
      </DatePicker>

      <DatePicker datePickerType="single" bind:value={$to}>
        <DatePickerInput
          size="sm"
          labelText={$_('to')}
          placeholder="mm/dd/yyyy"
        />
      </DatePicker>
    </div>
  </SideNavItems>
</SideNav>

<Content
  style={`height: calc(100% - 47px); overflow: hidden; display: flex; flex-direction: column; padding:0;`}
>
  <slot />
</Content>

<style>
  .date {
    margin: 20px;
  }
  :global(.bx--date-picker__input) {
    width: 13rem !important;
  }
</style>
