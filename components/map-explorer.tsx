'use client'

import { useMemo, useState } from 'react'
import { CATEGORY_META } from '@/lib/categories'
import { createLocation } from '@/lib/api'
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
export function MapExplorer({
  building,
  dataSource = 'api',
}: {
  building: Building
  /** Where `building` came from. 'fallback' shows a notice banner. */
  dataSource?: 'api' | 'fallback'
}) {
  // Locations are seeded from the server-fetched building, then kept in local
  // state so pins added via the UI appear immediately (optimistic add).
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

  function handleCreate(data: NewPinData) {
    // Optimistically add the pin with a temporary client id so it shows up
    // instantly, then reconcile with the server-generated id if the POST
    // succeeds. If the backend is down, the pin simply stays local.
    const tempId = `pin-${crypto.randomUUID()}`
    const optimistic: BuildingLocation = {
      id: tempId,
      name: data.name,
      category: data.category,
      description: data.description,
      coordinates: data.coordinates,
      videoUrl: data.videoUrl,
      panoramaUrl: data.panoramaUrl,
    }
    setLocations((prev) => [...prev, optimistic])
    setSelectedId(tempId)
    setDraftCoords(null)

    createLocation({
      name: data.name,
      category: data.category,
      description: data.description,
      coordinates: data.coordinates,
      videoUrl: data.videoUrl,
      panoramaUrl: data.panoramaUrl,
    })
      .then((saved) => {
        setLocations((prev) =>
          prev.map((location) => (location.id === tempId ? saved : location)),
        )
        setSelectedId((current) => (current === tempId ? saved.id : current))
      })
      .catch((error) => {
        console.log(
          '[v0] Could not persist pin to backend; keeping it locally:',
          error instanceof Error ? error.message : error,
        )
      })
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
      />

      <div className="relative min-h-0 flex-1">
        {dataSource === 'fallback' && (
          <div
            role="status"
            className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center p-3"
          >
            <p className="pointer-events-auto rounded-full border border-border bg-card/95 px-4 py-1.5 text-center text-xs text-muted-foreground shadow-sm backdrop-blur">
              Showing bundled sample data &mdash; the Python backend is not
              reachable. Start it (see <code>backend/README.md</code>) for live
              data.
            </p>
          </div>
        )}
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
