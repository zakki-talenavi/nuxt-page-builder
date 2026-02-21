<template>
  <div
    class="puck-resize-handle"
    :class="{ 'is-resizing': isResizing }"
    @mousedown="$emit('mousedown', $event)"
  >
    <div class="puck-resize-handle__line" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isResizing?: boolean
}>()

defineEmits<{
  (e: 'mousedown', event: MouseEvent): void
}>()
</script>

<style scoped>
.puck-resize-handle {
  width: 8px; cursor: col-resize; display: flex;
  align-items: center; justify-content: center;
  flex-shrink: 0; position: relative; z-index: 5;
}
.puck-resize-handle:hover .puck-resize-handle__line,
.puck-resize-handle.is-resizing .puck-resize-handle__line {
  background: #6366f1; width: 3px;
}
.puck-resize-handle__line {
  width: 1px; height: 40px; background: #e5e7eb;
  border-radius: 1px; transition: all 0.15s;
}
</style>
