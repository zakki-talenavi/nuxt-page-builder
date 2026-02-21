<template>
  <div
    class="puck-draggable"
    :class="{
      'is-selected': isSelected,
      'is-hovered': isHovered && !isSelected,
      'is-dragging': localDragging,
    }"
    :draggable="canDrag"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    @click.stop="$emit('select', id)"
    @mouseenter="$emit('hover', id)"
    @mouseleave="$emit('hover', null)"
  >
    <div v-if="isSelected" class="puck-draggable__action-bar">
      <PuckActionBar
        :label="label"
        :can-duplicate="canDuplicate"
        :can-delete="canDelete"
        @duplicate="$emit('duplicate', id)"
        @delete="$emit('delete', id)"
      />
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  id: string
  label?: string
  isSelected?: boolean
  isHovered?: boolean
  canDrag?: boolean
  canDuplicate?: boolean
  canDelete?: boolean
}>(), {
  canDrag: true,
  canDuplicate: true,
  canDelete: true,
})

defineEmits<{
  (e: 'select', id: string): void
  (e: 'hover', id: string | null): void
  (e: 'duplicate', id: string): void
  (e: 'delete', id: string): void
}>()

const localDragging = ref(false)

function onDragStart(e: DragEvent) {
  localDragging.value = true
  e.dataTransfer?.setData('application/puck-move', props.id)
  e.dataTransfer!.effectAllowed = 'move'
}

function onDragEnd() {
  localDragging.value = false
}
</script>

<style scoped>
.puck-draggable {
  position: relative; border: 2px solid transparent;
  border-radius: 6px; cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.puck-draggable:hover,
.puck-draggable.is-hovered { border-color: #c7d2fe; }
.puck-draggable.is-selected { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
.puck-draggable.is-dragging { opacity: 0.5; }
.puck-draggable__action-bar {
  position: absolute; top: -36px; left: 50%; transform: translateX(-50%); z-index: 10;
}
</style>
