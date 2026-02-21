<template>
  <main
    class="puck-canvas"
    @dragover.prevent
    @drop.prevent="handleDrop"
    @click.self="$emit('deselect')"
  >
    <div class="puck-canvas__viewport">
      <div
        v-for="item in items"
        :key="item.props?.id"
        class="puck-canvas-item"
        :class="{
          'is-selected': selectedId === item.props?.id,
          'is-hovered': hoveredId === item.props?.id && selectedId !== item.props?.id
        }"
        @click.stop="$emit('select', item.props?.id)"
        @mouseenter="$emit('hover', item.props?.id)"
        @mouseleave="$emit('hover', null)"
      >
        <div v-if="selectedId === item.props?.id" class="puck-canvas-item__actions">
          <span class="puck-canvas-item__label">{{ getLabel(item.type) }}</span>
          <button v-if="canDuplicate(item)" class="puck-action-btn" @click.stop="$emit('duplicate', item.props?.id)" title="Duplicate">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          </button>
          <button v-if="canDelete(item)" class="puck-action-btn puck-action-btn--danger" @click.stop="$emit('remove', item.props?.id)" title="Delete">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
        <component
          v-if="getRenderer(item.type)"
          :is="getRenderer(item.type)"
          v-bind="item.props || {}"
        />
        <div v-else class="puck-canvas-item__placeholder">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8M8 12h8"/></svg>
          <span>{{ item.type }}</span>
        </div>
      </div>

      <div v-if="!items.length" class="puck-canvas__empty">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <path d="M12 8v8M8 12h8"/>
        </svg>
        <p>Drag components here to start building</p>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { usePuckStore } from '@@/stores/puck'

const store = usePuckStore()

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
}>()

function getLabel(type: string) {
  return props.config?.components?.[type]?.label || type
}

function getRenderer(type: string) {
  return props.config?.components?.[type]?.render || null
}

function canDuplicate(item: any): boolean {
  return store.getPermissions({ item })?.duplicate !== false
}

function canDelete(item: any): boolean {
  return store.getPermissions({ item })?.delete !== false
}

function canInsert(): boolean {
  return store.getPermissions()?.insert !== false
}

function handleDrop(e: DragEvent) {
  if (!canInsert()) return
  const type = e.dataTransfer?.getData('text/plain')
  if (type) emit('drop', type)
}
</script>

<style scoped>
.puck-canvas { flex: 1; background: #f3f4f6; overflow-y: auto; padding: 24px; }
.puck-canvas__viewport { max-width: 960px; margin: 0 auto; min-height: 100%; }
.puck-canvas-item {
  position: relative; background: #fff; border-radius: 6px;
  margin-bottom: 8px; border: 2px solid transparent;
  cursor: pointer; transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.puck-canvas-item:hover,
.puck-canvas-item.is-hovered { border-color: #c7d2fe; }
.puck-canvas-item.is-selected { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1); }
.puck-canvas-item__actions {
  position: absolute; top: -36px; left: 50%; transform: translateX(-50%);
  display: flex; align-items: center; gap: 2px; padding: 4px 6px;
  background: #6366f1; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  z-index: 10; white-space: nowrap;
}
.puck-canvas-item__label { font-size: 11px; font-weight: 600; color: #fff; padding: 0 6px; }
.puck-action-btn {
  display: inline-flex; align-items: center; justify-content: center;
  width: 26px; height: 26px; border: none; background: transparent;
  border-radius: 4px; cursor: pointer; color: rgba(255,255,255,0.8);
  transition: all 0.1s ease;
}
.puck-action-btn:hover { background: rgba(255,255,255,0.2); color: #fff; }
.puck-action-btn--danger:hover { background: #ef4444; color: #fff; }
.puck-canvas-item__placeholder {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 24px; color: #9ca3af; border: 1px dashed #d1d5db;
  border-radius: 4px; margin: 4px;
}
.puck-canvas__empty {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 64px 24px; border: 2px dashed #d1d5db; border-radius: 12px;
  background: #fff; text-align: center;
}
.puck-canvas__empty p { margin: 12px 0 0; color: #9ca3af; font-size: 14px; }
</style>
