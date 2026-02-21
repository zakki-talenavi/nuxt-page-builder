<template>
  <div class="puck-field-label" :class="{ 'read-only': readOnly }">
    <label v-if="label" class="puck-field-label__label">
      <slot name="icon" />
      {{ label }}
    </label>
    <div class="puck-field-label__content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label?: string
  readOnly?: boolean
}>()
</script>

<style scoped>
.puck-field-label {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.puck-field-label__label {
  font-weight: 500;
  font-size: 0.875rem;
}
.puck-field-label.read-only .puck-field-label__content {
  opacity: 0.8;
}
</style>
