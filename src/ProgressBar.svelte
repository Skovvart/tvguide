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
    background-image: linear-gradient(-45deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.25));
  }
  .bar {
    background-color: #4b7599;
    background-image: linear-gradient(-45deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.25));
    transition: width ease-in-out 0.5s;
    height: 10px;
  }
</style>
