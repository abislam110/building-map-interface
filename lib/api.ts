import type { Building, BuildingLocation } from './types'
import fallbackBuilding from './fallback-building.json'

/**
 * Frontend data access layer.
 *
 * The Python FastAPI backend (see /backend) is the source of truth for all
 * building data. This module fetches it server-side.
 *
 * If the backend is unreachable (e.g. in the v0 preview, which only runs the
 * Next.js server), we fall back to a bundled JSON snapshot so the UI still
 * renders. The snapshot is data-only — no logic — and is clearly surfaced to
 * the user via a banner. In a real deployment, run the backend so this fetch
 * succeeds.
 *
 * Configure the backend location with the API_URL env var (server-side only),
 * e.g. API_URL=https://your-api.example.com
 */

const API_URL = process.env.API_URL ?? 'http://localhost:8000'

/**
 * Base URL used for calls made from the browser (client components). Must be a
 * NEXT_PUBLIC_ var so it's inlined into the client bundle. Defaults to the
 * local FastAPI server.
 */
const CLIENT_API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

/** Fields needed to create a location. The server generates the `id`. */
export type NewLocationInput = Omit<BuildingLocation, 'id'>

export type BuildingResult = {
  building: Building
  /** 'api' when fetched from FastAPI, 'fallback' when using the snapshot. */
  source: 'api' | 'fallback'
}

export async function getBuilding(): Promise<BuildingResult> {
  try {
    const res = await fetch(`${API_URL}/api/building`, {
      // Always hit the backend fresh so data edits show up on reload.
      cache: 'no-store',
      // Fail fast rather than hanging the render if the backend is down.
      signal: AbortSignal.timeout(3000),
    })
    if (!res.ok) throw new Error(`Backend responded ${res.status}`)
    const building = (await res.json()) as Building
    return { building, source: 'api' }
  } catch (error) {
    console.log(
      `[v0] Backend at ${API_URL} unreachable, using bundled fallback data:`,
      error instanceof Error ? error.message : error,
    )
    return { building: fallbackBuilding as Building, source: 'fallback' }
  }
}

/**
 * Persist a new location to the FastAPI backend (called from the browser).
 *
 * Returns the created location, including its server-generated `id`. Throws if
 * the backend is unreachable or rejects the payload — callers should decide
 * how to handle that (this app keeps an optimistic local pin either way).
 */
export async function createLocation(
  input: NewLocationInput,
): Promise<BuildingLocation> {
  const res = await fetch(`${CLIENT_API_URL}/api/building/locations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
    signal: AbortSignal.timeout(3000),
  })
  if (!res.ok) throw new Error(`Backend responded ${res.status}`)
  return (await res.json()) as BuildingLocation
}
