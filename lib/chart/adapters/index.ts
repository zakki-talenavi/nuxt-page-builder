import type { ChartEngineId } from '~~/types/puck/chart'
import type { BaseChartAdapter } from './types'
import { ChartJsAdapter } from './chartjs-adapter'

const adapters = new Map<ChartEngineId, BaseChartAdapter>([
  ['chartjs', new ChartJsAdapter()],
])

export function getChartAdapter(engineId: ChartEngineId): BaseChartAdapter {
  const adapter = adapters.get(engineId)
  if (!adapter) throw new Error(`Unknown chart engine: ${engineId}`)
  return adapter
}

export { ChartJsAdapter }
export type { BaseChartAdapter, AdapterOutput } from './types'
