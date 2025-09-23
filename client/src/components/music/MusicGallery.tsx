import React, { useEffect, useState } from 'react';
import { fetchMusicWithCovers } from '../../../../src/fetchMusicWithCovers';

export default function MusicGallery() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMusicWithCovers().then((data) => {
      setTracks(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-center py-8">Učitavanje...</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {tracks.map((track, idx) => (
        <div key={idx} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <img
            src={track.cover}
            alt={track.name}
            className="w-full h-48 object-cover rounded mb-4"
            loading="lazy"
          />
          <audio controls className="w-full">
            <source src={track.audio} type="audio/mpeg" />
            Vaš browser ne podržava audio element.
          </audio>
          <div className="mt-2 text-sm text-gray-700 text-center break-all">{track.name}</div>
        </div>
      ))}
    </div>
  );
}
