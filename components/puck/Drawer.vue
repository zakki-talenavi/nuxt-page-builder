<template>
  <div class="puck-drawer">
    <div
      v-for="item in items"
      :key="item.key"
      class="puck-drawer-item"
      draggable="true"
      @dragstart="onDragStart($event, item.key)"
    >
      <PuckDragIcon />
      <span>{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  items: { key: string; label: string }[]
}>()

const emit = defineEmits<{
  (e: 'dragStart', event: DragEvent, type: string): void
}>()

function onDragStart(e: DragEvent, type: string) {
  e.dataTransfer?.setData('text/plain', type)
  e.dataTransfer?.setData('application/puck-component', type)
  e.dataTransfer!.effectAllowed = 'copy'
}
</script>

<style scoped>
.puck-drawer { display: flex; flex-direction: column; gap: 2px; }
.puck-drawer-item {
  display: flex; align-items: center; gap: 8px; padding: 8px 10px;
  border: 1px solid #e5e7eb; border-radius: 6px;
  cursor: grab; font-size: 13px; color: #374151; background: #fff;
  transition: all 0.15s ease; user-select: none;
}
.puck-drawer-item:hover { background: #f9fafb; border-color: #6366f1; color: #6366f1; }
.puck-drawer-item:active { cursor: grabbing; }
</style>
