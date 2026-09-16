import { MapExplorer } from '@/components/map-explorer'
import { building } from '@/lib/building-data'

export default function Page() {
  return <MapExplorer building={building} />
}
