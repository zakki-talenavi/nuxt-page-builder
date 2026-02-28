/**
 * Chart types — engine-agnostic. No library-specific options.
 * Stored schema stays valid when switching ApexCharts / Chart.js / ECharts.
 */

// ─── Builder (data source, mapping) ─────────────────────────────────────────
export type ChartType = 'line' | 'bar' | 'pie' | 'doughnut'

export type DataSourceMode = 'static' | 'api'
export type DataSourceMethod = 'GET' | 'POST'

export interface DataSource {
  mode: DataSourceMode
  url?: string
  method?: DataSourceMethod
  staticData?: Record<string, unknown>[]
}

export interface Mapping {
  labelField: string
  valueField: string
}

export type LegendPosition = 'top' | 'bottom' | 'left' | 'right'

export interface ChartOptions {
  height?: number
  legendPosition?: LegendPosition
  legendDisplay?: boolean
  tooltip?: boolean
  responsive?: boolean
  fillArea?: boolean
  stacked?: boolean
  horizontal?: boolean
}

/** Block props (builder form: dataSource + mapping). */
export interface ChartBlockProps {
  chartType: ChartType
  title?: string
  dataSource: DataSource
  mapping: Mapping
  options?: ChartOptions
}

// ─── Engine-agnostic schema (runtime → adapter → engine) ───────────────────

export interface ChartSeries {
  name: string
  values: number[]
  color?: string
}

export interface ChartSchemaData {
  labels: string[]
  series: ChartSeries[]
}

export interface ChartDisplayOptions {
  height?: number
  legendPosition?: LegendPosition
  legendVisible?: boolean
  tooltipVisible?: boolean
  stacked?: boolean
  fillArea?: boolean
  horizontal?: boolean
}

export interface ChartAxisOptions {
  xScale?: 'category' | 'time'
  yScale?: 'linear'
}

/** Canonical schema: serializable, no lib terms. Adapters consume this. */
export interface ChartSchema {
  type: ChartType
  title?: string
  data: ChartSchemaData
  display?: ChartDisplayOptions
  axis?: ChartAxisOptions
}

/** Supported engine id (extend when adding adapters). */
export type ChartEngineId = 'chartjs'
