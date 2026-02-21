<template>
  <div class="puck-dnd-context" :class="{ 'is-dragging': isDragging }">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useDragState } from '@@/composables/puck/useDragState'
import { usePuckStore } from '@@/stores/puck'
import { rootDroppableId } from '@@/lib/puck/root-droppable-id'

const store = usePuckStore()
const { isDragging } = useDragState()

provide('puck-dnd', {
  onInsert(componentType: string, zone: string, index: number) {
    store.dispatch({
      type: 'insert',
      componentType,
      destinationZone: zone || rootDroppableId,
      destinationIndex: index,
    })
  },
  onMove(sourceId: string, targetZone: string, targetIndex: number) {
    const items = store.state.data.content
    const sourceIndex = items.findIndex((item: any) => item.props?.id === sourceId)
    if (sourceIndex < 0) return
    store.dispatch({
      type: 'move',
      sourceIndex,
      sourceZone: rootDroppableId,
      destinationIndex: targetIndex,
      destinationZone: targetZone || rootDroppableId,
    })
  },
  onReorder(sourceIndex: number, destinationIndex: number, zone: string) {
    store.dispatch({
      type: 'reorder',
      sourceIndex,
      destinationIndex,
      destinationZone: zone || rootDroppableId,
    })
  },
})
</script>

<style scoped>
.puck-dnd-context { display: contents; }
.puck-dnd-context.is-dragging { cursor: grabbing; }
</style>
