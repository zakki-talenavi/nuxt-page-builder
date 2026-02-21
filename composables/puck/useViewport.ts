import { usePuckStore } from '@@/stores/puck'

export function useViewport() {
  const store = usePuckStore()

  const currentViewport = computed(() => store.state.ui.viewports.current)
  const viewportOptions = computed(() => store.state.ui.viewports.options)
  const controlsVisible = computed(() => store.state.ui.viewports.controlsVisible)

  function setViewport(width: number | '100%', height: number | 'auto' = 'auto') {
    store.setUi({
      viewports: {
        ...store.state.ui.viewports,
        current: { width, height },
      },
    })
  }

  function toggleControls() {
    store.setUi({
      viewports: {
        ...store.state.ui.viewports,
        controlsVisible: !store.state.ui.viewports.controlsVisible,
      },
    })
  }

  return {
    currentViewport,
    viewportOptions,
    controlsVisible,
    setViewport,
    toggleControls,
  }
}
