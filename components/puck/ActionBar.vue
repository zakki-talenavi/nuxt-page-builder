<template>
  <div class="puck-action-bar" v-if="visible">
    <span class="puck-action-bar__label">{{ label }}</span>
    <slot />
    <button v-if="canDuplicate" class="puck-action-bar__btn" @click="$emit('duplicate')" title="Duplicate">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
    </button>
    <button v-if="canDelete" class="puck-action-bar__btn puck-action-bar__btn--danger" @click="$emit('delete')" title="Delete">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
    </button>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  visible?: boolean
  label?: string
  canDuplicate?: boolean
  canDelete?: boolean
}>(), {
  visible: true,
  canDuplicate: true,
  canDelete: true,
})

defineEmits<{
  (e: 'duplicate'): void
  (e: 'delete'): void
}>()
</script>

<style scoped>
.puck-action-bar {
  display: flex; align-items: center; gap: 2px; padding: 4px 6px;
  background: #6366f1; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  white-space: nowrap;
}
.puck-action-bar__label { font-size: 11px; font-weight: 600; color: #fff; padding: 0 6px; }
.puck-action-bar__btn {
  display: inline-flex; align-items: center; justify-content: center;
  width: 26px; height: 26px; border: none; background: transparent;
  border-radius: 4px; cursor: pointer; color: rgba(255,255,255,0.8); transition: all 0.1s;
}
.puck-action-bar__btn:hover { background: rgba(255,255,255,0.2); color: #fff; }
.puck-action-bar__btn--danger:hover { background: #ef4444; }
</style>
