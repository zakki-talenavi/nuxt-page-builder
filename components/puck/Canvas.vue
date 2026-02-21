<template>
  <main
    class="puck-canvas"
    @dragover.prevent
    @drop.prevent="handleDrop"
    @click.self="$emit('deselect')"
  >
    <div class="puck-canvas__viewport">
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

function handleDrop(e: DragEvent) {
  if (store.getPermissions()?.insert === false) return
  const type = e.dataTransfer?.getData('application/puck-component') || e.dataTransfer?.getData('text/plain')
  if (type) emit('drop', type)
}
</script>

<style scoped>
.puck-canvas { flex: 1; background: #f3f4f6; overflow-y: auto; padding: 24px; }
.puck-canvas__viewport { max-width: 960px; margin: 0 auto; min-height: 100%; }
.puck-canvas__empty {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 64px 24px; border: 2px dashed #d1d5db; border-radius: 12px;
  background: #fff; text-align: center;
}
.puck-canvas__empty p { margin: 12px 0 0; color: #9ca3af; font-size: 14px; }
</style>
