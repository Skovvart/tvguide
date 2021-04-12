<script lang="ts">
  import type { Channel, Show } from "./api";
  import dayjs from "dayjs";
  import { getShowDescription } from "./api";
  import { getCategory } from "./categories";
  import { nowSeconds, filterCategories, descriptionPromises, shownDescription } from "./state";
  import { formatTimestamp, promiseMinimumExecutionTime } from "./utils";
  import ProgressBar from "./ProgressBar.svelte";
  import ShowDescriptionElement from "./ShowDescriptionElement.svelte";
  import Spinner from "./Spinner.svelte";

  export let channel: Channel;
  export let show: Show;
  export let lastShow: boolean;

  const defaultPromise = new Promise((_, __) => {});

  $: showDescription = $shownDescription?.channel === channel && $shownDescription.show === show;
  $: showEndTime = lastShow || showDescription || $filterCategories.length;
  $: inProgress = $nowSeconds >= show.start && $nowSeconds < show.stop;
  $: showPercentage = inProgress && ($nowSeconds - show.start) / (show.stop - show.start);
  $: showTimeLeft = inProgress && dayjs.duration(show.stop - $nowSeconds, "seconds").humanize() + " tilbage";
  // $: descriptionPromise = $descriptionPromises[channel.id]?.[show.id] || defaultPromise;
  let descriptionPromise = $descriptionPromises[channel.id]?.[show.id] || defaultPromise; // Making this reactive (above line) causes some issue where the promise-update isn't being picked up on for ages unrelated to http or minimum delay. I have no good explanation why but a local variable seems to work like I intended...
  const toggleDescription = async () => {
    $shownDescription = showDescription ? null : { channel: channel, show: show };

    if (!$descriptionPromises[channel.id]) {
      $descriptionPromises[channel.id] = {};
    }
    $descriptionPromises[channel.id][show.id] ??= promiseMinimumExecutionTime(150, getShowDescription(channel.id, show.id));
    descriptionPromise = $descriptionPromises[channel.id][show.id];
  };
</script>

<div class="show" class:show-over={show.stop <= $nowSeconds}>
  <button class={"show " + (show.categories?.map(getCategory).find(_ => true) || "Alle")} on:click={toggleDescription}>
    {formatTimestamp(show.start)}
    {show.title}
    {#if show.premiere}
      [PREMIERE]
    {/if}
    {#if showEndTime}
      <br />
      {formatTimestamp(show.stop)}
    {/if}
  </button>
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
  button {
    appearance: unset;
    -webkit-writing-mode: unset;
    text-rendering: unset;
    letter-spacing: unset;
    word-spacing: unset;
    text-transform: unset;
    text-indent: unset;
    text-shadow: unset;
    text-align: unset;
    align-items: unset;
    background-color: unset;
    box-sizing: unset;
    margin: unset;
    font: unset;
    border-width: unset;
    border-style: unset;
    border-color: unset;
    border-image: unset;

    display: block;
    background-image: var(--gradient-dark);
    cursor: pointer;
    user-select: none;
    padding: 0.5em 1em;

    box-sizing: border-box;
    width: 100%;

    margin-block: unset;
    margin-inline-start: 0px;
    margin-inline-end: 0px;

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
