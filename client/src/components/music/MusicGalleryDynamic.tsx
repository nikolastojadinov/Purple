import dynamic from 'next/dynamic';
export const MusicGallery = dynamic(() => import('../../../src/MusicGallery.jsx'), { ssr: false });
