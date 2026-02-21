<template>
  <div class="puck-editor">
    <PuckHeader
      :title="rootTitle"
      :can-undo="canUndo"
      :can-redo="canRedo"
      @undo="store.historyBack()"
      @redo="store.historyForward()"
      @publish="handlePublish"
      @toggle-json="showJsonPanel = !showJsonPanel"
    />

    <PuckDragDropContext>
      <div class="puck-body">
        <PuckLeftSidebar
          :component-list="componentList"
          :items="items"
          :selected-id="selectedId"
          :active-tab="activeLeftTab"
          @update:active-tab="activeLeftTab = $event"
          @select="selectById"
          @drag-start="onDragStart"
        />

        <PuckCanvas
          v-if="!showJsonPanel"
          :items="items"
          :config="store.config"
          :selected-id="selectedId"
          :hovered-id="hoveredId"
          @select="selectById"
          @hover="hoveredId = $event"
          @deselect="deselectAll"
          @drop="onDrop"
          @duplicate="duplicateById"
          @remove="removeById"
          @slot-drop="onSlotDrop"
        />

        <!-- JSON Schema Viewer -->
        <div v-if="showJsonPanel" class="puck-json-panel">
          <div class="puck-json-panel__header">
            <span class="puck-json-panel__title">JSON Schema — puck-data-index</span>
            <div class="puck-json-panel__actions">
              <button class="puck-json-panel__btn" @click="copyJson" :title="copyLabel">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                {{ copyLabel }}
              </button>
              <button class="puck-json-panel__btn" @click="showJsonPanel = false">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                Close
              </button>
            </div>
          </div>
          <div class="puck-json-panel__stats">
            <span>Root fields: {{ Object.keys(jsonData.root?.props || jsonData.root || {}).length }}</span>
            <span>Content items: {{ jsonData.content?.length || 0 }}</span>
            <span>Zones: {{ Object.keys(jsonData.zones || {}).length }}</span>
          </div>
          <pre class="puck-json-panel__code"><code>{{ formattedJson }}</code></pre>
        </div>

        <PuckFieldsSidebar
          v-if="(selectedItem || showPageFields) && !showJsonPanel"
          :selected-item="selectedItem"
          :config="store.config"
          :root-props="rootProps"
          :right-panel="rightPanel"
          @update:right-panel="rightPanel = $event"
          @field-change="onComponentFieldChange"
          @root-field-change="onRootFieldChange"
          @deselect="deselectAll"
        />
      </div>
    </PuckDragDropContext>
  </div>
</template>

<script setup lang="ts">
import { usePuckStore } from '@@/stores/puck'
import { rootDroppableId } from '@@/lib/puck/root-droppable-id'
import { usePuckHotkeys } from '@@/composables/puck/usePuckHotkeys'

const props = defineProps<{
  config: any
  data: any
  metadata?: any
}>()

const emit = defineEmits<{ (e: 'publish', data: any): void }>()

const store = usePuckStore()

provide('puckConfig', computed(() => store.config))

const activeLeftTab = ref('components')
const rightPanel = ref<'component' | 'page'>('page')
const showPageFields = ref(true)
const hoveredId = ref<string | null>(null)
const showJsonPanel = ref(false)
const copyLabel = ref('Copy')

onMounted(() => {
  store.init({ config: props.config, data: props.data, metadata: props.metadata })
  usePuckHotkeys()
})

const items = computed(() => store.state?.data?.content || [])
const rootProps = computed(() => store.state?.data?.root?.props || store.state?.data?.root || {})
const rootTitle = computed(() => rootProps.value?.title || '')

const selectedItem = computed(() => store.selectedItem)
const selectedId = computed(() => selectedItem.value?.props?.id || null)

const canUndo = computed(() => store.history.hasPast())
const canRedo = computed(() => store.history.hasFuture())

const componentList = computed(() =>
  Object.entries(store.config?.components || {}).map(([key, cfg]: [string, any]) => ({
    key,
    label: cfg?.label || key,
  }))
)

const jsonData = computed(() => ({
  root: store.state?.data?.root,
  content: store.state?.data?.content || [],
  zones: store.state?.data?.zones || {},
}))

const formattedJson = computed(() => JSON.stringify(jsonData.value, null, 2))

function copyJson() {
  navigator.clipboard.writeText(formattedJson.value).then(() => {
    copyLabel.value = 'Copied!'
    setTimeout(() => { copyLabel.value = 'Copy' }, 2000)
  })
}

function findNodeLocation(id: string): { zone: string; index: number } | null {
  const nodeInfo = (store.state as any).indexes?.nodes?.[id]
  if (!nodeInfo) return null

  const parentId = nodeInfo.parentId
  const zoneName = nodeInfo.zone
  const zoneCompound = parentId && zoneName ? `${parentId}:${zoneName}` : rootDroppableId
  const zoneIndex = (store.state as any).indexes?.zones?.[zoneCompound]

  if (!zoneIndex) return null
  const index = zoneIndex.contentIds.indexOf(id)
  if (index < 0) return null
  return { zone: zoneCompound, index }
}

function selectById(id: string | null) {
  if (!id) {
    deselectAll()
    return
  }
  const loc = findNodeLocation(id)
  if (loc) {
    store.setUi({ itemSelector: { index: loc.index, zone: loc.zone } })
    rightPanel.value = 'component'
  }
}

function deselectAll() {
  store.setUi({ itemSelector: null })
  hoveredId.value = null
}

function onDragStart(_e: DragEvent, _type: string) {
  // Handled by DnD system
}

function onDrop(componentType: string) {
  if (!store.config?.components?.[componentType]) return
  store.dispatch({
    type: 'insert',
    componentType,
    destinationZone: rootDroppableId,
    destinationIndex: items.value.length,
  })
  nextTick(() => {
    const newContent = store.state?.data?.content || []
    const lastItem = newContent[newContent.length - 1]
    if (lastItem) {
      store.setUi({ itemSelector: { index: newContent.length - 1, zone: rootDroppableId } })
      rightPanel.value = 'component'
    }
  })
}

function onSlotDrop(payload: { componentType?: string; moveId?: string; zone: string; index: number }) {
  if (payload.componentType) {
    if (!store.config?.components?.[payload.componentType]) return
    store.dispatch({
      type: 'insert',
      componentType: payload.componentType,
      destinationZone: payload.zone,
      destinationIndex: payload.index,
    })
    nextTick(() => {
      store.setUi({ itemSelector: { index: payload.index, zone: payload.zone } })
      rightPanel.value = 'component'
    })
  } else if (payload.moveId) {
    const loc = findNodeLocation(payload.moveId)
    if (!loc) return
    store.dispatch({
      type: 'move',
      sourceZone: loc.zone,
      sourceIndex: loc.index,
      destinationZone: payload.zone,
      destinationIndex: payload.index,
    })
  }
}

function duplicateById(id: string) {
  const loc = findNodeLocation(id)
  if (!loc) return
  store.dispatch({
    type: 'duplicate',
    sourceIndex: loc.index,
    sourceZone: loc.zone,
  })
}

function removeById(id: string) {
  const loc = findNodeLocation(id)
  if (!loc) return
  store.dispatch({
    type: 'remove',
    index: loc.index,
    zone: loc.zone,
  })
}

function onComponentFieldChange(fieldKey: string, value: any) {
  if (!selectedItem.value) return
  const selector = store.state.ui.itemSelector
  if (!selector) return
  const updatedData = {
    ...selectedItem.value,
    props: { ...selectedItem.value.props, [fieldKey]: value },
  }
  store.dispatch({
    type: 'replace',
    data: updatedData,
    destinationIndex: selector.index,
    destinationZone: selector.zone || rootDroppableId,
  })
}

function onRootFieldChange(fieldKey: string, value: any) {
  const currentRoot = store.state.data.root
  store.dispatch({
    type: 'replaceRoot',
    root: {
      ...currentRoot,
      props: { ...(currentRoot.props || currentRoot), [fieldKey]: value },
    },
  })
}

function handlePublish() {
  emit('publish', {
    root: store.state.data.root,
    content: store.state.data.content,
    zones: store.state.data.zones,
  })
}
</script>

<style scoped>
.puck-editor {
  display: flex;
  flex-direction: column;
  height: 100vh;
  color: #1f2937;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.5;
}
.puck-body {
  display: flex;
  flex: 1;
  min-height: 0;
}

.puck-json-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #1e1e2e;
  color: #cdd6f4;
  overflow: hidden;
}
.puck-json-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: #181825;
  border-bottom: 1px solid #313244;
  flex-shrink: 0;
}
.puck-json-panel__title {
  font-size: 13px;
  font-weight: 600;
  color: #cba6f7;
}
.puck-json-panel__actions {
  display: flex;
  gap: 6px;
}
.puck-json-panel__btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid #45475a;
  border-radius: 4px;
  background: transparent;
  color: #bac2de;
  cursor: pointer;
  transition: all 0.15s;
}
.puck-json-panel__btn:hover {
  background: #313244;
  border-color: #cba6f7;
  color: #cba6f7;
}
.puck-json-panel__stats {
  display: flex;
  gap: 16px;
  padding: 8px 16px;
  font-size: 12px;
  color: #6c7086;
  border-bottom: 1px solid #313244;
  flex-shrink: 0;
}
.puck-json-panel__code {
  flex: 1;
  overflow: auto;
  margin: 0;
  padding: 16px;
  font-family: 'Cascadia Code', 'Fira Code', 'JetBrains Mono', 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.6;
  tab-size: 2;
  white-space: pre;
  color: #cdd6f4;
}
</style>
