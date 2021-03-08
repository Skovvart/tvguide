<script lang="ts">
  import type { Channel, Show, ShowDescription } from "./api";
  import dayjs from "dayjs";
  import { getShowDescription } from "./api";
  import { getCategory } from "./categories";
  import { nowSeconds, filterCategories } from "./state";
  import { formatTimestamp, promiseMinimumExecutionTime } from "./utils";
  import ProgressBar from "./ProgressBar.svelte";
  import ShowDescriptionElement from "./ShowDescriptionElement.svelte";
  import Spinner from "./Spinner.svelte";

  export let channel: Channel;
  export let show: Show;
  export let lastShow: boolean;

  let showDescription = false;
  let descriptionPromise: null | Promise<ShowDescription> = null;

  const toggleDescription = async () => {
    showDescription = !showDescription;
    descriptionPromise ??= promiseMinimumExecutionTime(150, getShowDescription(channel.id, show.id));
  };

  $: showEndTime = lastShow || showDescription || $filterCategories.length;
  $: inProgress = $nowSeconds >= show.start && $nowSeconds < show.stop;
  $: showPercentage = inProgress && ($nowSeconds - show.start) / (show.stop - show.start);
  $: showTimeLeft = inProgress && dayjs.duration(show.stop - $nowSeconds, "seconds").humanize() + " tilbage";
</script>

<div class="show" class:show-over={show.stop <= $nowSeconds}>
  <p class={"show " + (show.categories?.map(getCategory).find(_ => true) || "Alle")} on:click={toggleDescription}>
    {formatTimestamp(show.start)}
    {show.title}
    {#if show.premiere}
      [PREMIERE]
    {/if}
    {#if showEndTime}
      <br />
      {formatTimestamp(show.stop)}
    {/if}
  </p>
  {#if inProgress}
    <ProgressBar percentage={showPercentage} title={showTimeLeft} />
  {/if}
  {#if showDescription}
    {#await descriptionPromise}
      <Spinner />
    {:then description}
      <ShowDescriptionElement {channel} {show} {description} />
    {/await}
  {/if}
</div>

<style>
  .show-over {
    opacity: 0.5;
  }
  div.show {
    border: 1px solid #eee;
  }
  p.show {
    background-image: var(--gradient-dark);
    cursor: pointer;
    user-select: none;
  }
  p {
    padding: 0.5em 1em;
    margin-block: unset;
    color: var(--color-text);
  }

  .Alle {
    color: #000;
    background-color: #fcfcfc;
    border-color: #dfdfdf;
  }
  .Serie {
    color: #fff;
    background-color: #5cb85c;
    border-color: #4cae4c;
  }
  .Film {
    color: #fff;
    background-color: #5bc0de;
    border-color: #46b8da;
  }
  .Sport {
    color: #fff;
    background-color: #d9534f;
    border-color: #d43f3a;
  }
  .Dokumentar {
    color: #fff;
    background-color: #f0ad4e;
    border-color: #eea236;
  }
  .Nyheder {
    color: #fff;
    background-color: #0073a0;
    border-color: #005558;
  }
  .Kultur {
    color: #fff;
    background-color: #7300a0;
    border-color: #3f0058;
  }
  .Drama {
    color: #fff;
    background-color: #a00063;
    border-color: #580033;
  }
</style>
