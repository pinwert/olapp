<script lang="ts">
  export let inportData: (obj: {}) => void;
  import { Button } from 'carbon-components-svelte';
  import { _ } from 'svelte-intl';

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
</script>

<style>
</style>

<Button on:click={inport}>{$_('import_data')}</Button>
