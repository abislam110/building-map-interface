'use client'

import { useMemo, useState } from 'react'
import { CATEGORY_META } from '@/lib/categories'
import type { Building, BuildingLocation, MapCoordinates } from '@/lib/types'
import { Sidebar } from './sidebar/sidebar'
import { MapCanvas } from './map/map-canvas'
import { PanoramaModal } from './media/panorama-modal'
import { AddPinDialog, type NewPinData } from './map/add-pin-dialog'

/**
 * Top-level client component. Owns all shared UI state (selection, search
 * query, open panorama) and wires the sidebar and map together.
 *
 * This is deliberately the only stateful piece — sidebar, map, and media
 * components are presentational and driven entirely by props, so they're easy
 * to test, reuse, or swap.
 */
export function MapExplorer({ building }: { building: Building }) {
  // Locations are seeded from the building data, then kept in local state so
  // pins added via the UI appear immediately. Added pins live in memory only
  // and reset on reload; edit `lib/building-data.ts` to make them permanent.
  const [locations, setLocations] = useState<BuildingLocation[]>(
    building.locations,
  )
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [panorama, setPanorama] = useState<BuildingLocation | null>(null)
  // Pin-creation flow: `placing` = waiting for a map click; `draftCoords` =
  // clicked point, which opens the details form.
  const [placing, setPlacing] = useState(false)
  const [draftCoords, setDraftCoords] = useState<MapCoordinates | null>(null)

  const liveBuilding = useMemo<Building>(
    () => ({ ...building, locations }),
    [building, locations],
  )

  const selected = locations.find((location) => location.id === selectedId) ?? null

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return locations
    return locations.filter((location) => {
      const category = CATEGORY_META[location.category].label.toLowerCase()
      return (
        location.name.toLowerCase().includes(q) ||
        location.description.toLowerCase().includes(q) ||
        category.includes(q)
      )
    })
  }, [locations, query])

  function handlePlacePin(coords: MapCoordinates) {
    setDraftCoords(coords)
    setPlacing(false)
  }

  function handleDelete(id: string) {
    // Remove the pin from local state. Like additions, this is in-memory only
    // and resets on reload — remove it from `lib/building-data.ts` to persist.
    setLocations((prev) => prev.filter((location) => location.id !== id))
    if (selectedId === id) setSelectedId(null)
    setPanorama((current) => (current?.id === id ? null : current))
  }

  function handleCreate(data: NewPinData) {
    // Add the pin to local state so it shows up instantly. This is in-memory
    // only and resets on reload — add it to `lib/building-data.ts` to persist.
    const newLocation: BuildingLocation = {
      id: `pin-${crypto.randomUUID()}`,
      name: data.name,
      category: data.category,
      description: data.description,
      coordinates: data.coordinates,
      videoUrl: data.videoUrl,
      panoramaUrl: data.panoramaUrl,
    }
    setLocations((prev) => [...prev, newLocation])
    setSelectedId(newLocation.id)
    setDraftCoords(null)
  }

  return (
    <main className="flex h-dvh w-full flex-col overflow-hidden md:flex-row">
      <Sidebar
        building={liveBuilding}
        results={results}
        selected={selected}
        query={query}
        onQuery={setQuery}
        onSelect={setSelectedId}
        onBack={() => setSelectedId(null)}
        onOpenPanorama={setPanorama}
        onDelete={handleDelete}
      />

      <div className="relative min-h-0 flex-1">
        <MapCanvas
          building={liveBuilding}
          selectedId={selectedId}
          onSelect={setSelectedId}
          placing={placing}
          onStartPlacing={() => setPlacing(true)}
          onCancelPlacing={() => setPlacing(false)}
          onPlacePin={handlePlacePin}
        />
      </div>

      {panorama && (
        <PanoramaModal location={panorama} onClose={() => setPanorama(null)} />
      )}

      {draftCoords && (
        <AddPinDialog
          coordinates={draftCoords}
          onSubmit={handleCreate}
          onClose={() => setDraftCoords(null)}
        />
      )}
    </main>
  )
}
