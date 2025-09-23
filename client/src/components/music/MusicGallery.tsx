import React, { useEffect, useState } from 'react';
import { fetchMusicWithCovers, MusicWithCover } from '../../../../src/fetchMusicWithCovers';
import TrackItem from './track-item';
import { useMusicPlayer } from '@/contexts/music-player-context';

type Track = {
  name: string;
  displayName: string;
  audio: string;
  cover: string;
};
const nameMap: Record<string, string> = {
  'retro-lounge-389644.mp3': 'Retro Lounge',
  'deep-abstract-ambient_snowcap-401656.mp3': 'Deep Abstract Ambient',
  'running-night-393139 2.mp3': 'Running Night',
  'vlog-beat-background-349853.mp3': 'Vlog Beat',
};

const coverWidth = "w-[calc(100vw/3.2)] max-w-xs min-w-[8rem] aspect-square";

// Teljes SongWithDetails dummy kitöltés
const toSongWithDetails = (track: Track, idx: number) => ({
  id: idx.toString(),
  title: track.displayName,
  imageUrl: track.cover,
  audioUrl: track.audio,
  artist: {
    id: "demo-artist",
    name: "Unknown Artist",
    imageUrl: null,
    bio: null,
    createdAt: null,
  },
  album: {
    id: "demo-album",
    title: "",
    imageUrl: null,
    createdAt: null,
    artistId: "demo-artist",
    releaseDate: null,
    genre: null,
  },
  isLiked: false,
  createdAt: null,
  artistId: "demo-artist",
  genre: null,
  albumId: "demo-album",
  duration: 0,
  trackNumber: null,
  playCount: null,
  lastPlayed: null,
});

const MusicGallery: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const musicPlayer = useMusicPlayer();

  useEffect(() => {
    fetchMusicWithCovers().then((data: MusicWithCover[]) => {
      setTracks(
        data.map((t: MusicWithCover) => ({
          name: t.name,
          displayName: nameMap[t.name] || t.name,
          audio: t.audio,
          cover: t.cover,
        }))
      );
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-center py-8">Učitavanje...</div>;
  if (!tracks || tracks.length === 0) {
    return <div className="text-center py-8 text-gray-500">Nema dostupnih pesama.</div>;
  }

  return (
    <div className="flex flex-row space-x-4 overflow-x-scroll snap-x snap-mandatory py-4 px-2 bg-black">
      {tracks.map((track, idx) => (
        <div key={track.name} className={coverWidth + " snap-center"}>
          <TrackItem
            song={toSongWithDetails(track, idx)}
            showEqualizer={true}
          />
        </div>
      ))}
    </div>
  );
};

export default MusicGallery;
