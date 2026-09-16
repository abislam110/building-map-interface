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
export function MapExplorer({ building }: { building: Building }) {
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
