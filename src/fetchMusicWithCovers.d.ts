// TypeScript típusdefiníció a fetchMusicWithCovers JS modulhoz
export type MusicWithCover = {
  audio: string;
  cover: string;
  name: string;
};

declare export function fetchMusicWithCovers(): Promise<MusicWithCover[]>;