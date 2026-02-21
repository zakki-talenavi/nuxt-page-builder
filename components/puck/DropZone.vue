<template>
  <div
    class="puck-drop-zone"
    :class="{ 'is-over': isDragOver }"
    @dragover.prevent="isDragOver = true"
    @dragleave="isDragOver = false"
    @drop.prevent="onDrop"
  >
    <slot />
    <div v-if="isDragOver" class="puck-drop-zone__indicator">
      Drop here
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  zone?: string
  allow?: string[]
  disallow?: string[]
}>()

const emit = defineEmits<{
  (e: 'drop', payload: { componentType: string; index?: number }): void
}>()

const isDragOver = ref(false)

function onDrop(e: DragEvent) {
  isDragOver.value = false
  const payload = e.dataTransfer?.getData('application/puck') || e.dataTransfer?.getData('text/plain')
  if (!payload) return
  try {
    const data = JSON.parse(payload)
    emit('drop', data)
  } catch {
    emit('drop', { componentType: payload })
  }
}
</script>

<style scoped>
.puck-drop-zone {
  position: relative;
  min-height: 24px;
  transition: background 0.15s ease;
}
.puck-drop-zone.is-over {
  background: rgba(99, 102, 241, 0.05);
}
.puck-drop-zone__indicator {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #6366f1;
  border-radius: 6px;
  color: #6366f1;
  font-size: 13px;
  font-weight: 600;
  pointer-events: none;
}
</style>
