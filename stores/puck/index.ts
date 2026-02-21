import { defineStore } from 'pinia'
import type {
  Config,
  IframeConfig,
  Overrides,
  AppState,
  UiState,
  Plugin,
  Metadata,
  ComponentConfig,
  ComponentData,
  RootDataWithProps,
  ResolveDataTrigger,
  Viewports,
  History,
  Permissions,
  PrivateAppState,
} from '~/types/puck'
import type { PuckAction } from '~/lib/puck/reducer/actions'
import { createReducer } from '~/lib/puck/reducer'
import { getItem } from '~/lib/puck/data/get-item'
import { defaultViewports } from '~/lib/puck/default-viewports'
import { defaultAppState } from '~/lib/puck/default-app-state'
import { resolveComponentData } from '~/lib/puck/resolve-component-data'
import { walkAppState } from '~/lib/puck/data/walk-app-state'
import { toRoot } from '~/lib/puck/data/to-root'
import { generateId } from '~/lib/puck/generate-id'
import { getChanged } from '~/lib/puck/get-changed'
import { makeStatePublic } from '~/lib/puck/data/make-state-public'
import { flattenData } from '~/lib/puck/data/flatten-data'

export type Status = 'LOADING' | 'MOUNTED' | 'READY'

export type ZoomConfig = {
  autoZoom: number
  rootHeight: number
  zoom: number
}

export type ComponentState = Record<string, { loadingCount: number }>

export type PuckNodeInstance = {
  id: string
  methods: { sync: () => void; hideOverlay: () => void; showOverlay: () => void }
  element: HTMLElement | null
}

const defaultPageFields = { title: { type: 'text' as const } }

function debounce<T extends (...args: any[]) => void>(fn: T, ms = 250) {
  let timer: ReturnType<typeof setTimeout>
  return ((...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }) as T
}

export const usePuckStore = defineStore('puck', {
  state: (): {
    instanceId: string
    state: PrivateAppState
    config: Config
    componentState: ComponentState
    plugins: Plugin[]
    overrides: Partial<Overrides>
    viewports: Viewports
    zoomConfig: ZoomConfig
    status: Status
    iframe: IframeConfig
    metadata: Metadata
    selectedItem: ComponentData | null
    fieldTransforms: Record<string, (p: any) => any>
    currentRichText: null | { id: string; inline: boolean; inlineComponentId?: string; field: any; editor: any }
    // history
    historyIndex: number
    histories: History[]
    initialAppState: PrivateAppState
    // nodes
    nodes: Record<string, PuckNodeInstance | undefined>
    // fields
    fieldsData: { fields: any; loading: boolean; lastResolvedData: any; id: string | undefined }
    // permissions
    permissionsCache: Record<string, any>
    globalPermissions: Permissions
    resolvedPermissions: Record<string, Partial<Permissions> | undefined>
    pendingLoadTimeouts: Record<string, ReturnType<typeof setTimeout>>
    onAction?: (action: PuckAction, newState: AppState, prevState: AppState) => void
  } => ({
    instanceId: generateId(),
    state: defaultAppState as PrivateAppState,
    config: { components: {} },
    componentState: {},
    plugins: [],
    overrides: {},
    viewports: defaultViewports,
    zoomConfig: { autoZoom: 1, rootHeight: 0, zoom: 1 },
    status: 'LOADING',
    iframe: {},
    metadata: {},
    selectedItem: null,
    fieldTransforms: {},
    currentRichText: null,
    historyIndex: 0,
    histories: [],
    initialAppState: defaultAppState as PrivateAppState,
    nodes: {},
    fieldsData: { fields: {}, loading: false, lastResolvedData: {}, id: undefined },
    permissionsCache: {},
    globalPermissions: {
      drag: true,
      edit: true,
      delete: true,
      duplicate: true,
      insert: true,
    },
    resolvedPermissions: {},
    pendingLoadTimeouts: {},
    onAction: undefined,
  }),

  getters: {
    getCurrentData(): ComponentData | any {
      return this.selectedItem ?? this.state.data.root
    },
    history: (state) => ({
      get index() { return state.historyIndex },
      get histories() { return state.histories },
      get initialAppState() { return state.initialAppState },
      hasPast: () => state.historyIndex > 0,
      hasFuture: () => state.historyIndex < state.histories.length - 1,
      prevHistory: () => state.histories[state.historyIndex - 1] ?? null,
      nextHistory: () => state.histories[state.historyIndex + 1] ?? null,
      currentHistory: () => state.histories[state.historyIndex],
    }),
  },

  actions: {
    init(initial: {
      config: Config
      state?: AppState
      plugins?: Plugin[]
      overrides?: Partial<Overrides>
      iframe?: IframeConfig
      metadata?: Metadata
      onAction?: (action: PuckAction, newState: AppState, prevState: AppState) => void
    }) {
      this.config = initial.config
      if (initial.state) this.state = initial.state as PrivateAppState
      if (initial.plugins) this.plugins = initial.plugins
      if (initial.overrides) this.overrides = initial.overrides
      if (initial.iframe) this.iframe = initial.iframe
      if (initial.metadata) this.metadata = initial.metadata ?? {}
      if (initial.onAction) this.onAction = initial.onAction
      this.initialAppState = this.state as PrivateAppState
      this.histories = [{ state: makeStatePublic(this.state as any), id: generateId('history') }]
      this.historyIndex = 0
      this.selectedItem = this.state.ui.itemSelector
        ? getItem(this.state.ui.itemSelector, this.state as any)
        : null
    },

    dispatch(action: PuckAction) {
      const record = debounce((appState: AppState) => {
        const history = { state: appState, id: generateId('history') }
        this.histories = [...this.histories.slice(0, this.historyIndex + 1), history]
        this.historyIndex = this.histories.length - 1
      }, 250)

      const reducer = createReducer({
        record,
        appStore: { config: this.config },
        onAction: this.onAction,
      })

      const newState = reducer(this.state as any, action)
      this.state = newState as PrivateAppState
      this.selectedItem = newState.ui.itemSelector
        ? getItem(newState.ui.itemSelector, newState)
        : null
    },

    setUi(ui: Partial<UiState>, recordHistory?: boolean) {
      const reducer = createReducer({
        record: () => {},
        appStore: { config: this.config },
      })
      const newState = reducer(this.state as any, { type: 'setUi', ui, recordHistory })
      this.state = newState as PrivateAppState
      this.selectedItem = newState.ui.itemSelector
        ? getItem(newState.ui.itemSelector, newState)
        : null
    },

    setZoomConfig(zoomConfig: ZoomConfig) {
      this.zoomConfig = zoomConfig
    },

    setStatus(status: Status) {
      this.status = status
    },

    getComponentConfig(type?: string): ComponentConfig | null | undefined {
      const rootFields = this.config.root?.fields || defaultPageFields
      if (type && type !== 'root') return this.config.components[type] ?? null
      if (this.selectedItem) return this.config.components[this.selectedItem.type] ?? null
      return { ...this.config.root, fields: rootFields } as ComponentConfig
    },

    setComponentLoading(id: string, loading = true, defer = 0) {
      const loadId = generateId()
      const timeout = setTimeout(() => {
        if (loading) {
          this.componentState = {
            ...this.componentState,
            [id]: {
              ...this.componentState[id],
              loadingCount: (this.componentState[id]?.loadingCount || 0) + 1,
            },
          }
        } else {
          this.componentState = {
            ...this.componentState,
            [id]: {
              ...this.componentState[id],
              loadingCount: Math.max((this.componentState[id]?.loadingCount || 0) - 1, 0),
            },
          }
        }
        delete this.pendingLoadTimeouts[loadId]
      }, defer)
      this.pendingLoadTimeouts = { ...this.pendingLoadTimeouts, [loadId]: timeout }
      return () => {
        clearTimeout(timeout)
        this.componentState = {
          ...this.componentState,
          [id]: {
            ...this.componentState[id],
            loadingCount: Math.max((this.componentState[id]?.loadingCount || 0) - 1, 0),
          },
        }
      }
    },

    async resolveComponentData<T extends ComponentData | RootDataWithProps>(
      componentData: T,
      trigger: ResolveDataTrigger
    ) {
      const componentId = 'id' in componentData.props ? componentData.props.id : 'root'
      const parentId = this.state.indexes?.nodes[componentId]?.parentId
      const parentNode = parentId ? this.state.indexes?.nodes[parentId] : null
      const parentData = parentNode?.data ?? null
      const unsetLoading = this.setComponentLoading(componentId, true, 50)

      const result = await resolveComponentData(
        componentData,
        this.config,
        this.metadata,
        () => {},
        async (item) => {
          unsetLoading()
          const id = 'id' in item.props ? item.props.id : 'root'
          if ('type' in item) await this.refreshPermissions({ item: item as ComponentData })
          else await this.refreshPermissions({ root: true })
        },
        trigger,
        parentData
      )
      return result
    },

    resolveAndCommitData() {
      walkAppState(
        this.state as any,
        this.config,
        (content) => content,
        (childItem) => {
          this.resolveComponentData(childItem, 'load').then((resolved) => {
            const state = this.state as any
            const node = state.indexes?.nodes[resolved.node.props.id]
            if (node && resolved.didChange) {
              if (resolved.node.props.id === 'root') {
                this.dispatch({ type: 'replaceRoot', root: toRoot(resolved.node) })
              } else {
                const zoneCompound = `${node.parentId}:${node.zone}`
                const parentZone = state.indexes.zones[zoneCompound]
                const index = parentZone.contentIds.indexOf(resolved.node.props.id)
                this.dispatch({
                  type: 'replace',
                  data: resolved.node,
                  destinationIndex: index,
                  destinationZone: zoneCompound,
                })
              }
            }
          })
          return childItem
        }
      )
    },

    historyBack() {
      if (this.historyIndex <= 0) return
      const prev = this.histories[this.historyIndex - 1]?.state ?? this.initialAppState
      this.dispatch({ type: 'set', state: prev })
      this.historyIndex--
    },

    historyForward() {
      if (this.historyIndex >= this.histories.length - 1) return
      const next = this.histories[this.historyIndex + 1]?.state
      if (next) this.dispatch({ type: 'set', state: next })
      this.historyIndex++
    },

    registerNode(id: string, node: Partial<PuckNodeInstance>) {
      const empty: PuckNodeInstance = {
        id,
        methods: { sync: () => {}, hideOverlay: () => {}, showOverlay: () => {} },
        element: null,
      }
      this.nodes = {
        ...this.nodes,
        [id]: { ...empty, ...this.nodes[id], ...node, id },
      }
    },

    unregisterNode(id: string) {
      const next = { ...this.nodes }
      delete next[id]
      this.nodes = next
    },

    getPermissions(params?: { item?: ComponentData; type?: string; root?: boolean }): Permissions {
      const { item, type, root } = params ?? {}
      const { globalPermissions, resolvedPermissions } = this
      if (item) {
        const compConfig = this.config.components[item.type]
        const initial = { ...globalPermissions, ...(compConfig?.permissions || {}) }
        const resolved = resolvedPermissions[item.props.id]
        return (resolved ? { ...globalPermissions, ...resolved } : initial) as Permissions
      }
      if (type) {
        const compConfig = this.config.components[type]
        return { ...globalPermissions, ...(compConfig?.permissions || {}) } as Permissions
      }
      if (root) {
        const initial = { ...globalPermissions, ...(this.config.root?.permissions || {}) }
        const resolved = resolvedPermissions['root']
        return (resolved ? { ...globalPermissions, ...resolved } : initial) as Permissions
      }
      return globalPermissions
    },

    async refreshPermissions(params?: { item?: ComponentData; root?: boolean }) {
      if (!params?.item && !params?.root) {
        flattenData(this.state as any, this.config).forEach((item) => {
          this.refreshPermissions({ item })
        })
        return
      }
      if (params.root) {
        const rootData = {
          type: 'root',
          props: { ...(this.state.data.root as any).props, id: 'root' },
        } as ComponentData
        await this.refreshPermissions({ item: rootData })
        return
      }
      const item = params.item!
      const compConfig = item.type === 'root' ? this.config.root : this.config.components[item.type]
      if (!compConfig?.resolvePermissions) return
      const cacheEntry = this.permissionsCache[item.props.id]
      const changed = getChanged(item, cacheEntry?.lastData)
      const parentId = (this.state as any).indexes?.nodes[item.props.id]?.parentId
      const parentData = parentId
        ? (this.state as any).indexes?.nodes[parentId]?.data ?? null
        : null
      const resolved = await compConfig.resolvePermissions(item, {
        changed,
        lastPermissions: cacheEntry?.lastPermissions || {},
        permissions: { ...this.globalPermissions, ...(compConfig.permissions || {}) },
        appState: makeStatePublic(this.state as any),
        lastData: cacheEntry?.lastData || null,
        parent: parentData,
      })
      this.permissionsCache = {
        ...this.permissionsCache,
        [item.props.id]: { lastParentId: parentId, lastData: item, lastPermissions: resolved },
      }
      this.resolvedPermissions = {
        ...this.resolvedPermissions,
        [item.props.id]: resolved,
      }
    },
  },
})
