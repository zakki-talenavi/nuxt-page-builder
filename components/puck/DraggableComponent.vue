<template>
  <div
    class="puck-draggable-component"
    :class="{ 'is-selected': isSelected }"
    draggable="true"
    @dragstart="onDragStart"
  >
    <div class="puck-draggable-content">
      <slot />
    </div>
    <div v-if="isSelected" class="puck-action-bar">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  isSelected?: boolean
  componentType?: string
  index?: number
}>()

function onDragStart(e: DragEvent) {
  if (!e.dataTransfer) return
  e.dataTransfer.setData(
    'application/puck',
    JSON.stringify({
      componentType: props.componentType,
      index: props.index,
    })
  )
  e.dataTransfer.effectAllowed = 'move'
}
</script>

<style scoped>
.puck-draggable-component {
  position: relative;
}
.puck-draggable-component.is-selected {
  outline: 2px solid #6366f1;
  outline-offset: 2px;
}
.puck-action-bar {
  position: absolute;
  top: -32px;
  left: 0;
  right: 0;
  display: flex;
  gap: 4px;
  justify-content: center;
  z-index: 10;
}
</style>
