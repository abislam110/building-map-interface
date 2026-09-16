import {
  Coffee,
  DoorOpen,
  FlaskConical,
  Presentation,
  Trees,
  type LucideIcon,
} from 'lucide-react'
import type { LocationCategory } from './types'

/**
 * Presentation metadata for each location category.
 *
 * `colorToken` refers to a CSS custom property defined in `globals.css`
 * (`--pin-*`). It is consumed via `color: var(--pin-*)` so pins, chips, and
 * legend swatches all stay in sync with the theme.
 */
export interface CategoryMeta {
  label: string
  colorToken: string
  Icon: LucideIcon
}

export const CATEGORY_META: Record<LocationCategory, CategoryMeta> = {
  entrance: { label: 'Entrance', colorToken: 'var(--pin-entrance)', Icon: DoorOpen },
  amenity: { label: 'Amenity', colorToken: 'var(--pin-amenity)', Icon: Coffee },
  room: { label: 'Room', colorToken: 'var(--pin-room)', Icon: Presentation },
  facility: { label: 'Facility', colorToken: 'var(--pin-facility)', Icon: FlaskConical },
  outdoor: { label: 'Outdoor', colorToken: 'var(--pin-outdoor)', Icon: Trees },
}

/** Ordered list of categories, handy for rendering a legend. */
export const CATEGORY_ORDER: LocationCategory[] = [
  'entrance',
  'room',
  'amenity',
  'facility',
  'outdoor',
]
