<template>
  <div class="puck-editor">
    <PuckHeader
      :title="rootTitle"
      :can-undo="canUndo"
      :can-redo="canRedo"
      @undo="store.historyBack()"
      @redo="store.historyForward()"
      @publish="handlePublish"
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
        />

        <PuckFieldsSidebar
          v-if="selectedItem || showPageFields"
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

const activeLeftTab = ref('components')
const rightPanel = ref<'component' | 'page'>('page')
const showPageFields = ref(true)
const hoveredId = ref<string | null>(null)

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

function selectById(id: string | null) {
  if (!id) {
    deselectAll()
    return
  }
  const index = items.value.findIndex((item: any) => item.props?.id === id)
  if (index >= 0) {
    store.setUi({ itemSelector: { index, zone: rootDroppableId } })
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
  const newIndex = items.value.length - 1
  store.setUi({ itemSelector: { index: newIndex, zone: rootDroppableId } })
  rightPanel.value = 'component'
}

function duplicateById(id: string) {
  const index = items.value.findIndex((item: any) => item.props?.id === id)
  if (index < 0) return
  store.dispatch({
    type: 'duplicate',
    sourceIndex: index,
    sourceZone: rootDroppableId,
  })
}

function removeById(id: string) {
  const index = items.value.findIndex((item: any) => item.props?.id === id)
  if (index < 0) return
  store.dispatch({
    type: 'remove',
    index,
    zone: rootDroppableId,
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
</style>
