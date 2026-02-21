<template>
  <nav class="puck-breadcrumbs" v-if="crumbs.length">
    <span
      v-for="(crumb, idx) in crumbs"
      :key="crumb.id"
      class="puck-breadcrumbs__item"
    >
      <button
        class="puck-breadcrumbs__link"
        :class="{ active: idx === crumbs.length - 1 }"
        @click="$emit('navigate', crumb.id)"
      >{{ crumb.label }}</button>
      <span v-if="idx < crumbs.length - 1" class="puck-breadcrumbs__sep">/</span>
    </span>
  </nav>
</template>

<script setup lang="ts">
defineProps<{
  crumbs: { id: string; label: string }[]
}>()

defineEmits<{ (e: 'navigate', id: string): void }>()
</script>

<style scoped>
.puck-breadcrumbs { display: flex; align-items: center; gap: 2px; padding: 4px 8px; font-size: 12px; }
.puck-breadcrumbs__link {
  border: none; background: none; cursor: pointer; padding: 2px 4px;
  border-radius: 3px; color: #6b7280; font-size: 12px; transition: all 0.1s;
}
.puck-breadcrumbs__link:hover { background: #f3f4f6; color: #1f2937; }
.puck-breadcrumbs__link.active { color: #6366f1; font-weight: 600; }
.puck-breadcrumbs__sep { color: #d1d5db; }
</style>
