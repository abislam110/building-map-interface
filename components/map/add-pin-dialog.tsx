'use client'

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react'
import { X } from 'lucide-react'
import { CATEGORY_META, CATEGORY_ORDER } from '@/lib/categories'
import type { LocationCategory, MapCoordinates } from '@/lib/types'
import { cn } from '@/lib/utils'

/** Data collected by the form. `coordinates` come from the map click. */
export interface NewPinData {
  name: string
  category: LocationCategory
  description: string
  videoUrl?: string
  panoramaUrl?: string
  coordinates: MapCoordinates
}

interface AddPinDialogProps {
  /** Where the user clicked, as x/y percentages of the map image. */
  coordinates: MapCoordinates
  onSubmit: (data: NewPinData) => void
  onClose: () => void
}

const inputClass =
  'w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30'

/**
 * Modal form for creating a new pin. Presentational: it owns only its own
 * field state and hands a completed `NewPinData` back via `onSubmit`.
 */
export function AddPinDialog({
  coordinates,
  onSubmit,
  onClose,
}: AddPinDialogProps) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState<LocationCategory>('room')
  const [description, setDescription] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [panoramaUrl, setPanoramaUrl] = useState('')
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    nameRef.current?.focus()
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      nameRef.current?.focus()
      return
    }
    onSubmit({
      name: trimmed,
      category,
      description: description.trim(),
      videoUrl: videoUrl.trim() || undefined,
      panoramaUrl: panoramaUrl.trim() || undefined,
      coordinates,
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-pin-title"
    >
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-xl bg-card text-card-foreground shadow-xl ring-1 ring-border">
        <div className="flex items-start justify-between border-b border-border px-5 py-4">
          <div>
            <h2 id="add-pin-title" className="text-base font-semibold">
              Add new pin
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Placed at {coordinates.x.toFixed(1)}%, {coordinates.y.toFixed(1)}%
              on the map
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-5 py-5">
          <Field label="Name" required>
            <input
              ref={nameRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Conference Room B"
              className={inputClass}
            />
          </Field>

          <Field label="Category">
            <div className="flex flex-wrap gap-2">
              {CATEGORY_ORDER.map((c) => {
                const meta = CATEGORY_META[c]
                const active = category === c
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    aria-pressed={active}
                    className={cn(
                      'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                      active
                        ? 'border-transparent text-white'
                        : 'border-border text-muted-foreground hover:bg-accent',
                    )}
                    style={active ? { backgroundColor: meta.colorToken } : undefined}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: active ? 'white' : meta.colorToken }}
                    />
                    {meta.label}
                  </button>
                )
              })}
            </div>
          </Field>

          <Field label="Description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Short description shown in the sidebar."
              className={cn(inputClass, 'resize-none')}
            />
          </Field>

          <Field label="Video URL" hint="optional">
            <input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="/videos/my-clip.mp4"
              className={inputClass}
            />
          </Field>

          <Field label="360 panorama URL" hint="optional">
            <input
              value={panoramaUrl}
              onChange={(e) => setPanoramaUrl(e.target.value)}
              placeholder="/panoramas/my-360.jpg"
              className={inputClass}
            />
          </Field>

          <div className="mt-1 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Add pin
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string
  hint?: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-center gap-1.5 text-xs font-medium text-foreground">
        {label}
        {required && (
          <span style={{ color: 'var(--pin-entrance)' }} aria-hidden="true">
            *
          </span>
        )}
        {hint && (
          <span className="font-normal text-muted-foreground">({hint})</span>
        )}
      </span>
      {children}
    </label>
  )
}
