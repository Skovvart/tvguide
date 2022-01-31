<script lang="ts">
  import type { Channel, Show } from "./api";
  import { programs, userChannels, filterCategories, nowSeconds } from "./state";
  import { intersect } from "./utils";
  import ShowElement from "./ShowElement.svelte";

  export let channel: Channel;

  const includeShow = (recentProgramsTimeSecondsBuffer: number, filterCategories: string[], nowSeconds: number) => (show: Show) => {
    if (filterCategories.length && !intersect(filterCategories, show.categories).length) return false;
    return show.stop + recentProgramsTimeSecondsBuffer >= nowSeconds;
  };

  $: includeShowWithBuffer = includeShow(60 * 60, $filterCategories, $nowSeconds); // also include shows that ended within the last hour

  $: program = $programs.find(p => p.id === channel.id)?.programs;
  $: shows = program?.filter(s => includeShowWithBuffer(s));
  $: lastShow = shows?.[shows.length - 1];
  $: currentPosition = $userChannels.indexOf(channel.id);
  $: firstUserChannel = currentPosition === 0;
  $: lastUserChannel = currentPosition === $userChannels.length - 1;

  const shiftLeft = () => {
    const currentElement = $userChannels[currentPosition - 1];
    $userChannels[currentPosition - 1] = channel.id;
    $userChannels[currentPosition] = currentElement;
  };
  const shiftRight = () => {
    const currentElement = $userChannels[currentPosition + 1];
    $userChannels[currentPosition + 1] = channel.id;
    $userChannels[currentPosition] = currentElement;
  };
</script>

<div class="channel">
  <div class="header">
    <img src={channel.svgLogo || channel.logo} alt={channel.title} title={channel.title} width="100" height="46" />
    <div class="actions">
      <button on:click={shiftLeft} disabled={firstUserChannel} title="Flyt til venstre" aria-label="Flyt til venstre">&lt;</button>
      <button on:click={shiftRight} disabled={lastUserChannel} title="Flyt til højre" aria-label="Flyt til højre">&gt;</button>
      <button on:click={() => ($userChannels = $userChannels.filter(c => c !== channel.id))} title="Fjern kanal" aria-label="Fjern kanal">X</button>
    </div>
  </div>
  <div class="shows" tabindex="0">
    {#if shows?.length}
      {#each shows as show (show.id + show.start)}
        <div>
          <ShowElement {channel} {show} lastShow={show === lastShow} />
        </div>
      {/each}
    {:else}
      <p>(Ingen programmer at vise)</p>
    {/if}
  </div>
</div>

<style>
  .channel {
    background-color: var(--color-background);
  }
  p {
    color: #777;
    padding: 0.5em 1em;
    margin-block: unset;
  }
  .header {
    display: flex;
    align-items: center;
    user-select: none;
  }
  .actions {
    flex-grow: 1;
    display: flex;
    justify-content: flex-end;
    gap: 0.5em;
    padding: 0.5em;
  }
  button {
    color: #fff;
    font-weight: 700;
    display: inline-block;
    background-color: var(--color-secondary);
    border: 1px solid #ccc;
    user-select: none;

    padding: 6px 12px;
    font-size: 14px;

    text-align: center;
    vertical-align: middle;

    border-radius: 5px;
    background-image: linear-gradient(-45deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.25));
    cursor: pointer;
  }
  button:disabled {
    background-color: var(--color-background-inverted);
    cursor: default;
  }
  .shows {
    max-height: 80vh;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #888 #f1f1f1;
  }
  .shows::-webkit-scrollbar {
    width: 0.5em;
  }
  .shows::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  .shows::-webkit-scrollbar-thumb {
    background: #888;
  }
  .shows::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
</style>
