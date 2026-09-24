'use client'

import { useState } from 'react'
import { ArrowLeft, Trash2, View } from 'lucide-react'
import { CATEGORY_META } from '@/lib/categories'
import type { BuildingLocation } from '@/lib/types'
import { VideoPlayer } from '@/components/media/video-player'
import { Button } from '@/components/ui/button'

interface LocationDetailProps {
  location: BuildingLocation
  onBack: () => void
  onOpenPanorama: (location: BuildingLocation) => void
  onDelete: (id: string) => void
}

export function LocationDetail({
  location,
  onBack,
  onOpenPanorama,
  onDelete,
}: LocationDetailProps) {
  const meta = CATEGORY_META[location.category]
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-10 border-b border-border bg-sidebar px-4 py-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:opacity-80"
        >
          <ArrowLeft className="h-4 w-4" />
          All locations
        </button>
      </div>

      {/* Hero */}
      <div className="relative aspect-video w-full bg-muted">
        {location.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={location.thumbnail || '/placeholder.svg'}
            alt={location.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{ backgroundColor: meta.colorToken }}
          >
            <meta.Icon className="h-12 w-12 text-white/90" />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 p-4">
        <div>
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-white"
            style={{ backgroundColor: meta.colorToken }}
          >
            <meta.Icon className="h-3.5 w-3.5" />
            {meta.label}
          </span>
          <h2 className="mt-2 text-xl font-bold text-foreground text-balance">
            {location.name}
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
          {location.description}
        </p>

        {location.panoramaUrl && (
          <Button
            onClick={() => onOpenPanorama(location)}
            className="w-full gap-2"
            size="lg"
          >
            <View className="h-4 w-4" />
            View 360°
          </Button>
        )}

        {location.videoUrl && (
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-foreground">Walkthrough</h3>
            <VideoPlayer
              src={location.videoUrl}
              poster={location.thumbnail}
              title={location.name}
            />
          </div>
        )}

        {/* Destructive action, separated from the rest of the content */}
        <div className="mt-2 border-t border-border pt-4">
          {confirmingDelete ? (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-foreground">
                Delete “{location.name}”?
              </p>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  className="flex-1 gap-2"
                  onClick={() => onDelete(location.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete pin
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setConfirmingDelete(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="ghost"
              className="w-full gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setConfirmingDelete(true)}
            >
              <Trash2 className="h-4 w-4" />
              Delete pin
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
