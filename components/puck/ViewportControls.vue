<template>
  <div class="puck-viewport-controls" v-if="visible">
    <button
      v-for="vp in viewports"
      :key="vp.label"
      class="puck-viewport-btn"
      :class="{ active: isActive(vp) }"
      :title="vp.label"
      @click="$emit('change', vp)"
    >
      <svg v-if="vp.width <= 480" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>
      <svg v-else-if="vp.width <= 768" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="3" width="16" height="18" rx="2"/><line x1="12" y1="17" x2="12" y2="17"/></svg>
      <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
      <span>{{ vp.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  viewports: { width: number; height?: number | 'auto'; label: string }[]
  currentWidth: number | '100%'
  visible: boolean
}>()

defineEmits<{
  (e: 'change', viewport: { width: number; height?: number | 'auto'; label: string }): void
}>()

function isActive(vp: { width: number }) {
  return props.currentWidth === vp.width
}
</script>

<style scoped>
.puck-viewport-controls { display: flex; gap: 2px; padding: 4px; background: #fff; border-radius: 8px; border: 1px solid #e5e7eb; }
.puck-viewport-btn {
  display: flex; align-items: center; gap: 4px; padding: 4px 8px;
  font-size: 11px; font-weight: 500; border: none; background: transparent;
  color: #9ca3af; cursor: pointer; border-radius: 4px; transition: all 0.15s;
}
.puck-viewport-btn:hover { color: #6b7280; background: #f3f4f6; }
.puck-viewport-btn.active { color: #6366f1; background: #eef2ff; }
</style>
