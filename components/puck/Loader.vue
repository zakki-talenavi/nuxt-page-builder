<template>
  <div class="puck-loader" :class="{ 'puck-loader--sm': size === 'sm', 'puck-loader--lg': size === 'lg' }">
    <div class="puck-loader__spinner" />
    <span v-if="label" class="puck-loader__label">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  size?: 'sm' | 'md' | 'lg'
  label?: string
}>(), { size: 'md' })
</script>

<style scoped>
.puck-loader { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 16px; }
.puck-loader__spinner {
  width: 24px; height: 24px; border: 3px solid #e5e7eb;
  border-top-color: #6366f1; border-radius: 50%;
  animation: puck-spin 0.6s linear infinite;
}
.puck-loader--sm .puck-loader__spinner { width: 16px; height: 16px; border-width: 2px; }
.puck-loader--lg .puck-loader__spinner { width: 32px; height: 32px; border-width: 4px; }
.puck-loader__label { font-size: 13px; color: #6b7280; }
@keyframes puck-spin { to { transform: rotate(360deg); } }
</style>
