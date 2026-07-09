import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Brain Library — Bilingual Knowledge Management',
    short_name: 'Brain Library',
    description: 'High-end personal knowledge management and note-taking web app with offline-first cloud synchronization and native Urdu RTL support.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0D14',
    theme_color: '#0A0D14',
    orientation: 'any',
    icons: [
      {
        src: '/icon-192.svg',
        sizes: '192x192',
        type: 'image/svg+xml'
      },
      {
        src: '/icon-512.svg',
        sizes: '512x512',
        type: 'image/svg+xml'
      }
    ]
  };
}
