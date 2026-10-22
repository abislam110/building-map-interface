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
 *   - `tourSceneId` (optional): which 360° tour scene "View 360°" opens.
 *   - `thumbnail` (optional): small preview image for the detail view.
 *
 * 360° TOUR (the `/tour` page):
 * `tour.scenes` is a graph. Each scene is one equirectangular photo in
 * `/public/panoramas/<scene-id>.jpg`; its `links` are the Street View-style
 * arrows that walk you to neighbouring scenes.
 *   - Replace a photo: overwrite the file in public/panoramas, same filename.
 *   - Add a scene: drop `<id>.jpg` in public/panoramas, add an entry below,
 *     and add a link to it from at least one other scene (links are one-way,
 *     so add the return link too).
 *   - Aim an arrow: open the scene, face the doorway, and copy the "Heading"
 *     value shown in the tour's top bar into that link's `yaw`.
 *
 * The scene photos come from the RAS101 fork (img1–img5), resized to
 * 6144×3072 for faster loading. The video/thumbnail URLs are public stand-ins.
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
      tourSceneId: 'lobby',
    },
    {
      id: 'lobby',
      name: 'Main Lobby',
      category: 'room',
      description:
        'Double-height reception area with the welcome desk, visitor check-in kiosks, and seating. Start any tour here.',
      coordinates: { x: 50, y: 66 },
      thumbnail: '/thumbnails/lobby.png',
      tourSceneId: 'lobby',
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
      tourSceneId: 'classroom',
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
      tourSceneId: 'hallway',
    },
    {
      id: 'innovation-lab',
      name: 'Innovation Lab',
      category: 'facility',
      description:
        'Hardware prototyping lab with 3D printers, a laser cutter, and electronics benches. Badge access required.',
      coordinates: { x: 39, y: 24 },
      tourSceneId: 'innovation-lab',
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
      tourSceneId: 'courtyard',
    },
  ],
  tour: {
    startSceneId: 'lobby',
    scenes: [
      {
        id: 'lobby',
        name: 'Main Lobby',
        image: '/panoramas/lobby.jpg',
        coordinates: { x: 50, y: 66 },
        links: [
          { to: 'hallway', yaw: 310 },
          { to: 'courtyard', yaw: 220 },
        ],
      },
      {
        id: 'hallway',
        name: 'Hallway',
        image: '/panoramas/hallway.jpg',
        coordinates: { x: 62, y: 45 },
        links: [
          { to: 'lobby', yaw: 130 },
          { to: 'classroom', yaw: 235 },
        ],
      },
      {
        id: 'classroom',
        name: 'Classroom',
        image: '/panoramas/classroom.jpg',
        coordinates: { x: 24, y: 44 },
        links: [
          { to: 'hallway', yaw: 50 },
          { to: 'innovation-lab', yaw: 235 },
        ],
      },
      {
        id: 'innovation-lab',
        name: 'Innovation Lab',
        image: '/panoramas/innovation-lab.jpg',
        coordinates: { x: 39, y: 24 },
        links: [
          { to: 'classroom', yaw: 330 },
          { to: 'courtyard', yaw: 20 },
        ],
      },
      {
        id: 'courtyard',
        name: 'Central Courtyard',
        image: '/panoramas/courtyard.jpg',
        coordinates: { x: 82, y: 71 },
        links: [
          { to: 'innovation-lab', yaw: 217 },
          { to: 'lobby', yaw: 0 },
        ],
      },
    ],
  },
}
