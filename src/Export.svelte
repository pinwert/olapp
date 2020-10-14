<script lang="ts">
  import type { IAction, IStudent } from './interfaces';

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

<style>
  button {
    padding: 7px 20px;
    margin: 0 20px;
  }
</style>

<button on:click={exportData}>Export data</button>
