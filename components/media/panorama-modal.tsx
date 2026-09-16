'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Loader2, X } from 'lucide-react'
import type { BuildingLocation } from '@/lib/types'
import '@photo-sphere-viewer/core/index.css'

/**
 * The 360° viewer touches `window`, so it must be client-only. We load it with
 * `next/dynamic` (ssr: false) to keep it out of the server bundle.
 */
const ReactPhotoSphereViewer = dynamic(
  () => import('react-photo-sphere-viewer').then((m) => m.ReactPhotoSphereViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center text-primary-foreground/80">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading 360° view…
      </div>
    ),
  },
)

interface PanoramaModalProps {
  location: BuildingLocation
  onClose: () => void
}

export function PanoramaModal({ location, onClose }: PanoramaModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`360 degree view of ${location.name}`}
      className="fixed inset-0 z-50 flex flex-col bg-black/95"
    >
      <header className="flex items-center justify-between gap-4 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">{location.name}</p>
          <p className="text-xs text-white/60">360° view · drag to look around</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close 360 view"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      <div className="relative flex-1">
        {location.panoramaUrl && (
          <ReactPhotoSphereViewer
            key={location.id}
            src={location.panoramaUrl}
            height="100%"
            width="100%"
            containerClass="!absolute !inset-0"
            navbar={['zoom', 'fullscreen']}
          />
        )}
      </div>
    </div>
  )
}
