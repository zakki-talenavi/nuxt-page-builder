<template>
  <ClientOnly>
    <div class="chart-renderer">
      <h3 v-if="schema.title" class="chart-renderer__title">{{ schema.title }}</h3>
      <div
        ref="containerRef"
        class="chart-renderer__container"
        :style="containerStyle"
      />
    </div>
    <template #fallback>
      <div class="chart-renderer chart-renderer--loading">Loading chart…</div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import type { ChartSchema, ChartEngineId } from '~~/types/puck/chart'
import { getChartAdapter } from '~~/lib/chart/adapters'

const props = withDefaults(
  defineProps<{
    schema: ChartSchema
    engine?: ChartEngineId
  }>(),
  { engine: 'chartjs' }
)

const containerRef = ref<HTMLElement | null>(null)
const chartInstance = shallowRef<unknown>(null)

const containerStyle = computed(() => ({
  height: `${Math.min(800, Math.max(100, props.schema.display?.height ?? 300))}px`,
}))

async function renderChartJs() {
  const adapter = getChartAdapter('chartjs')
  const config = adapter.transform(props.schema) as { type: string; data: { labels: string[]; datasets: unknown[] }; options: Record<string, unknown> }
  const { Chart, CategoryScale, LinearScale, BarController, BarElement, LineController, LineElement, PointElement, ArcElement, PieController, DoughnutController, Legend, Tooltip } = await import('chart.js')
  Chart.register(
    CategoryScale,
    LinearScale,
    BarController,
    BarElement,
    LineController,
    LineElement,
    PointElement,
    ArcElement,
    PieController,
    DoughnutController,
    Legend,
    Tooltip
  )
  if (!containerRef.value) return
  const canvas = document.createElement('canvas')
  containerRef.value.appendChild(canvas)
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  chartInstance.value = new Chart(ctx, config)
}

function destroy() {
  if (chartInstance.value && typeof (chartInstance.value as { destroy: () => void }).destroy === 'function') {
    (chartInstance.value as { destroy: () => void }).destroy()
    chartInstance.value = null
  }
  if (containerRef.value) containerRef.value.innerHTML = ''
}

watch([() => props.schema, () => props.engine], async () => {
  destroy()
  await nextTick()
  if (props.engine === 'chartjs') await renderChartJs()
}, { deep: true })

onMounted(() => {
  if (props.engine === 'chartjs') renderChartJs()
})

onBeforeUnmount(destroy)
</script>

<style scoped>
.chart-renderer {
  width: 100%;
  padding: 12px 0;
  min-height: 120px;
}

.chart-renderer__title {
  margin: 0 0 12px;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--puck-color-text, #1f2937);
}

.chart-renderer__container {
  width: 100%;
  position: relative;
}

.chart-renderer--loading {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 0.875rem;
}
</style>
