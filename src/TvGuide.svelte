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
  <div class="header">
    <a href="https://www.skovvart.dk" class="header__logo" aria-label="skovvart.dk" title="skovvart.dk">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path
          d="M510.432 249.597L388.297 38.537c-2.096-3.631-5.967-5.378-10.159-5.378H133.861c-4.192 0-8.063 1.747-10.159 5.378L1.567 249.841c-2.09 3.631-2.09 7.976 0 11.607l122.135 211.535c2.096 3.632 5.967 5.858 10.159 5.858h244.276c4.192 0 8.063-2.288 10.159-5.919l122.135-211.569c2.092-3.631 2.092-8.125.001-11.756zM371.369 455.384H140.63L25.27 256.003 140.63 56.616h230.738l115.36 199.387-115.359 199.381z"
        />
      </svg>
    </a>
    <ChannelPicker />
    <CategoryFilter />
  </div>
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

  :global(body) {
    color: #333;
    margin: 0;
    padding: 1em;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    background-color: var(--color-primary);
    background-image: var(--gradient-dark);
  }

  :global(html) {
    height: auto;
    overflow-y: scroll;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* Internet Explorer 10+ */
  }

  :global(html::-webkit-scrollbar) {
    /* WebKit */
    width: 0;
    height: 0;
  }

  .header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0 3em;
  }

  .header__logo {
    flex-grow: 0;
  }
  .header__logo:focus-within svg,
  .header__logo:hover svg {
    transform: rotate(180deg);
  }
  .header__logo svg {
    margin-right: 1em;
    height: 50px;
    width: 50px;
    fill: #f7fbfc;

    transition: transform 0.3s ease-in-out;
  }

  :global(.header > *) {
    flex-grow: 1;
  }

  .channels {
    display: grid;

    grid-template-columns: repeat(auto-fit, minmax(18em, 1fr));
    gap: 2em;
  }
</style>
