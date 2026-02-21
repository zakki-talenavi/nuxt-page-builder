<template>
  <div class="puck-sidebar-section" :class="{ 'no-border-top': noBorderTop }">
    <div v-if="title || $slots.breadcrumbs" class="puck-sidebar-section__header">
      <slot name="breadcrumbs" />
      <h3 v-if="title" class="puck-sidebar-section__title">{{ title }}</h3>
    </div>
    <div class="puck-sidebar-section__body">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  noBorderTop?: boolean
  showBreadcrumbs?: boolean
}>()
</script>

<style scoped>
.puck-sidebar-section {
  padding: 12px;
  border-top: 1px solid var(--p-surface-200, #e5e7eb);
}
.puck-sidebar-section.no-border-top {
  border-top: none;
}
.puck-sidebar-section__header {
  margin-bottom: 8px;
}
.puck-sidebar-section__title {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0;
}
</style>
