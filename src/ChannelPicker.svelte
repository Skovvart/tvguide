<script lang="ts">
  import { userChannels, channels } from "./state";
  import Typeahead from "svelte-typeahead";
  $: availableChannels = $channels.filter(c => $userChannels.indexOf(c.id) === -1);

  const extract = c => c.title;
  const addUserChannel = channel => ($userChannels = [...$userChannels, channel.id]);
</script>

{#if availableChannels.length}
  <Typeahead data={availableChannels} {extract} inputAfterSelect="clear" limit={20} on:select={c => addUserChannel(c.detail.original)} hideLabel={true} placeholder="Tilføj kanal" />
{/if}
