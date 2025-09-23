

import React, { useEffect, useState } from 'react';
import { fetchMusicWithCovers } from '../../../../src/fetchMusicWithCovers';
import TrackItem from './track-item';
import { useMusicPlayer } from '@/contexts/music-player-context';


  audio: string;
  cover: string;
  name: string;
  displayName: string;
};


export default function MusicGallery() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchMusicWithCovers().then((data: Track[]) => {
      // Map fajl nevét displayName-re
      const nameMap: Record<string, string> = {
        'retro-lounge-389644.mp3': 'Retro Lounge',
        'deep-abstract-ambient_snowcap-401656.mp3': 'Deep Abstract Ambient',
        'running-night-393139 2.mp3': 'Running Night',
        'vlog-beat-background-349853.mp3': 'Vlog Beat',
      };
      setTracks(
        data.map((t) => ({ ...t, displayName: nameMap[t.name] || t.name }))
      );
      setLoading(false);
    });
  }, []);


  if (loading) return <div className="text-center py-8">Učitavanje...</div>;

  if (!tracks || tracks.length === 0) {
    return <div className="text-center py-8 text-gray-500">Nema dostupnih pesama.</div>;
  }

  const { playSong, state } = useMusicPlayer();

  // Méret: 3 teljes cover, 4. részben látszik
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

  return (
    <div className="flex flex-row space-x-4 overflow-x-scroll snap-x snap-mandatory py-4 px-2 bg-black">
      {tracks.map((track, idx) => (
        <div
          key={idx}
          className="flex flex-col items-center flex-shrink-0 snap-start cursor-pointer"
          style={{ width: 'calc(100vw / 3.2)', maxWidth: '16rem', minWidth: '8rem' }}
          onClick={() => playSong(toSongWithDetails(track, idx))}
        >
          <TrackItem
            song={toSongWithDetails(track, idx)}
            showEqualizer={true}
          />
        </div>
      ))}
    </div>
  );
}
