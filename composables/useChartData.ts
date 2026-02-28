import type { Ref, ComputedRef, MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'
import type { DataSource, Mapping } from '~~/types/puck/chart'

const DEFAULT_LABEL_FIELD = 'label'
const DEFAULT_VALUE_FIELD = 'value'

function getNested(obj: Record<string, unknown>, path: string): unknown {
  if (!path.trim()) return obj
  return path.split('.').reduce((acc: unknown, key) => {
    if (acc != null && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, obj)
}

function toNumber(v: unknown): number {
  if (typeof v === 'number' && !Number.isNaN(v)) return v
  if (typeof v === 'string') {
    const n = Number.parseFloat(v)
    return Number.isNaN(n) ? 0 : n
  }
  return 0
}

export interface ChartDataset {
  label: string
  data: number[]
  backgroundColor?: string[]
  borderColor?: string
  borderWidth?: number
}

export interface UseChartDataReturn {
  labels: Ref<string[]>
  datasets: ComputedRef<ChartDataset[]>
  loading: Ref<boolean>
  error: Ref<string | null>
  refresh: () => Promise<void>
}

const COLORS = [
  'rgba(99, 102, 241, 0.8)',
  'rgba(34, 197, 94, 0.8)',
  'rgba(234, 179, 8, 0.8)',
  'rgba(239, 68, 68, 0.8)',
  'rgba(168, 85, 247, 0.8)',
  'rgba(6, 182, 212, 0.8)',
]

export function useChartData(
  dataSource: MaybeRefOrGetter<DataSource>,
  mapping: MaybeRefOrGetter<Mapping>
): UseChartDataReturn {
  const labels = ref<string[]>([])
  const rawData = ref<number[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const labelField = computed(() => (toValue(mapping)?.labelField?.trim() || DEFAULT_LABEL_FIELD))
  const valueField = computed(() => (toValue(mapping)?.valueField?.trim() || DEFAULT_VALUE_FIELD))

  function normalizeRows(raw: unknown): Record<string, unknown>[] {
    if (Array.isArray(raw)) {
      return raw.map((row) =>
        typeof row === 'object' && row !== null ? (row as Record<string, unknown>) : { [valueField.value]: toNumber(row) }
      )
    }
    if (raw != null && typeof raw === 'object' && !Array.isArray(raw)) {
      const o = raw as Record<string, unknown>
      if (Array.isArray(o.data)) return normalizeRows(o.data)
      if (Array.isArray(o.results)) return normalizeRows(o.results)
    }
    return []
  }

  function applyMapping(rows: Record<string, unknown>[]): { labels: string[]; values: number[] } {
    const outLabels: string[] = []
    const outValues: number[] = []
    for (const row of rows) {
      const l = getNested(row, labelField.value)
      const v = getNested(row, valueField.value)
      outLabels.push(l != null ? String(l) : '')
      outValues.push(toNumber(v))
    }
    return { labels: outLabels, values: outValues }
  }

  async function fetchApi(): Promise<Record<string, unknown>[]> {
    const ds = toValue(dataSource)
    const url = (ds?.url || '').trim()
    if (!url) return []
    const method = ds?.method || 'GET'
    const res = await $fetch<unknown>(url, { method })
    return normalizeRows(res)
  }

  async function load() {
    error.value = null
    const ds = toValue(dataSource)
    if (ds?.mode === 'api') {
      loading.value = true
      try {
        const rows = await fetchApi()
        const { labels: L, values: V } = applyMapping(rows)
        labels.value = L
        rawData.value = V
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e)
        error.value = msg
        labels.value = []
        rawData.value = []
      } finally {
        loading.value = false
      }
    } else {
      const raw = ds?.staticData
      const rows = normalizeRows(raw)
      const { labels: L, values: V } = applyMapping(rows)
      labels.value = L
      rawData.value = V
    }
  }

  const datasets = computed<ChartDataset[]>(() => {
    const data = rawData.value
    const backgroundColor = data.map((_, i) => COLORS[i % COLORS.length])
    return [{ label: 'Data', data, backgroundColor }]
  })

  watch([dataSource, mapping, labelField, valueField], load, { immediate: true })

  return {
    labels,
    datasets,
    loading,
    error,
    refresh: load,
  }
}
