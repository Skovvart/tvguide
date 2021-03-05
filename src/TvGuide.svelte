<script lang="ts">
  import type { Show } from "./api";
  import { getChannels, getProgramsForChannelsAndDate } from "./api";
  import { intersect } from "./utils";
  import ChannelElement from "./ChannelElement.svelte";
  import ChannelPicker from "./ChannelPicker.svelte";
  import CategoryFilter from "./CategoryFilter.svelte";
  import { channels, userChannels, programs, nowSeconds, currentTvDate, filterCategories } from "./state";

  const getData = async programDate => {
    const channelsPromise = getChannels();
    $channels = $channels ?? (await channelsPromise);
    const channelIds = ($channels.length ? $channels : await channelsPromise).map(c => c.id);
    const programsPromise = getProgramsForChannelsAndDate(channelIds, programDate);
    $programs = $programs ?? (await programsPromise);

    // Not awaiting as that would block the "getData" promise in layout
    channelsPromise.then(cs => ($channels = cs));
    programsPromise.then(ps => ($programs = ps));
  };

  $: dataPromise = getData($currentTvDate);

  const includeShow = (recentProgramsTimeSecondsBuffer: number, filterCategories: string[], nowSeconds: number) => (show: Show) => {
    if (filterCategories.length && !intersect(filterCategories, show.categories).length) return false;
    return show.stop + recentProgramsTimeSecondsBuffer >= nowSeconds;
  };

  $: includeShowWithBuffer = includeShow(60 * 60, $filterCategories, $nowSeconds); // also include shows that ended within the last hour
  $: orderedChannels =
    $userChannels.length && $channels.length
      ? $userChannels.map(uc => $channels.find(c => c.id === uc)) // not the most efficient, I suppose...
      : $channels;

  /*
Feature-map:
* Improve design

* ~Date-picker?
* ~Proxy description images? will require a backend...
*/
</script>

{#await dataPromise}
  <p>Indlæser TV guide...</p>
{:then _}
  <ChannelPicker />
  <CategoryFilter />
  <div class="channels">
    {#each orderedChannels as channel (channel.id)}
      <ChannelElement {channel} includeShow={includeShowWithBuffer} />
    {/each}
  </div>
{/await}

<style>
  :global(:root) {
    --color-primary: #4b7599;
    --color-secondary: #2c4459;
    --color-text: #252525;
    --color-background: #f7fbfc;
    --color-text-inverted: #f7fbfc;
    --color-background-inverted: #252525;
    --color-link: #4b7599;
    --gradient-light: linear-gradient(-45deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.25));
    --gradient-dark: linear-gradient(-45deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.25));
  }
  @media (prefers-color-scheme: dark) {
    :global(:root) {
      --color-text: #f7fbfc;
      --color-background: #252525;
      --color-text-inverted: #252525;
      --color-background-inverted: #f7fbfc;
      --color-link: #6aa5d9;
    }
  }
  :global(html, body) {
    position: relative;
  }
  :global(body) {
    color: #333;
    margin: 0;
    padding: 1em;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    background-color: var(--color-primary);
    background-image: var(--gradient-dark);
  }

  .channels {
    display: grid;

    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 2em;
  }
</style>
