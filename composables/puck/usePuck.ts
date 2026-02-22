import { usePuckStore } from '~~/stores/puck'

export function usePuck() {
  const store = usePuckStore()
  return {
    appState: computed(() => store.state),
    config: computed(() => store.config),
    selectedItem: computed(() => store.selectedItem),
    dispatch: store.dispatch,
    setUi: store.setUi,
    setStatus: store.setStatus,
    getComponentConfig: store.getComponentConfig,
    getCurrentData: () => store.getCurrentData,
    history: computed(() => store.history),
    historyBack: store.historyBack,
    historyForward: store.historyForward,
  }
}

export function useAppStore() {
  return usePuckStore()
}
