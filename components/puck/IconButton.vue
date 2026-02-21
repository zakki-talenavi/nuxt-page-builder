<template>
  <button
    class="puck-icon-btn"
    :class="{ 'puck-icon-btn--active': active, [`puck-icon-btn--${variant}`]: variant }"
    :disabled="disabled"
    :title="title"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  disabled?: boolean
  active?: boolean
  variant?: 'default' | 'danger' | 'primary'
}>(), { variant: 'default' })

defineEmits<{ (e: 'click'): void }>()
</script>

<style scoped>
.puck-icon-btn {
  display: inline-flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; border: none; background: transparent;
  border-radius: 6px; cursor: pointer; color: #6b7280; transition: all 0.15s;
}
.puck-icon-btn:hover:not(:disabled) { background: #f3f4f6; color: #1f2937; }
.puck-icon-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.puck-icon-btn--active { background: #eef2ff; color: #6366f1; }
.puck-icon-btn--danger:hover:not(:disabled) { background: #fef2f2; color: #ef4444; }
.puck-icon-btn--primary { color: #6366f1; }
</style>
