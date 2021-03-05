<script lang="ts">
  import type { Channel, Show } from "./api";
  import { programs, userChannels } from "./state";
  import ShowElement from "./ShowElement.svelte";

  export let channel: Channel;
  export let includeShow: (show: Show) => boolean;
  $: program = $programs.find(p => p.id === channel.id)?.programs;
  $: shows = program?.filter(s => includeShow(s));
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
  <div class="shows">
    {#if shows?.length}
      {#each shows as show (show.id + show.start)}
        <ShowElement {channel} {show} lastShow={show === lastShow} />
      {/each}
    {:else}
      <span>(Ingen programmer at vise)</span>
    {/if}
  </div>
</div>

<style>
  .channel {
    background-color: var(--color-background);
  }
  span {
    color: #777;
    padding: 0 1em;
    overflow-y: hidden;
  }
  .header {
    width: 100%;
    display: flex;
    align-items: center;
    user-select: none;
  }
  .actions {
    flex-grow: 1;
    display: flex;
    justify-content: flex-end;
    gap: 0.5em;
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
  }
</style>
