const getChannels = async (): Promise<Channel[]> => {
  const channelsResponse = await fetch("https://tvtid-api.api.tv2.dk/api/tvtid/v1/schedules/channels");
  const channels : Channel[] = (await channelsResponse.json()).channels;
  return channels.filter(c => c.id > "2147483647");
};

const getProgramsForChannelsAndDate = async (channelIds: string[], date: string): Promise<ChannelProgram[]> => {
  const channelQueryParams = channelIds.map(id => `ch=${id}`).join("&");
  const programsResponse = await fetch(`https://tvtid-api.api.tv2.dk/api/tvtid/v1/epg/dayviews/${date}?${channelQueryParams}`);
  return await programsResponse.json();
};

const getShowDescription = async (channelId: string, showId: string): Promise<ShowDescription> => {
  const showDescriptionResponse = await fetch(`https://tvtid-api.api.tv2.dk/api/tvtid/v1/schedules/channels/${channelId}/programs/${showId}`);
  return (await showDescriptionResponse.json())?.program;
};

export interface Channel {
  icon: string;
  id: string;
  logo: string;
  sort: number
  svgLogo: string
  title: string
}

export interface ChannelProgram {
  id: string
  programs: Show[]
}

export interface Show {
  availableAsVod: boolean
  categories?: string[]
  id: string
  live: boolean
  premiere: boolean
  rerun: boolean
  start: number
  stop: number
  title: string
}

export interface ShowDescription {
  categories: string[]
  credits?: {
    actor: [{ name: string }]
  }
  desc: string
  id: string
  imgs: {
    images?: {
      height: number
      scaleUrl: string
      url: string
      width: number
    }[]
  }
  locations: {
    schedules: {
      categories: string[]
      channelId: string
      live: boolean
      premiere: boolean
      rerun: boolean
      start: number
      stop: number
      title: string
    }[]
    vods: any[]
  }
  orgTitle: string
  parentalGuidance: { minimumAge: number }
  prodCountry: string
  prodYear: number
  references: {
    authority: string,
    type: string,
    key: string
  }[]
  series?: { episode: number, season: number }
  teaser: string
  title: string
  ttvTexted: boolean
  url: string
}

export { getChannels, getProgramsForChannelsAndDate, getShowDescription };
