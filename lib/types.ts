/**
 * Core domain types for the single-building indoor map.
 *
 * The app is intentionally data-driven: everything rendered on the map and in
 * the sidebar comes from a `Building` object (see `lib/building-data.ts`).
 * To adapt this to a real building, replace that data — you should not need to
 * touch the components.
 */

/** The set of location categories. Each maps to a pin color + icon in
 *  `lib/categories.tsx`. Add a new category by extending this union and adding
 *  a matching entry to `CATEGORY_META` and a `--pin-*` token in `globals.css`. */
export type LocationCategory =
  | 'entrance'
  | 'amenity'
  | 'room'
  | 'facility'
  | 'outdoor'

/**
 * A point on the map, expressed as percentages (0–100) from the top-left of
 * the map image. Using percentages keeps pins aligned regardless of the
 * rendered map size or zoom level.
 */
export interface MapCoordinates {
  x: number
  y: number
}

/**
 * A single point of interest inside the building.
 *
 * `description` is always shown in the sidebar. `videoUrl` and `panoramaUrl`
 * are optional — when present, the sidebar renders a video player and/or a
 * "View 360°" button respectively.
 */
export interface BuildingLocation {
  /** Stable unique id (used for selection + deep-linking). */
  id: string
  /** Display name, e.g. "Main Lobby". */
  name: string
  /** Category, controls the pin color + icon. */
  category: LocationCategory
  /** Short description shown in the sidebar detail view. */
  description: string
  /** Position of the pin on the map image. */
  coordinates: MapCoordinates
  /** Optional small preview image (path under /public or absolute URL). */
  thumbnail?: string
  /**
   * Optional walkthrough video for this location (mp4/webm).
   * Swap in your own file under /public/videos when available.
   */
  videoUrl?: string
  /**
   * Optional equirectangular 360° panorama image.
   * Swap in your own file under /public/panoramas when available.
   */
  panoramaUrl?: string
}

/** The building rendered by the app. There is exactly one per deployment. */
export interface Building {
  id: string
  name: string
  /** Human-readable address / subtitle shown under the title. */
  address: string
  /** Map image path (under /public) or absolute URL. */
  mapImage: string
  /** All points of interest to render as pins. */
  locations: BuildingLocation[]
}
