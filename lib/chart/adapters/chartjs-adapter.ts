import type { ChartSchema, ChartType } from '~~/types/puck/chart'
import type { BaseChartAdapter } from './types'
import { getColorAt } from '../constants'

/** Chart.js compatible data + options (opaque for adapter output). */
export interface ChartJsAdapterOutput {
  type: string
  data: { labels: string[]; datasets: ChartJsDataset[] }
  options: Record<string, unknown>
}

interface ChartJsDataset {
  label: string
  data: number[]
  backgroundColor?: string | string[]
  borderColor?: string
  borderWidth?: number
  fill?: boolean
  stack?: string
}

export class ChartJsAdapter implements BaseChartAdapter {
  readonly engineId = 'chartjs'

  transform(schema: ChartSchema): ChartJsAdapterOutput {
    const { type, data, display = {}, axis = {} } = schema
    const labels = data.labels.length ? data.labels : data.series[0]?.values.map((_, i) => `Item ${i + 1}`) ?? []
    const datasets = this.buildDatasets(data.series, type, display)

    const plugins: Record<string, unknown> = {
      legend: {
        display: display.legendVisible !== false,
        position: display.legendPosition ?? 'top',
      },
      tooltip: { enabled: display.tooltipVisible !== false },
    }

    const options: Record<string, unknown> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins,
    }

    const isCartesian = type === 'line' || type === 'bar'
    if (isCartesian) {
      options.indexAxis = display.horizontal ? 'y' : 'x'
      const cat = axis.xScale ?? 'category'
      const linear = axis.yScale ?? 'linear'
      if (display.horizontal) {
        options.scales = { x: { type: linear, beginAtZero: true }, y: { type: cat } }
      } else {
        options.scales = { x: { type: cat }, y: { type: linear, beginAtZero: true } }
      }
    }

    return { type, data: { labels, datasets }, options }
  }

  private buildDatasets(
    series: ChartSchema['data']['series'],
    chartType: ChartType,
    display: ChartSchema['display']
  ): ChartJsDataset[] {
    const stacked = display?.stacked ?? false
    const fillArea = display?.fillArea ?? false
    const isPieLike = chartType === 'pie' || chartType === 'doughnut'

    return series.map((s, i) => {
      const color = getColorAt(i, s.color)
      const out: ChartJsDataset = { label: s.name, data: s.values }
      if (isPieLike) {
        // Satu warna per irisan (index j), jangan pakai s.color supaya tiap slice beda warna
        out.backgroundColor = s.values.map((_, j) => getColorAt(j))
        out.borderColor = '#ffffff'
        out.borderWidth = 2
      } else {
        out.backgroundColor = color
        out.borderColor = color
        out.borderWidth = 1
        if (chartType === 'line') out.fill = fillArea
        if (stacked) out.stack = 'stack0'
      }
      return out
    })
  }
}
