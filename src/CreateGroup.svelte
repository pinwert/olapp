<script lang="ts">
  export let send: (e: string) => void;
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
    send(new FormData(e.currentTarget).get('group_name').toString());
  }}>
  <label for="group_name">Create group:</label>
  <input name="group_name" id="group_name" />
  <button>Create</button>
</form>
