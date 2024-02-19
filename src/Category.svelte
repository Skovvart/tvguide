<script lang="ts">
  export let category: string;
  export let selected: boolean = false;
  const ignore = () => {};
  export let click: () => void = ignore;
  $: clickable = click !== ignore;
</script>

{#if clickable}
  <button class={category} class:selected class:pointer={click !== ignore} on:click={click} role={click !== ignore ? "radio" : "presentation"} aria-checked={selected}>{category}</button>
{:else}
  <span class={category} class:selected aria-checked={selected}>{category}</span>
{/if}

<style>
  span,
  button {
    color: #fff;
    font-weight: 700;
    display: inline-block;
    background-color: #fff;
    border: 1px solid #ccc;
    user-select: none;

    padding: 6px 12px;
    font-size: 14px;

    text-align: center;
    vertical-align: middle;

    border-radius: 5px;
    background-image: var(--gradient-dark);
  }
  .pointer {
    cursor: pointer;
  }
  .selected {
    font-style: italic;
  }
  .Alle {
    color: #000;
  }
  .Serie {
    background-color: #5cb85c;
    border-color: #4cae4c;
  }
  .Film {
    background-color: #5bc0de;
    border-color: #46b8da;
  }
  .Sport {
    background-color: #d9534f;
    border-color: #d43f3a;
  }
  .Dokumentar {
    background-color: #f0ad4e;
    border-color: #eea236;
  }
  .Nyheder {
    background-color: #0073a0;
    border-color: #005558;
  }
  .Kultur {
    background-color: #7300a0;
    border-color: #3f0058;
  }
  .Drama {
    background-color: #a00063;
    border-color: #580033;
  }
</style>
