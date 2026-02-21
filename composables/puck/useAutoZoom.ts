import { usePuckStore } from '@@/stores/puck'

export function useAutoZoom(containerRef: Ref<HTMLElement | null>) {
  const store = usePuckStore()

  const zoom = computed(() => store.zoomConfig.zoom)
  const autoZoom = computed(() => store.zoomConfig.autoZoom)

  function recalculate() {
    const el = containerRef.value
    if (!el) return

    const containerWidth = el.clientWidth - 48
    const viewportWidth = store.state.ui.viewports.current.width
    if (viewportWidth === '100%') {
      store.setZoomConfig({ autoZoom: 1, rootHeight: 0, zoom: 1 })
      return
    }

    const ratio = Math.min(containerWidth / viewportWidth, 1)
    store.setZoomConfig({
      autoZoom: ratio,
      rootHeight: 0,
      zoom: ratio,
    })
  }

  let ro: ResizeObserver | null = null

  onMounted(() => {
    if (containerRef.value) {
      ro = new ResizeObserver(recalculate)
      ro.observe(containerRef.value)
    }
    recalculate()
  })

  onBeforeUnmount(() => {
    ro?.disconnect()
  })

  return { zoom, autoZoom, recalculate }
}
