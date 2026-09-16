'use client'

import { useMemo, useState } from 'react'
import { CATEGORY_META } from '@/lib/categories'
import type { Building, BuildingLocation } from '@/lib/types'
import { Sidebar } from './sidebar/sidebar'
import { MapCanvas } from './map/map-canvas'
import { PanoramaModal } from './media/panorama-modal'

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
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [panorama, setPanorama] = useState<BuildingLocation | null>(null)

  const selected =
    building.locations.find((location) => location.id === selectedId) ?? null

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return building.locations
    return building.locations.filter((location) => {
      const category = CATEGORY_META[location.category].label.toLowerCase()
      return (
        location.name.toLowerCase().includes(q) ||
        location.description.toLowerCase().includes(q) ||
        category.includes(q)
      )
    })
  }, [building.locations, query])

  return (
    <main className="flex h-dvh w-full flex-col overflow-hidden md:flex-row">
      <Sidebar
        building={building}
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
          building={building}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>

      {panorama && (
        <PanoramaModal location={panorama} onClose={() => setPanorama(null)} />
      )}
    </main>
  )
}
