<script lang="ts">
  import type { IAction, IStudent } from './interfaces';
  import {
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
  } from 'carbon-components-svelte';

  let isSideNavOpen = false;
  let isOpen = false;
  export let inportData: (obj: {}) => void;
  export let showModal: (m: string) => void;
  export let setGroupSelected: (g: string) => void;
  export let groupSelected: string;

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

  export let students: Array<IStudent>;
  export let groups: Array<string>;

  export let positiveEvents: Array<IAction>;
  export let negativeEvents: Array<IAction>;

  function exportData() {
    var dataUri =
      'data:application/json;charset=utf-8,' +
      encodeURIComponent(
        JSON.stringify({
          students,
          groups,
          positiveEvents,
          negativeEvents,
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

<Header company="OLAPP" platformName={groupSelected} bind:isSideNavOpen>
  <div slot="skip-to-content">
    <SkipToContent />
  </div>
  <HeaderUtilities>
    <HeaderAction bind:isOpen>
      <HeaderPanelLinks>
        <HeaderPanelDivider>Change group:</HeaderPanelDivider>
        {#each groups as group}
          <HeaderPanelLink
            on:click={() => {
              setGroupSelected(group);
            }}>
            {group}
          </HeaderPanelLink>
        {/each}
      </HeaderPanelLinks>
    </HeaderAction>
  </HeaderUtilities>
</Header>

<SideNav bind:isOpen={isSideNavOpen}>
  <SideNavItems>
    <SideNavLink
      text="Create Group"
      on:click={() => showModal('showCreateGroup')} />
    <SideNavLink
      text="Create Student"
      on:click={() => showModal('showCreateStudent')} />
    <SideNavLink
      text="Create Positive"
      on:click={() => showModal('showCreatePositive')} />
    <SideNavLink
      text="Create Negative"
      on:click={() => showModal('showCreateNegative')} />
    <SideNavLink text="Export data" on:click={exportData} />
    <SideNavLink text="Import data" on:click={inport} />
  </SideNavItems>
</SideNav>

<Content>
  <Grid>
    <Row>
      <Column>
        <slot />
      </Column>
    </Row>
  </Grid>
</Content>
