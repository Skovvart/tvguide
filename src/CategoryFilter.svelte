<script lang="ts">
  import { filterCategories } from "./state";
  import Category from "./Category.svelte";
  import { categories } from "./categories";

  let selectedFilter = "Alle";

  const selectFilter = (filter: string) => {
    selectedFilter = filter;
    $filterCategories = categories[selectedFilter];
  };
</script>

<div class="categories">
  {#each Object.keys(categories) as filter}
    <Category selected={selectedFilter === filter} click={() => selectFilter(filter)} category={filter} />
  {/each}
</div>

<style>
  .categories {
    margin: 0.5em 0;
    display: flex;
    gap: 0.5em;
    flex-wrap: wrap;
  }
</style>
