<script lang="ts">
  import dayjs from "dayjs";

  import { formatTimestamp, distinct } from "./utils";
  import type { Channel, Show, ShowDescription } from "./api";
  import { getShowDescription } from "./api";
  import { nowSeconds, channels } from "./state";
  import ProgressBar from "./ProgressBar.svelte";
  import Category from "./Category.svelte";
  import { getCategory } from "./categories";

  export let channel: Channel;
  export let show: Show;
  export let lastShow: boolean;

  let description: null | ShowDescription = null;
  $: distinctCategories = description?.categories && distinct(description.categories.map(getCategory).filter(c => c !== "Alle"));
  $: alternativeShowings = description?.locations.schedules.filter(showing => (showing.channelId !== channel.id || showing.start !== show.start) && showing.stop >= $nowSeconds);

  const channelName = (channelId: string) => $channels.find(c => c.id === channelId)?.title;

  const timeLeft = (secondsLeft: number) => dayjs.duration(secondsLeft, "seconds").humanize() + " tilbage";

  let descriptionRequested = false;
  let showDescription = false;
  const toggleDescription = async () => {
    if (!descriptionRequested) {
      descriptionRequested = true;
      description = await getShowDescription(channel.id, show.id);
    }
    showDescription = !showDescription;
  };
</script>

<div class="show" class:show-over={show.stop <= $nowSeconds}>
  <p
    class={"show " +
      show.categories
        ?.map(getCategory)
        .filter(c => c !== "Alle")
        .find(_ => true)}
    on:click={toggleDescription}
  >
    {formatTimestamp(show.start)}
    {show.title}
    {#if show.premiere}
      [PREMIERE]
    {/if}
    {#if lastShow}
      <br />
      {formatTimestamp(show.stop)}
    {/if}
  </p>
  {#if $nowSeconds >= show.start && $nowSeconds < show.stop}
    <ProgressBar percentage={($nowSeconds - show.start) / (show.stop - show.start)} title={timeLeft(show.stop - $nowSeconds)} />
  {/if}
  {#if description !== null && showDescription}
    {#if description.teaser || description.series?.episode}
      <p>
        {#if description.teaser}
          <em>{description.teaser}</em>
        {/if}
        {#if description.teaser && description.series?.episode}
          -
        {/if}
        {#if description.series?.episode}
          {#if description.series.season}
            Sæson {description.series.season} episode {description.series.episode}
          {:else}
            Episode {description.series.episode}
          {/if}
        {/if}
      </p>
    {/if}

    <p>{description.desc || "(ingen beskrivelse)"}</p>
    {#if alternativeShowings?.length}
      <p>Vises også på</p>
      <ul>
        {#each alternativeShowings as showing}
          <li>{channelName(showing.channelId)} {dayjs.unix(showing.start).from(dayjs.unix($nowSeconds))} ({formatTimestamp(showing.start)})</li>
        {/each}
      </ul>
    {/if}
    {#if description.prodYear}
      <p>Produceret i {description.prodYear}</p>
    {/if}
    {#if distinctCategories?.length}
      <div class="categories">
        {#each distinctCategories as category}
          <Category {category} />
        {/each}
      </div>
    {/if}
  {/if}
</div>

<style>
  .categories {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 0.5em;
  }
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
  ul {
    margin-block: unset;
  }
  li {
    color: var(--color-text);
  }
  .Alle,
  .undefined {
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
