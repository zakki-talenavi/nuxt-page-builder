<template>
  <div class="puck-layer-tree">
    <div v-if="!items.length" class="puck-layer-tree__empty">No components added yet</div>
    <template v-for="(item, idx) in items" :key="item.props?.id ?? `outline-${depth}-${idx}`">
      <div class="puck-layer-tree__row">
        <div
          class="puck-layer-tree__item"
          :class="{
            'is-selected': selectedId === item.props?.id,
            'is-hovered': hoveredId === item.props?.id,
            'is-dragging': draggingId === item.props?.id,
            'is-drop-before': dragOverTargetId === item.props?.id && dragOverPosition === 'before',
            'is-drop-after': dragOverTargetId === item.props?.id && dragOverPosition === 'after',
          }"
          :style="{ paddingLeft: `${depth * 16 + 8}px` }"
          draggable="true"
          @click.stop="$emit('select', item.props?.id)"
          @mouseenter="$emit('hover', item.props?.id)"
          @mouseleave="$emit('hover', null)"
          @dragstart="onDragStart($event, item)"
          @dragend="onDragEnd"
          @dragover.prevent="onDragOver($event, item)"
          @dragenter="onDragEnter($event, item)"
          @dragleave="onDragLeave"
          @drop="onDrop($event, item)"
        >
          <svg class="puck-layer-tree__drag-handle" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/>
          </svg>
          <svg class="puck-layer-tree__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
          </svg>
          <span class="puck-layer-tree__label">{{ getLabel(item.type) }}</span>
          <span class="puck-layer-tree__type">{{ item.type }}</span>
        </div>
        <PuckLayerTree
          v-if="item.children?.length"
          :items="item.children"
          :selected-id="selectedId"
          :hovered-id="hoveredId"
          :config="config"
          :depth="depth + 1"
          @select="$emit('select', $event)"
          @hover="$emit('hover', $event)"
          @outlineDrop="$emit('outlineDrop', $event)"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  items: any[]
  selectedId: string | null
  hoveredId: string | null
  config: any
  depth?: number
}>()

const emit = defineEmits<{
  (e: 'select', id: string): void
  (e: 'hover', id: string | null): void
  (e: 'outlineDrop', payload: { draggedId: string; targetId: string; position: 'before' | 'after' }): void
}>()

const depth = props.depth ?? 0

const DATA_TRANSFER_OUTLINE = 'application/puck-outline-move'

const draggingId = ref<string | null>(null)
const dragOverTargetId = ref<string | null>(null)
const dragOverPosition = ref<'before' | 'after' | null>(null)

function getLabel(type: string) {
  return props.config?.components?.[type]?.label || type
}

function onDragStart(e: DragEvent, item: any) {
  const id = item.props?.id
  if (!id) return
  draggingId.value = id
  e.dataTransfer?.setData(DATA_TRANSFER_OUTLINE, id)
  e.dataTransfer!.effectAllowed = 'move'
  if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
}

function onDragEnd() {
  draggingId.value = null
  dragOverTargetId.value = null
  dragOverPosition.value = null
}

function updateDropPosition(e: DragEvent, item: any) {
  const targetId = item.props?.id
  if (!targetId) return
  const el = e.currentTarget as HTMLElement
  if (!el) return
  const rect = el.getBoundingClientRect()
  const y = e.clientY - rect.top
  dragOverTargetId.value = targetId
  dragOverPosition.value = y < rect.height / 2 ? 'before' : 'after'
}

function onDragOver(e: DragEvent, item: any) {
  if (!e.dataTransfer?.types.includes(DATA_TRANSFER_OUTLINE)) return
  e.dataTransfer.dropEffect = 'move'
  updateDropPosition(e, item)
}

function onDragEnter(e: DragEvent, item: any) {
  if (!e.dataTransfer?.types.includes(DATA_TRANSFER_OUTLINE)) return
  updateDropPosition(e, item)
}

function onDragLeave() {
  dragOverTargetId.value = null
  dragOverPosition.value = null
}

function onDrop(e: DragEvent, item: any) {
  e.preventDefault()
  const draggedId = e.dataTransfer?.getData(DATA_TRANSFER_OUTLINE)
  const targetId = item.props?.id
  if (!draggedId || !targetId || draggedId === targetId) {
    onDragEnd()
    return
  }
  const el = e.currentTarget as HTMLElement
  const rect = el?.getBoundingClientRect()
  const y = rect ? e.clientY - rect.top : 0
  const position = rect && y < rect.height / 2 ? 'before' : 'after'
  emit('outlineDrop', { draggedId, targetId, position })
  onDragEnd()
}
</script>

<style scoped>
.puck-layer-tree { display: flex; flex-direction: column; }
.puck-layer-tree__row { display: contents; }
.puck-layer-tree__empty { color: #9ca3af; font-size: 13px; text-align: center; padding: 24px 12px; }
.puck-layer-tree__item {
  display: flex; align-items: center; gap: 6px; padding: 5px 8px;
  cursor: pointer; font-size: 13px; color: #374151; transition: background 0.1s;
  border-left: 2px solid transparent; position: relative;
}
.puck-layer-tree__item:hover { background: #f3f4f6; }
.puck-layer-tree__item.is-selected { background: #eef2ff; color: #6366f1; border-left-color: #6366f1; }
.puck-layer-tree__item.is-hovered { background: #f5f3ff; }
.puck-layer-tree__item.is-dragging { opacity: 0.5; }
.puck-layer-tree__item.is-drop-before::before,
.puck-layer-tree__item.is-drop-after::after {
  content: ''; position: absolute; left: 0; right: 0; height: 2px;
  background: #6366f1; z-index: 1; pointer-events: none;
}
.puck-layer-tree__item.is-drop-before::before { top: 0; }
.puck-layer-tree__item.is-drop-after::after { bottom: 0; }
.puck-layer-tree__drag-handle {
  flex-shrink: 0; color: #d1d5db; cursor: grab;
}
.puck-layer-tree__item:active .puck-layer-tree__drag-handle { cursor: grabbing; }
.puck-layer-tree__icon { flex-shrink: 0; }
.puck-layer-tree__label { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.puck-layer-tree__type { font-size: 10px; color: #9ca3af; text-transform: uppercase; flex-shrink: 0; }
</style>
