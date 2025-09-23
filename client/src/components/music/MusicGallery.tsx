
import React, { useEffect, useState } from 'react';
// Helyes elérési út és típusdefiníciók
import { fetchMusicWithCovers } from '../../../../src/fetchMusicWithCovers';


type Track = {
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

  // Méret: 3 teljes cover, 4. részben látszik
  // Pl. w-[calc(100vw/3.2)] vagy fix: w-64 (16rem)
  // Mobilon: w-2/3, md: w-1/4

  const coverWidth = "w-[calc(100vw/3.2)] max-w-xs min-w-[8rem] aspect-square";

  const handlePlay = (audio: string) => {
    const audioEl = new Audio(audio);
    audioEl.play();
  };

  return (
    <div className="flex flex-row space-x-4 overflow-x-scroll snap-x snap-mandatory py-4 px-2 bg-black">
      {tracks.map((track, idx) => (
        <div
          key={idx}
          className="flex flex-col items-center flex-shrink-0 snap-start cursor-pointer"
          style={{ width: 'calc(100vw / 3.2)', maxWidth: '16rem', minWidth: '8rem' }}
          onClick={() => handlePlay(track.audio)}
        >
          <img
            src={track.cover}
            alt={track.displayName}
            className={`rounded object-cover aspect-square ${coverWidth}`}
            loading="lazy"
          />
          <div className="mt-2 text-base text-white text-center font-medium truncate w-full">
            {track.displayName}
          </div>
        </div>
      ))}
    </div>
  );
}
