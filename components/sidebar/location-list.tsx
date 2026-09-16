'use client'

import { ChevronRight, ImageOff, Video, View } from 'lucide-react'
import { CATEGORY_META } from '@/lib/categories'
import type { BuildingLocation } from '@/lib/types'

interface LocationListProps {
  locations: BuildingLocation[]
  onSelect: (id: string) => void
}

export function LocationList({ locations, onSelect }: LocationListProps) {
  if (locations.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 px-6 py-16 text-center text-muted-foreground">
        <ImageOff className="h-6 w-6" />
        <p className="text-sm">No locations match your search.</p>
      </div>
    )
  }

  return (
    <ul className="flex flex-col">
      {locations.map((location) => {
        const meta = CATEGORY_META[location.category]
        return (
          <li key={location.id}>
            <button
              type="button"
              onClick={() => onSelect(location.id)}
              className="flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left transition-colors hover:bg-accent"
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: meta.colorToken }}
              >
                <meta.Icon className="h-4.5 w-4.5 text-white" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate font-medium text-foreground">
                    {location.name}
                  </span>
                </span>
                <span className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{meta.label}</span>
                  {location.videoUrl && (
                    <Video className="h-3.5 w-3.5" aria-label="Has video" />
                  )}
                  {location.panoramaUrl && (
                    <View className="h-3.5 w-3.5" aria-label="Has 360 view" />
                  )}
                </span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </button>
          </li>
        )
      })}
    </ul>
  )
}
