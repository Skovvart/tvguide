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
  .channels {
    display: grid;

    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 2em;
  }
</style>
