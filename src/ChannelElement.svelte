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

<div>
  <img src={channel.svgLogo || channel.logo} alt={channel.title} title={channel.title} width="100" height="46" />
  <button on:click={shiftLeft} disabled={firstUserChannel}>&lt;</button>
  <button on:click={shiftRight} disabled={lastUserChannel}>&gt;</button>
  <button on:click={() => ($userChannels = $userChannels.filter(c => c !== channel.id))}>X</button>
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
  span {
    color: #777;
  }
  .shows {
    max-height: 80vh;
    overflow-y: auto;
  }
</style>
