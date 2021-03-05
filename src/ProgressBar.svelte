<script lang="ts">
  export let percentage: number;
  export let title: string;
</script>

<div class="wrapper" {title}>
  <div class="bar" style="width: {percentage * 100}%" />
</div>

<style>
  .wrapper {
    width: 100%;
    background-image: var(--gradient-dark);
  }
  .bar {
    background-color: var(--color-primary);
    background-image: var(--gradient-dark);
    transition: width ease-in-out 0.5s;
    height: 10px;
  }
</style>
