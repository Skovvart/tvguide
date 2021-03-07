<script lang="ts">
  import dayjs from "dayjs";
  import type { Channel, Show, ShowDescription } from "./api";
  import { formatTimestamp, distinct } from "./utils";
  import { getCategory } from "./categories";
  import { nowSeconds, channels } from "./state";
  import Category from "./Category.svelte";

  export let channel: Channel;
  export let show: Show;
  export let description: ShowDescription;

  $: distinctCategories = description?.categories && distinct(description.categories.map(getCategory).filter(c => c !== "Alle"));
  $: alternativeShowings = description?.locations.schedules.filter(showing => (showing.channelId !== channel.id || showing.start !== show.start) && showing.stop >= $nowSeconds);

  const channelName = (channelId: string) => $channels.find(c => c.id === channelId)?.title;
</script>

{#if description.teaser}
  <p class="teaser">{description.teaser}</p>
{/if}

<p>{description.desc || "(ingen beskrivelse)"}</p>
{#if alternativeShowings?.length}
  <p>Vises også på</p>
  <ul>
    {#each alternativeShowings as showing}
      <li>{channelName(showing.channelId)} {dayjs.unix(showing.start).format("DD/MM HH:mm")} - {formatTimestamp(showing.stop)}</li>
    {/each}
  </ul>
{/if}
{#if description.prodYear}
  <p class="prodyear">Produceret {description.prodYear}</p>
{/if}
{#if distinctCategories?.length}
  <div class="categories">
    {#each distinctCategories as category}
      <Category {category} />
    {/each}
  </div>
{/if}

<style>
  .categories {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 0.5em;
  }
  ul {
    margin-block: unset;
  }
  li {
    color: var(--color-text);
  }
  p {
    padding: 0.5em 1em;
    margin-block: unset;
    color: var(--color-text);
  }
  .teaser,
  .prodyear {
    font-style: italic;
  }
</style>
