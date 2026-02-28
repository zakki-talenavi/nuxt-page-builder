import type { ChartSchema } from '~~/types/puck/chart'

/**
 * Output of an adapter: opaque config for the specific engine.
 * Component passes this to the loaded engine.
 */
export type AdapterOutput = Record<string, unknown>

/**
 * Base chart adapter: ChartSchema → engine-specific config.
 * Implementations: ChartJsAdapter (add Apex/ECharts when needed).
 */
export interface BaseChartAdapter {
  readonly engineId: string

  /**
   * Transform engine-agnostic schema into library options.
   * Must normalize datasets, apply color fallback, handle pie vs cartesian.
   */
  transform(schema: ChartSchema): AdapterOutput
}
