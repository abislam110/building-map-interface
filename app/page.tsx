import { MapExplorer } from '@/components/map-explorer'
import { getBuilding } from '@/lib/api'

// Data comes from the Python FastAPI backend at request time.
export const dynamic = 'force-dynamic'

export default async function Page() {
  const { building, source } = await getBuilding()
  return <MapExplorer building={building} dataSource={source} />
}
