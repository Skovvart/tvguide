import type { Channel, ChannelProgram } from "./api";

const dbGet = <T>(key: string): T => JSON.parse(localStorage.getItem(key))
const dbSet = <T>(key: string, value: T) => localStorage.setItem(key, JSON.stringify(value));

export const getUserChannels = () => <string[]>dbGet("userChannels");
export const saveUserChannels = (userChannels: string[]) => dbSet("userChannels", userChannels);

export const getCachedChannels = (): Channel[] => dbGet("channels");
export const cacheChannels = (channels: Channel[]) => dbSet("channels", channels);

export const getCachedPrograms = (): ChannelProgram[] => dbGet("programs");
export const cachePrograms = (channels: ChannelProgram[]) => dbSet("programs", channels);