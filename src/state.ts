import type { Writable } from "svelte/store";
import type { Channel, ChannelProgram, Show } from "./api";
import { get, writable, readable, derived } from "svelte/store";
import dayjs from "dayjs";
import { getUserChannels, saveUserChannels, getCachedChannels, getCachedPrograms, cacheChannels, cachePrograms } from "./persistence";

export const channels: Writable<Channel[]> = writable(getCachedChannels() ?? []);
export const programs: Writable<ChannelProgram[]> = writable(getCachedPrograms() ?? []);
channels.subscribe(cacheChannels)
programs.subscribe(cachePrograms)

export const filterCategories = writable([]);


// Update loop based on "JavaScript counters the hard way - HTTP 203" https://youtu.be/MCi6AZMkxcU?t=1219
// Accurate over time (not important here, but sure), update visually steadily (not important here, but sure), avoids running in background (yes, important), otherwise good CPU usage (sure, nice, was not too worried with previous implementation though)
const now = readable(new Date(), set => {
	const start = document.timeline.currentTime;
	let interval;
	const frame = time => {
		const elapsed = time - start;
		const seconds = Math.round(elapsed / 1000);
		set(new Date()); // call set function instead of update UI, update every 5 seconds instead of every one
		const targetNext = (seconds + 5) * 1000 + start;
		interval = setTimeout(
			() => requestAnimationFrame(frame),
			targetNext - performance.now()
		);
	};
	frame(start);
	return () => {
		clearInterval(interval);
	};
});

export const nowSeconds = derived(now, $now => +$now / 1000);

export const currentTvDate = derived(now, $now => dayjs($now).subtract(6, "hour").format("YYYY-MM-DD")); // a tvtid "day" goes into next calendar day to around 6 in the morning

const defaultChannels = ["1", "2", "3", "8", "7"];
export const userChannels = writable(getUserChannels() ?? defaultChannels)
userChannels.subscribe(saveUserChannels)

// We want to cache promises by channelId + showId, that can be shared for identical descriptions, but only show descriptions by explicit reference (so the shared descriptions don't open up at the same time when one is clicked)
export const descriptionPromises = writable({});
export const shownDescription: Writable<{ channel: Channel, show: Show } | null> = writable(null);

// Try to filter out broken userChannel references, for when source data removes them (for whatever reason...)
const userChannelsSnapShot = get(userChannels);
channels.subscribe(updatedChannelsValue => {
	if (updatedChannelsValue.length) {
		const channelsIds = updatedChannelsValue.map(c => c.id);
		const invalidChannels = userChannelsSnapShot.filter(uc => channelsIds.indexOf(uc) == -1);
		if (invalidChannels.length) {
			userChannels.update(currentUserChannels => currentUserChannels.filter(cuc => invalidChannels.indexOf(cuc) == -1));
		}
	}
});