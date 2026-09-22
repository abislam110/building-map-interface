'use client'

import { useEffect, useRef, useState, type MouseEvent } from 'react'
import {
  TransformComponent,
  TransformWrapper,
  type ReactZoomPanPinchRef,
} from 'react-zoom-pan-pinch'
import { Minus, Plus, Maximize2, MapPin, X } from 'lucide-react'
import { CATEGORY_META, CATEGORY_ORDER } from '@/lib/categories'
import type { Building, MapCoordinates } from '@/lib/types'
import { cn } from '@/lib/utils'
import { MapMarker } from './map-marker'

interface MapCanvasProps {
  building: Building
  selectedId: string | null
  onSelect: (id: string) => void
  /** True while the user is placing a new pin (click-to-place mode). */
  placing: boolean
  onStartPlacing: () => void
  onCancelPlacing: () => void
  /** Fired with the clicked point (x/y percentages) while placing. */
  onPlacePin: (coords: MapCoordinates) => void
}

/**
 * The interactive map surface: a pannable / zoomable map image with pins.
 * Selecting a location (from here or the sidebar) smoothly zooms to its pin.
 *
 * When `placing` is true, clicking anywhere on the map reports the clicked
 * point as x/y percentages (via `onPlacePin`) so a new pin can be created
 * there. Percentages are used so the point stays correct at any zoom/pan.
 */
export function MapCanvas({
  building,
  selectedId,
  onSelect,
  placing,
  onStartPlacing,
  onCancelPlacing,
  onPlacePin,
}: MapCanvasProps) {
  const [scale, setScale] = useState(1)
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null)
  const markerRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  useEffect(() => {
    if (!selectedId) return
    const node = markerRefs.current[selectedId]
    if (node && transformRef.current) {
      transformRef.current.zoomToElement(node, 2.2, 500)
    }
  }, [selectedId])

  function handleMapClick(e: MouseEvent<HTMLDivElement>) {
    if (!placing) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    onPlacePin({
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
    })
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-muted">
      <TransformWrapper
        ref={transformRef}
        minScale={0.6}
        maxScale={6}
        initialScale={1}
        centerOnInit
        limitToBounds={false}
        doubleClick={{ step: 0.7 }}
        wheel={{ step: 0.12 }}
        onTransformed={(_ref, state) => setScale(state.scale)}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <TransformComponent
              wrapperStyle={{ width: '100%', height: '100%' }}
              contentStyle={{ width: '100%', height: '100%' }}
            >
              {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
              <div
                className={cn('relative w-full', placing && 'cursor-crosshair')}
                onClick={handleMapClick}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={building.mapImage || '/placeholder.svg'}
                  alt={`Floor plan of ${building.name}`}
                  className="block h-auto w-full select-none"
                  draggable={false}
                />
                {/* Markers ignore pointer events while placing so the click
                    lands on the map surface, not on an existing pin. */}
                <div
                  className={cn('absolute inset-0', placing && 'pointer-events-none')}
                >
                  {building.locations.map((location) => (
                    <MapMarker
                      key={location.id}
                      ref={(el) => {
                        markerRefs.current[location.id] = el
                      }}
                      location={location}
                      inverseScale={1 / scale}
                      selected={selectedId === location.id}
                      onSelect={() => onSelect(location.id)}
                    />
                  ))}
                </div>
              </div>
            </TransformComponent>

            <MapLegend />

            {placing && (
              <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-center px-4">
                <p className="pointer-events-auto rounded-full bg-primary px-4 py-1.5 text-center text-xs font-medium text-primary-foreground shadow-md">
                  Click anywhere on the map to place your pin
                </p>
              </div>
            )}

            {/* Zoom controls */}
            <div className="absolute bottom-6 right-4 flex flex-col overflow-hidden rounded-lg bg-card shadow-lg ring-1 ring-border">
              <button
                type="button"
                onClick={() => zoomIn()}
                aria-label="Zoom in"
                className="flex h-10 w-10 items-center justify-center text-card-foreground transition-colors hover:bg-accent"
              >
                <Plus className="h-5 w-5" />
              </button>
              <div className="h-px w-full bg-border" />
              <button
                type="button"
                onClick={() => zoomOut()}
                aria-label="Zoom out"
                className="flex h-10 w-10 items-center justify-center text-card-foreground transition-colors hover:bg-accent"
              >
                <Minus className="h-5 w-5" />
              </button>
            </div>

            {/* Bottom-left controls: add-pin + reset view */}
            <div className="absolute bottom-6 left-4 flex flex-col items-start gap-2">
              <button
                type="button"
                onClick={placing ? onCancelPlacing : onStartPlacing}
                aria-pressed={placing}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold shadow-lg ring-1 transition-colors',
                  placing
                    ? 'bg-card text-card-foreground ring-border hover:bg-accent'
                    : 'bg-primary text-primary-foreground ring-transparent hover:bg-primary/90',
                )}
              >
                {placing ? (
                  <X className="h-4 w-4" />
                ) : (
                  <MapPin className="h-4 w-4" />
                )}
                {placing ? 'Cancel' : 'Add new pin'}
              </button>
              <button
                type="button"
                onClick={() => resetTransform()}
                aria-label="Reset view"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-card text-card-foreground shadow-lg ring-1 ring-border transition-colors hover:bg-accent"
              >
                <Maximize2 className="h-4.5 w-4.5" />
              </button>
            </div>
          </>
        )}
      </TransformWrapper>
    </div>
  )
}

function MapLegend() {
  return (
    <div className="pointer-events-none absolute right-4 top-4 rounded-lg bg-card/90 p-3 shadow-md ring-1 ring-border backdrop-blur-sm">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        Legend
      </p>
      <ul className="flex flex-col gap-1.5">
        {CATEGORY_ORDER.map((category) => {
          const meta = CATEGORY_META[category]
          return (
            <li key={category} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: meta.colorToken }}
              />
              <span className="text-xs text-card-foreground">{meta.label}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
