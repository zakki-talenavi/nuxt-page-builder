<template>
  <div class="puck-nav">
    <button
      v-for="item in items"
      :key="item.id"
      class="puck-nav__item"
      :class="{ active: modelValue === item.id }"
      @click="$emit('update:modelValue', item.id)"
    >
      <span v-if="item.icon" class="puck-nav__icon" v-html="item.icon" />
      <span class="puck-nav__label">{{ item.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  items: { id: string; label: string; icon?: string }[]
  modelValue: string
}>()

defineEmits<{
  (e: 'update:modelValue', id: string): void
}>()
</script>

<style scoped>
.puck-nav { display: flex; border-bottom: 1px solid #e5e7eb; flex-shrink: 0; }
.puck-nav__item {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 4px;
  padding: 10px 12px; font-size: 12px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.05em; border: none;
  background: transparent; cursor: pointer; color: #9ca3af;
  border-bottom: 2px solid transparent; transition: all 0.15s;
}
.puck-nav__item:hover { color: #6b7280; }
.puck-nav__item.active { color: #6366f1; border-bottom-color: #6366f1; }
.puck-nav__icon { display: flex; }
</style>
