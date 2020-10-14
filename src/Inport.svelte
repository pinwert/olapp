<script lang="ts">
  export let inportData: (obj: {}) => void;

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
  button {
    padding: 7px 20px;
    margin: 0 20px;
  }
</style>

<button on:click={inport}>Import data</button>
