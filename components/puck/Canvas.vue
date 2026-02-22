<template>
  <main
    ref="canvasRef"
    class="puck-canvas"
    @click.self="$emit('deselect')"
  >
    <!-- Viewport controls + zoom -->
    <div class="puck-canvas__toolbar">
      <div class="puck-canvas__viewports">
        <button
          v-for="vp in viewports"
          :key="vp.label"
          class="puck-vp-btn"
          :class="{ active: currentViewport?.label === vp.label }"
          :title="vp.label"
          @click="setViewport(vp)"
        >
          <svg v-if="vp.label === 'Small' || (typeof vp.width === 'number' && vp.width <= 480)" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>
          <svg v-else-if="vp.label === 'Medium' || (typeof vp.width === 'number' && vp.width <= 768)" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="3" width="16" height="18" rx="2"/><line x1="12" y1="17" x2="12" y2="17"/></svg>
          <svg v-else-if="vp.width === '100%'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          <span class="puck-vp-label">{{ vp.label }}</span>
        </button>
      </div>
      <div class="puck-canvas__zoom">
        <button class="puck-zoom-btn" @click="zoomOut" :disabled="zoomOutDisabled" title="Zoom out">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <button class="puck-zoom-btn" @click="zoomIn" :disabled="zoomInDisabled" title="Zoom in">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <select
          class="puck-zoom-select"
          :value="zoomLevel"
          title="Zoom level"
          @change="onZoomSelect($event)"
        >
          <option v-for="opt in zoomSelectOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
        <button class="puck-zoom-btn" @click="resetZoom" title="Fit / reset zoom">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
        </button>
      </div>
    </div>

    <!-- Scrollable canvas area: min-width at 100% zoom so Large doesn't scroll -->
    <div ref="scrollAreaRef" class="puck-canvas__scroll" :style="scrollAreaStyle" @dragover.prevent @drop.prevent="handleDrop">
      <div
        class="puck-canvas__frame"
        :style="frameStyle"
      >
        <div
          class="puck-canvas__viewport"
          :style="viewportStyle"
          :data-viewport="viewportBreakpoint"
        >
          <div class="puck-canvas__viewport-inner">
          <PuckCanvasItem
            v-for="item in items"
            :key="item.props?.id"
            :item="item"
            :config="config"
            :selected-id="selectedId"
            :hovered-id="hoveredId"
            :zone="rootZone"
            @select="$emit('select', $event)"
            @hover="$emit('hover', $event)"
            @deselect="$emit('deselect')"
            @duplicate="$emit('duplicate', $event)"
            @remove="$emit('remove', $event)"
            @slot-drop="$emit('slot-drop', $event)"
          />

          <div v-if="!items.length" class="puck-canvas__empty">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M12 8v8M8 12h8"/>
            </svg>
            <p>Drag components here to start building</p>
          </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { usePuckStore } from '@@/stores/puck'
import { rootDroppableId } from '@@/lib/puck/root-droppable-id'

const store = usePuckStore()
const rootZone = rootDroppableId

const props = defineProps<{
  items: any[]
  config: any
  selectedId: string | null
  hoveredId: string | null
}>()

const emit = defineEmits<{
  (e: 'select', id: string): void
  (e: 'hover', id: string | null): void
  (e: 'deselect'): void
  (e: 'drop', componentType: string): void
  (e: 'duplicate', id: string): void
  (e: 'remove', id: string): void
  (e: 'slot-drop', payload: { componentType?: string; moveId?: string; zone: string; index: number }): void
}>()

const canvasRef = ref<HTMLElement | null>(null)
const scrollAreaRef = ref<HTMLElement | null>(null)

/* Viewports aligned with puck-main defaultViewports */
const viewports = [
  { width: 360, height: 'auto' as const, label: 'Small' },
  { width: 768, height: 'auto' as const, label: 'Medium' },
  { width: 1280, height: 'auto' as const, label: 'Large' },
  { width: '100%' as const, height: 'auto' as const, label: 'Full-width' },
]

/* Zoom steps aligned with puck-main ViewportControls (25%–200%) */
const ZOOM_OPTIONS = [25, 50, 75, 100, 125, 150, 200]
const MIN_ZOOM = ZOOM_OPTIONS[0]!
const MAX_ZOOM = ZOOM_OPTIONS[ZOOM_OPTIONS.length - 1]!

const currentViewport = ref<(typeof viewports)[number]>(viewports[3]!)
const zoomLevel = ref(100)

/** Options for dropdown: fixed steps + current value as "(Auto)" if not in list */
const zoomSelectOptions = computed(() => {
  const current = zoomLevel.value
  const inList = ZOOM_OPTIONS.includes(current)
  const base = ZOOM_OPTIONS.map((v) => ({ value: v, label: `${v}%` }))
  if (!inList && current >= MIN_ZOOM && current <= MAX_ZOOM) {
    base.push({ value: current, label: `${current}% (Auto)` })
    base.sort((a, b) => a.value - b.value)
  }
  return base
})

const zoomOutDisabled = computed(() => zoomLevel.value <= MIN_ZOOM)
const zoomInDisabled = computed(() => zoomLevel.value >= MAX_ZOOM)

function setViewport(vp: typeof viewports[number]) {
  currentViewport.value = vp
  nextTick(() => autoFitZoom())
}

/** Zoom in: next step (like puck-main) */
function zoomIn() {
  const next = ZOOM_OPTIONS.find((v) => v > zoomLevel.value)
  zoomLevel.value = next ?? MAX_ZOOM
}

/** Zoom out: previous step (like puck-main) */
function zoomOut() {
  const prev = [...ZOOM_OPTIONS].reverse().find((v) => v < zoomLevel.value)
  zoomLevel.value = prev ?? MIN_ZOOM
}

function onZoomSelect(e: Event) {
  const v = Number((e.target as HTMLSelectElement).value)
  if (!Number.isNaN(v)) zoomLevel.value = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, v))
}

function resetZoom() {
  autoFitZoom()
}

function autoFitZoom() {
  const el = scrollAreaRef.value
  if (!el) { zoomLevel.value = 100; return }
  const w = currentViewport.value?.width
  if (w === '100%') { zoomLevel.value = 100; return }
  const available = el.clientWidth - 48
  const ratio = Math.min(available / (w as number), 1)
  const percent = Math.round(ratio * 100)
  zoomLevel.value = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, percent))
  lastScrollAreaWidth = el.clientWidth
  lastScrollAreaHeight = el.clientHeight
}

const viewportBreakpoint = computed(() => {
  const w = currentViewport.value?.width
  if (w === '100%') return 'full'
  if (w <= 360) return 'mobile'
  if (w <= 768) return 'tablet'
  return 'desktop'
})

const viewportStyle = computed(() => {
  const w = currentViewport.value?.width
  return {
    width: w === '100%' ? '100%' : `${w}px`,
    minHeight: '100%',
    maxWidth: w === '100%' ? '100%' : `${w}px`,
  }
})

const frameStyle = computed(() => {
  const scale = zoomLevel.value / 100
  return {
    transform: `scale(${scale})`,
    transformOrigin: 'center center',
    width: scale < 1 ? `${100 / scale}%` : '100%',
    transition: 'transform 150ms ease-out',
  }
})

/** At 100% zoom, give scroll area min-width = viewport width so Large (1280px) doesn't scroll */
const scrollAreaStyle = computed(() => {
  const w = currentViewport.value?.width
  if (zoomLevel.value !== 100 || w === '100%' || typeof w !== 'number') return undefined
  return { minWidth: `${w}px` }
})

/** Setelah zoom, geser scroll agar fokus ke tengah frame */
function scrollToCenter() {
  const scrollEl = scrollAreaRef.value
  const frameEl = scrollEl?.firstElementChild as HTMLElement | null
  if (!scrollEl || !frameEl) return
  const viewW = scrollEl.clientWidth
  const viewH = scrollEl.clientHeight
  const frameW = frameEl.offsetWidth
  const frameH = frameEl.offsetHeight
  scrollEl.scrollLeft = Math.max(0, (frameW - viewW) / 2)
  scrollEl.scrollTop = Math.max(0, (frameH - viewH) / 2)
}

let ro: ResizeObserver | null = null
let resizeRaf: number | null = null
let lastScrollAreaWidth = 0
let lastScrollAreaHeight = 0

function throttledAutoFitZoom() {
  if (resizeRaf != null) return
  resizeRaf = requestAnimationFrame(() => {
    resizeRaf = null
    const el = scrollAreaRef.value
    if (!el || currentViewport.value?.width === '100%') return
    const w = el.clientWidth
    const h = el.clientHeight
    if (w === lastScrollAreaWidth && h === lastScrollAreaHeight) return
    autoFitZoom()
  })
}

/** Select closest viewport to window width on load (per puck-main) */
function selectClosestViewport() {
  if (typeof window === 'undefined') return
  const viewportWidth = window.innerWidth
  const frameWidth = scrollAreaRef.value?.clientWidth ?? 0
  const fullWidth = viewports.find((v) => v.width === '100%')
  const withWidth = viewports.filter((v) => v.width !== '100%') as { width: number; height: string; label: string }[]
  if (!withWidth.length) return
  const sorted = [...withWidth].sort(
    (a, b) =>
      Math.abs(viewportWidth - a.width) - Math.abs(viewportWidth - b.width)
  )
  const closest = sorted[0]
  if (!closest) return
  if (frameWidth > 0 && fullWidth && closest.width < frameWidth) {
    currentViewport.value = fullWidth
  } else {
    currentViewport.value = closest as (typeof viewports)[number]
  }
}

watch(zoomLevel, () => {
  nextTick(() => scrollToCenter())
})

onMounted(() => {
  selectClosestViewport()
  nextTick(() => {
    selectClosestViewport()
    autoFitZoom()
    scrollToCenter()
  })
  if (scrollAreaRef.value) {
    ro = new ResizeObserver(throttledAutoFitZoom)
    ro.observe(scrollAreaRef.value)
  }
})

onBeforeUnmount(() => {
  if (resizeRaf != null) cancelAnimationFrame(resizeRaf)
  ro?.disconnect()
})

function handleDrop(e: DragEvent) {
  if (store.getPermissions()?.insert === false) return
  const type = e.dataTransfer?.getData('application/puck-component') || e.dataTransfer?.getData('text/plain')
  if (type) emit('drop', type)
}
</script>

<style scoped>
.puck-canvas {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--puck-color-bg-canvas, #e5e7eb);
  overflow: hidden;
  padding: var(--puck-space-px, 16px);
  position: relative;
}
@media (min-width: 1198px) {
  .puck-canvas {
    padding: calc(var(--puck-space-px, 16px) * 1.5);
    padding-top: calc(var(--puck-space-px, 16px) * 0.5);
  }
  .puck-canvas:not(:has(.puck-canvas__toolbar)) {
    padding-top: calc(var(--puck-space-px, 16px) * 1.5);
  }
}

.puck-canvas__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  padding-bottom: calc(var(--puck-space-px, 16px) * 0.5);
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
  gap: 8px;
}

.puck-canvas__viewports {
  display: flex;
  gap: 2px;
  background: #f3f4f6;
  border-radius: 8px;
  padding: 3px;
}

.puck-vp-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  font-size: 11px;
  font-weight: 500;
  border: none;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.15s;
}
.puck-vp-btn:hover { color: #6b7280; background: #fff; }
.puck-vp-btn.active { color: #6366f1; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
.puck-vp-label { display: none; }
@media (min-width: 900px) {
  .puck-vp-label { display: inline; }
}

.puck-canvas__zoom {
  display: flex;
  align-items: center;
  gap: 2px;
  background: #f3f4f6;
  border-radius: 8px;
  padding: 3px;
}
.puck-zoom-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.15s;
}
.puck-zoom-btn:hover:not(:disabled) { background: #fff; color: #374151; }
.puck-zoom-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.puck-zoom-select {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  background: #fff;
  border: none;
  border-radius: 6px;
  padding: 4px 6px;
  min-width: 72px;
  cursor: pointer;
  appearance: auto;
}
.puck-zoom-select:hover { background: #f9fafb; }
.puck-zoom-select:focus { outline: none; box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.3); }

.puck-canvas__scroll {
  flex: 1;
  overflow: auto;
  padding: 0;
  padding-top: calc(var(--puck-space-px, 16px) * 0.75);
  min-width: 0;
}
@media (min-width: 640px) {
  .puck-canvas__scroll {
    padding-top: var(--puck-space-px, 16px);
  }
}
@media (min-width: 1198px) {
  .puck-canvas__scroll {
    padding-top: calc(var(--puck-space-px, 16px) * 1.25);
  }
}

.puck-canvas__frame {
  display: flex;
  justify-content: center;
  min-height: 100%;
  min-width: 288px;
  position: relative;
  width: 100%;
}

.puck-canvas__viewport {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06);
  outline: 1px solid var(--puck-color-border);
  padding: 0;
  min-height: 400px;
  min-width: 321px;
  transition: width 0.3s ease;
  overflow-x: hidden;
  box-sizing: content-box;
  flex-shrink: 0;
}
@media (min-width: 1198px) {
  .puck-canvas__viewport {
    min-width: unset;
  }
}

.puck-canvas__viewport-inner {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  min-height: 100%;
  box-sizing: border-box;
  padding: 1px;
  overflow-x: hidden;
}

.puck-canvas__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  margin: 16px;
  text-align: center;
}
.puck-canvas__empty p { margin: 12px 0 0; color: #9ca3af; font-size: 14px; }
</style>
