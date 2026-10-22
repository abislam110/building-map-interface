'use client'

import { cn } from '@/lib/utils'
import type { TourScene } from '@/lib/types'

interface TourMinimapProps {
  mapImage: string
  scenes: TourScene[]
  currentId: string
  /** Camera direction in degrees, drawn as a view cone on the current dot. */
  heading: number
  onSelect: (sceneId: string) => void
}

/**
 * Floor-plan inset showing where each 360° photo was taken. The current scene
 * gets a "you are here" dot with a view cone; other dots jump to that scene.
 * Scenes without `coordinates` are simply not drawn.
 */
export function TourMinimap({
  mapImage,
  scenes,
  currentId,
  heading,
  onSelect,
}: TourMinimapProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-lg bg-muted">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={mapImage || '/placeholder.svg'}
        alt="Floor plan"
        className="block h-auto w-full select-none opacity-90"
        draggable={false}
      />
      {scenes.map((scene) => {
        if (!scene.coordinates) return null
        const isCurrent = scene.id === currentId
        return (
          <button
            key={scene.id}
            type="button"
            onClick={() => onSelect(scene.id)}
            disabled={isCurrent}
            aria-label={isCurrent ? `You are in ${scene.name}` : `Go to ${scene.name}`}
            title={scene.name}
            className={cn(
              'absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full',
              isCurrent ? 'z-10 h-10 w-10 cursor-default' : 'h-6 w-6 cursor-pointer',
            )}
            style={{ left: `${scene.coordinates.x}%`, top: `${scene.coordinates.y}%` }}
          >
            {isCurrent ? (
              <>
                <span
                  aria-hidden="true"
                  className="tour-view-cone absolute inset-0"
                  style={{ transform: `rotate(${heading}deg)` }}
                />
                <span className="tour-here-dot relative h-3.5 w-3.5 rounded-full" />
              </>
            ) : (
              <span className="tour-scene-dot h-3 w-3 rounded-full transition-transform hover:scale-125" />
            )}
          </button>
        )
      })}
    </div>
  )
}
