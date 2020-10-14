<script lang="ts">
  import type { IAction } from './interfaces';

  export let send: (e: IAction) => void;
</script>

<style>
  button {
    padding: 7px 20px;
    margin: 0 20px;
    background-color: rgba(30, 130, 30, 1);
    color: white;
    border-radius: 6px;
  }
</style>

<form
  on:submit={e => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const newNegativeEvent = { label: data
        .get('label')
        .toString(), puntuaction: Number(data.get('puntuaction').toString()) };
    send(newNegativeEvent);
  }}>
  <label for="label">label:</label>
  <input name="label" id="label" />
  <label for="puntuaction">puntuaction:</label>
  <input name="puntuaction" id="puntuaction" />
  <button>Create</button>
</form>
