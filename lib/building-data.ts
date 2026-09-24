import type { Building } from './types'

/**
 * The single source of truth for everything the app renders.
 *
 * This is a pure frontend project — there is no backend. To adapt the map to a
 * real building, edit this file only; you should not need to touch any
 * components:
 *   - `mapImage`: point at your floor-plan image (in /public) or an absolute URL.
 *   - each location's `coordinates`: x/y as percentages (0–100) of the map image.
 *   - `description`: shown in the sidebar detail view.
 *   - `videoUrl` (optional): drop files in /public/videos and reference them here.
 *   - `panoramaUrl` (optional): equirectangular 360° image (2:1 ratio).
 *   - `thumbnail` (optional): small preview image for the detail view.
 *
 * PLUG-AND-PLAY 360° PANORAMAS:
 * Each `panoramaUrl` below points at a local file in `/public/panoramas/`,
 * named after the location id (e.g. `/panoramas/lobby.jpg`). Those files are
 * currently equirectangular stand-ins. To use your own 360° photo, just drop
 * your image into `public/panoramas/` and overwrite the matching file — keep
 * the same filename and you don't have to touch any code. (You can also point
 * `panoramaUrl` at any other /public path or an absolute URL if you prefer.)
 *
 * The video/thumbnail URLs are public stand-ins — swap them for your own assets.
 */
export const building: Building = {
  id: 'innovation-hall',
  name: 'Innovation Hall',
  address: '742 Maker Avenue - Floor 1',
  mapImage: '/maps/building-floorplan.png',
  locations: [
    {
      id: 'main-entrance',
      name: 'Main Entrance',
      category: 'entrance',
      description:
        'The primary street-level entrance. Accessible ramp on the east side and a covered drop-off zone directly out front.',
      coordinates: { x: 50, y: 91 },
      panoramaUrl: '/panoramas/main-entrance.jpg',
    },
    {
      id: 'lobby',
      name: 'Main Lobby',
      category: 'room',
      description:
        'Double-height reception area with the welcome desk, visitor check-in kiosks, and seating. Start any tour here.',
      coordinates: { x: 50, y: 66 },
      thumbnail: '/thumbnails/lobby.png',
      panoramaUrl: '/panoramas/lobby.jpg',
      videoUrl:
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    },
    {
      id: 'auditorium',
      name: 'Grand Auditorium',
      category: 'room',
      description:
        '220-seat auditorium used for keynotes and all-hands. Equipped with a full AV rig and a live-stream booth.',
      coordinates: { x: 24, y: 44 },
      videoUrl:
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    },
    {
      id: 'cafe',
      name: 'Corner Cafe',
      category: 'amenity',
      description:
        'Coffee bar and grab-and-go counter. Open 7am-4pm on weekdays. Seating spills into the adjacent courtyard.',
      coordinates: { x: 73, y: 39 },
      panoramaUrl: '/panoramas/cafe.jpg',
    },
    {
      id: 'innovation-lab',
      name: 'Innovation Lab',
      category: 'facility',
      description:
        'Hardware prototyping lab with 3D printers, a laser cutter, and electronics benches. Badge access required.',
      coordinates: { x: 39, y: 24 },
      panoramaUrl: '/panoramas/innovation-lab.jpg',
      videoUrl:
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    },
    {
      id: 'courtyard',
      name: 'Central Courtyard',
      category: 'outdoor',
      description:
        'Landscaped open-air courtyard at the heart of the building. A quiet spot for breaks and informal meetings.',
      coordinates: { x: 82, y: 71 },
      panoramaUrl: '/panoramas/courtyard.jpg',
    },
  ],
}
