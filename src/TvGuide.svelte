<script lang="ts">
  import { getChannels, getProgramsForChannelsAndDate } from "./api";
  import { channels, userChannels, programs, nowSeconds, currentTvDate } from "./state";

  import ChannelElement from "./ChannelElement.svelte";
  import ChannelPicker from "./ChannelPicker.svelte";
  import CategoryFilter from "./CategoryFilter.svelte";
  import Spinner from "./Spinner.svelte";

  let loadingData = true;
  const getData = async (programDate: string) => {
    loadingData = true;
    const channelsPromise = getChannels();
    if (!$channels.length) {
      // If channels are not already cached, wait until we get them before proceeding. If we have them cached, they are most likely good as they rarely change
      $channels = await channelsPromise;
    }
    const channelIds = $channels.map(c => c.id);
    const programsPromise = getProgramsForChannelsAndDate(channelIds, programDate);
    if (!$programs.length || $programs[0].programs[$programs[0].programs.length - 1].stop <= $nowSeconds) {
      // If we have "today's" current program we can present cached values, otherwise wait for fetch
      $programs = await programsPromise;
    }
    // Not awaiting as that would block the "getData" promise in layout even when we have cached data (that may be worth showing)
    channelsPromise.then(cs => ($channels = cs));
    programsPromise.then(ps => {
      // Can potentially miss updated channel-ids in this promise, but that's pretty unlikely and a non-fatal error
      $programs = ps;
      loadingData = false;
    });
  };

  $: dataPromise = getData($currentTvDate);
  $: orderedChannels = $userChannels.map(uc => $channels.find(c => c.id === uc)); // not the most efficient, I suppose...
</script>

<header class="header">
  <a href="https://www.skovvart.dk" class="header__logo" aria-label="skovvart.dk" title="skovvart.dk">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path
        d="M510.432 249.597L388.297 38.537c-2.096-3.631-5.967-5.378-10.159-5.378H133.861c-4.192 0-8.063 1.747-10.159 5.378L1.567 249.841c-2.09 3.631-2.09 7.976 0 11.607l122.135 211.535c2.096 3.632 5.967 5.858 10.159 5.858h244.276c4.192 0 8.063-2.288 10.159-5.919l122.135-211.569c2.092-3.631 2.092-8.125.001-11.756zM371.369 455.384H140.63L25.27 256.003 140.63 56.616h230.738l115.36 199.387-115.359 199.381z"
      />
    </svg>
  </a>
  <ChannelPicker />
  <CategoryFilter />
</header>
{#if loadingData}
  <Spinner />
{/if}
<main class="channels">
  {#await dataPromise}
    <Spinner />
  {:then _}
    {#each orderedChannels as channel (channel.id)}
      <ChannelElement {channel} />
    {/each}
    {#if !$userChannels.length}
      <p>(Ingen kanaler valgt. Tilføj kanaler i søgefeltet ovenover.)</p>
    {/if}
  {/await}
</main>

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
  :global(html) {
    height: auto;
    min-height: 100vh;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #888 #f1f1f1;
  }

  :global(html::-webkit-scrollbar) {
    width: 0.5em;
  }
  :global(html::-webkit-scrollbar-track) {
    background: #f1f1f1;
  }
  :global(html::-webkit-scrollbar-thumb) {
    background: #888;
  }
  :global(html::-webkit-scrollbar-thumb:hover) {
    background: #555;
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
