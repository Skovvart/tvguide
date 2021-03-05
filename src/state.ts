import type { Writable } from "svelte/store";
import type { Channel, ChannelProgram } from "./api";
import { writable, readable, derived } from "svelte/store";
import dayjs from "dayjs";
import { getUserChannels, saveUserChannels, getCachedChannels, getCachedPrograms, cacheChannels, cachePrograms } from "./persistence";

export const channels: Writable<Channel[]> = writable(getCachedChannels() ?? []);
export const programs: Writable<ChannelProgram[]> = writable(getCachedPrograms() ?? []);
channels.subscribe(cacheChannels)
programs.subscribe(cachePrograms)

export const filterCategories = writable([]);

const now = readable(new Date(), set => {
	const interval = setInterval(() => {
		set(new Date());
	}, 5 * 1000);
	return () => {
		clearInterval(interval);
	};
});

export const nowSeconds = derived(now, $now => +$now / 1000);

export const currentTvDate = derived(now, $now => dayjs($now).subtract(6, "hour").format("YYYY-MM-DD")); // a tvtid "day" goes into next calendar day to around 6 in the morning

const defaultChannels = ["1", "2", "3", "8", "7"]
export const userChannels = writable(getUserChannels() ?? defaultChannels)
userChannels.subscribe(saveUserChannels)

