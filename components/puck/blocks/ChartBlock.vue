<template>
  <div class="puck-chart-block">
    <div v-if="chartError" class="puck-chart-block__error">{{ chartError }}</div>
    <div v-else-if="chartLoading" class="puck-chart-block__loading">Loading chart…</div>
    <ChartRenderer
      v-else-if="schema"
      :schema="schema"
      engine="chartjs"
    />
  </div>
</template>

<script setup lang="ts">
import type { ChartType, LegendPosition, ChartOptions } from '~~/types/puck/chart'
import { useChartSchema } from '~~/composables/useChartSchema'
import ChartRenderer from '~~/components/chart/ChartRenderer.vue'

const props = withDefaults(
  defineProps<{
    chartType?: ChartType
    title?: string
    dataSource?: { mode: 'static' | 'api'; url?: string; method?: 'GET' | 'POST'; staticData?: Record<string, unknown>[] }
    mapping?: { labelField?: string; valueField?: string }
    options?: ChartOptions
    /** @deprecated use options */
    ui?: { legendPosition?: LegendPosition; height?: number }
  }>(),
  {
    chartType: 'line',
    title: '',
    dataSource: () => ({ mode: 'static', staticData: [] }),
    mapping: () => ({ labelField: 'label', valueField: 'value' }),
    options: () => ({}),
    ui: () => ({}),
  }
)

const { schema, loading: chartLoading, error: chartError } = useChartSchema(() => props)
</script>

<style scoped>
.puck-chart-block {
  width: 100%;
  padding: 12px 0;
  min-height: 120px;
}

.puck-chart-block__error {
  padding: 12px 16px;
  color: #dc2626;
  background: #fef2f2;
  border-radius: 8px;
  font-size: 0.875rem;
}

.puck-chart-block__loading {
  padding: 24px;
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
}
</style>
