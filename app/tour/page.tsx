import type { Metadata } from 'next'
import { TourExplorer } from '@/components/tour/tour-explorer'
import { building } from '@/lib/building-data'

export const metadata: Metadata = {
  title: `360° Tour · ${building.name}`,
  description: `Walk through ${building.name} in 360°.`,
}

export default async function TourPage({
  searchParams,
}: {
  searchParams: Promise<{ scene?: string }>
}) {
  const { scene } = await searchParams
  const { scenes, startSceneId } = building.tour
  const initialSceneId =
    scene && scenes.some((s) => s.id === scene) ? scene : startSceneId

  return <TourExplorer building={building} initialSceneId={initialSceneId} />
}
