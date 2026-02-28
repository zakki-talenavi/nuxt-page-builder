import type { Ref, ComputedRef, MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'
import type { ChartSchema, ChartBlockProps, ChartOptions } from '~~/types/puck/chart'
import { useChartData } from '~~/composables/useChartData'

/** Block props shape (mapping fields optional for defineProps). */
type ChartBlockPropsSource = Omit<ChartBlockProps, 'mapping'> & {
  mapping?: { labelField?: string; valueField?: string }
}

/**
 * Builds engine-agnostic ChartSchema from block props (dataSource + mapping).
 * Use in ChartBlock to feed ChartRenderer.
 */
export function useChartSchema(props: MaybeRefOrGetter<ChartBlockPropsSource>): {
  schema: ComputedRef<ChartSchema | null>
  loading: Ref<boolean>
  error: Ref<string | null>
} {
  const dataSource = computed(() => toValue(props).dataSource ?? { mode: 'static' as const, staticData: [] })
  const mapping = computed(() => toValue(props).mapping ?? { labelField: 'label', valueField: 'value' })
  const { labels, datasets, loading, error } = useChartData(dataSource, mapping)

  const schema = computed<ChartSchema | null>(() => {
    const p = toValue(props) as ChartBlockProps
    if (error.value) return null
    const opts = p.options as ChartOptions | undefined
    const bool = (v: unknown) => (typeof v === 'string' ? v === 'true' : Boolean(v))
    return {
      type: (p.chartType ?? 'line') as ChartSchema['type'],
      title: p.title,
      data: {
        labels: labels.value.length ? labels.value : datasets.value[0]?.data.map((_, i) => `Item ${i + 1}`) ?? [],
        series: datasets.value.map((d) => ({
          name: d.label,
          values: d.data,
          color: Array.isArray(d.backgroundColor) && d.backgroundColor.length ? d.backgroundColor[0] : undefined,
        })),
      },
      display: {
        height: opts?.height,
        legendPosition: opts?.legendPosition,
        legendVisible: opts?.legendDisplay,
        tooltipVisible: opts?.tooltip,
        stacked: bool(opts?.stacked),
        fillArea: bool(opts?.fillArea),
        horizontal: bool(opts?.horizontal),
      },
    }
  })

  return { schema, loading, error }
}
