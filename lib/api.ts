import type { Building } from './types'
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
