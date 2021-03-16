<script lang="ts">
  import { userChannels, channels } from "./state";
  import Typeahead from "svelte-typeahead";
  $: availableChannels = $channels.filter(c => $userChannels.indexOf(c.id) === -1);

  const extract = c => c.title;
  const addUserChannel = channel => ($userChannels = [...$userChannels, channel.id]);
</script>

{#if availableChannels.length}
  <Typeahead data={availableChannels} {extract} inputAfterSelect="clear" limit={20} on:select={c => addUserChannel(c.detail.original)} label="Tilføj kanal" hideLabel={true} id="add-channel" placeholder="Tilføj kanal" />
{/if}

<style>
  :global([data-svelte-typeahead]) {
    z-index: 1;
    border-radius: 5px;
  }
  :global([data-svelte-search] input[name]) {
    border-radius: 5px;
  }
  :global([data-svelte-search] input[name]:focus) {
    outline-color: var(--color-primary);
    outline-offset: 0;
  }
  :global([data-svelte-typeahead] ul) {
    margin-block: unset;
  }
</style>
