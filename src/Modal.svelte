<script lang="ts">
  export let close: () => void;
  export let title: string;
</script>

<style>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: rgba(23, 23, 23, 0.6);
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
  }
  .close {
    border-radius: 6px;
    border: none;
    background-color: transparent;
    padding: 0 20px;
    font-size: 20px;
    font-weight: 600;
    cursor: pointer;
  }
  .card {
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: white;
    border: 1px solid rgb(102, 100, 100);
    border-radius: 6px;
    padding: 20px;
    box-shadow: 1px 1px 1px 3px rgb(102, 100, 100);
    width: max-content;
    max-width: min(1000px, 90%);
  }
  .title {
    font-size: 22px;
    padding: 20px 0;
    font-weight: bold;
  }
</style>

<div class="modal">
  <div class="card">
    <div class="header">
      <span class="title">{title}</span>
      <span class="close" on:click={close}>X</span>
    </div>
    <slot />
  </div>
</div>
