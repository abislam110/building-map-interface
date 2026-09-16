import type { Building } from './types'

/**
 * ---------------------------------------------------------------------------
 * STAND-IN ASSETS — replace these with your own when ready.
 * ---------------------------------------------------------------------------
 * - `mapImage`   : generated placeholder floor plan at /public/maps.
 *                  Swap for your real map export (PNG/SVG/WEBP). Pin
 *                  coordinates are percentages, so any aspect ratio works.
 * - `PANORAMA_*` : public sample equirectangular photos. Replace with your
 *                  own 360° images (drop them in /public/panoramas).
 * - `VIDEO_*`    : public sample MP4s. Replace with your own walkthrough
 *                  clips (drop them in /public/videos).
 *
 * Coordinates are { x, y } percentages measured from the TOP-LEFT of the map
 * image (0–100). The pin's pointer tip sits exactly on that point.
 */

const PANORAMA_STANDIN =
  'https://photo-sphere-viewer-data.netlify.app/assets/sphere.jpg'

const VIDEO_STANDIN_A =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
const VIDEO_STANDIN_B =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'

export const building: Building = {
  id: 'innovation-hall',
  name: 'Innovation Hall',
  address: '742 Maker Avenue · Floor 1',
  mapImage: '/maps/building-floorplan.png',
  locations: [
    {
      id: 'main-entrance',
      name: 'Main Entrance',
      category: 'entrance',
      description:
        'The primary street-level entrance. Accessible ramp on the east side and a covered drop-off zone directly out front.',
      coordinates: { x: 50, y: 91 },
      panoramaUrl: PANORAMA_STANDIN,
    },
    {
      id: 'lobby',
      name: 'Main Lobby',
      category: 'room',
      description:
        'Double-height reception area with the welcome desk, visitor check-in kiosks, and seating. Start any tour here.',
      coordinates: { x: 50, y: 66 },
      thumbnail: '/thumbnails/lobby.png',
      panoramaUrl: PANORAMA_STANDIN,
      videoUrl: VIDEO_STANDIN_A,
    },
    {
      id: 'auditorium',
      name: 'Grand Auditorium',
      category: 'room',
      description:
        '220-seat auditorium used for keynotes and all-hands. Equipped with a full AV rig and a live-stream booth.',
      coordinates: { x: 24, y: 44 },
      videoUrl: VIDEO_STANDIN_B,
    },
    {
      id: 'cafe',
      name: 'Corner Café',
      category: 'amenity',
      description:
        'Coffee bar and grab-and-go counter. Open 7am–4pm on weekdays. Seating spills into the adjacent courtyard.',
      coordinates: { x: 73, y: 39 },
      panoramaUrl: PANORAMA_STANDIN,
    },
    {
      id: 'innovation-lab',
      name: 'Innovation Lab',
      category: 'facility',
      description:
        'Hardware prototyping lab with 3D printers, a laser cutter, and electronics benches. Badge access required.',
      coordinates: { x: 39, y: 24 },
      panoramaUrl: PANORAMA_STANDIN,
      videoUrl: VIDEO_STANDIN_A,
    },
    {
      id: 'courtyard',
      name: 'Central Courtyard',
      category: 'outdoor',
      description:
        'Landscaped open-air courtyard at the heart of the building. A quiet spot for breaks and informal meetings.',
      coordinates: { x: 82, y: 71 },
      panoramaUrl: PANORAMA_STANDIN,
    },
  ],
}
