'use client'

import { forwardRef } from 'react'
import { CATEGORY_META } from '@/lib/categories'
import type { BuildingLocation } from '@/lib/types'
import { cn } from '@/lib/utils'

interface MapMarkerProps {
  location: BuildingLocation
  /** 1 / current zoom scale — keeps the marker a constant on-screen size. */
  inverseScale: number
  selected: boolean
  onSelect: () => void
}

/**
 * A Google-Maps-style teardrop pin anchored to a percentage coordinate.
 *
 * The outer element is a zero-size point placed at the coordinate. The inner
 * button is pinned to that point by its bottom-center (the pointer tip) and
 * counter-scaled by `inverseScale` so it stays the same visual size as the
 * user zooms the map.
 */
export const MapMarker = forwardRef<HTMLButtonElement, MapMarkerProps>(
  function MapMarker({ location, inverseScale, selected, onSelect }, ref) {
    const meta = CATEGORY_META[location.category]

    return (
      <div
        className="absolute"
        style={{ left: `${location.coordinates.x}%`, top: `${location.coordinates.y}%` }}
      >
        <button
          ref={ref}
          type="button"
          onClick={onSelect}
          aria-label={location.name}
          aria-pressed={selected}
          className={cn(
            'group absolute bottom-0 left-0 block cursor-pointer rounded-sm outline-none',
            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          )}
          style={{
            transform: `translate(-50%, 0) scale(${inverseScale})`,
            transformOrigin: 'bottom center',
            zIndex: selected ? 20 : 10,
          }}
        >
          {selected && (
            <span className="absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-card px-2 py-1 text-xs font-medium text-card-foreground shadow-md ring-1 ring-border">
              {location.name}
            </span>
          )}
          <MarkerPin colorToken={meta.colorToken} selected={selected} />
        </button>
      </div>
    )
  },
)

function MarkerPin({ colorToken, selected }: { colorToken: string; selected: boolean }) {
  return (
    <span className="relative block" style={{ color: colorToken }}>
      {selected && (
        <span
          className="absolute left-1/2 top-[15px] -z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full"
          style={{ backgroundColor: colorToken, opacity: 0.45 }}
        />
      )}
      <svg
        width="30"
        height="40"
        viewBox="0 0 30 40"
        fill="none"
        className={cn(
          'origin-bottom drop-shadow-md transition-transform duration-150',
          selected ? 'scale-110' : 'group-hover:scale-110',
        )}
        aria-hidden="true"
      >
        <path
          d="M15 0C6.716 0 0 6.716 0 15c0 10.5 15 25 15 25s15-14.5 15-25C30 6.716 23.284 0 15 0Z"
          fill="currentColor"
          stroke="white"
          strokeWidth="1.5"
        />
        <circle cx="15" cy="15" r="5.25" fill="white" />
      </svg>
    </span>
  )
}
