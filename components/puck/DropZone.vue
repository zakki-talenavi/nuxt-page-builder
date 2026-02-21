<template>
  <div
    class="puck-dropzone"
    :class="{
      'is-drag-over': isDragOver,
      'is-empty': !items.length,
    }"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
    @drop.prevent="onDrop"
  >
    <slot :items="items" :is-drag-over="isDragOver" />

    <div v-if="!items.length && !$slots.default" class="puck-dropzone__placeholder">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M12 8v8M8 12h8"/>
      </svg>
      <p>{{ placeholder }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  zone: string
  items?: any[]
  placeholder?: string
  allowInsert?: boolean
}>(), {
  items: () => [],
  placeholder: 'Drop components here',
  allowInsert: true,
})

const emit = defineEmits<{
  (e: 'drop', payload: { componentType?: string; moveId?: string; zone: string; index: number }): void
}>()

const isDragOver = ref(false)

function onDragOver(e: DragEvent) {
  if (!props.allowInsert) return
  isDragOver.value = true
  e.dataTransfer!.dropEffect = 'copy'
}

function onDragLeave() {
  isDragOver.value = false
}

function onDrop(e: DragEvent) {
  isDragOver.value = false
  if (!props.allowInsert) return

  const moveId = e.dataTransfer?.getData('application/puck-move')
  const componentType = e.dataTransfer?.getData('application/puck-component') || e.dataTransfer?.getData('text/plain')

  if (moveId) {
    emit('drop', { moveId, zone: props.zone, index: props.items.length })
  } else if (componentType) {
    emit('drop', { componentType, zone: props.zone, index: props.items.length })
  }
}
</script>

<style scoped>
.puck-dropzone {
  min-height: 40px; transition: all 0.15s;
}
.puck-dropzone.is-drag-over {
  background: rgba(99, 102, 241, 0.05);
  outline: 2px dashed #6366f1;
  outline-offset: -2px;
  border-radius: 6px;
}
.puck-dropzone__placeholder {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 48px 24px; border: 2px dashed #d1d5db; border-radius: 12px;
  background: #fff; text-align: center;
}
.puck-dropzone__placeholder p { margin: 8px 0 0; color: #9ca3af; font-size: 14px; }
</style>
