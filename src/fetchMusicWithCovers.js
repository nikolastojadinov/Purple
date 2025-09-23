import { supabase } from './supabaseClient';

// Lista pesama i covera
const musicFiles = [
  {
    audio: 'retro-lounge-389644.mp3',
    cover: 'F6897AAD-9902-4F0C-95EA-FD213A783D92.png',
  },
  {
    audio: 'deep-abstract-ambient_snowcap-401656.mp3',
    cover: '621B279E-CA15-482E-849A-60D0774A9DD5.png',
  },
  {
    audio: 'running-night-393139 2.mp3',
    cover: '76DD6929-0A2A-4D7C-8E09-86124174600A.png',
  },
  {
    audio: 'vlog-beat-background-349853.mp3',
    cover: 'IMG_0596.png',
  },
];

export async function fetchMusicWithCovers() {
  const results = await Promise.all(
    musicFiles.map(async ({ audio, cover }) => {
      const { data: audioUrl } = supabase.storage.from('Music').getPublicUrl(audio);
      const { data: coverUrl } = supabase.storage.from('Covers').getPublicUrl(cover);
      return {
        audio: audioUrl.publicUrl,
        cover: coverUrl.publicUrl,
        name: audio,
      };
    })
  );
  return results;
}
