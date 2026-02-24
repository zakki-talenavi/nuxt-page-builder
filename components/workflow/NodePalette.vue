<template>
  <Panel header="Node" class="node-palette">
    <template #header>
      <span class="node-palette__header">
        <i class="pi pi-list node-palette__header-icon" />
        Node
      </span>
    </template>
    <div class="node-palette__search">
      <span class="p-input-icon-left node-palette__search-wrap">
        <i class="pi pi-search" />
        <InputText
          v-model="search"
          type="text"
          placeholder="Cari node..."
          class="node-palette__input"
        />
      </span>
    </div>
    <div class="node-palette__list">
      <template v-for="cat in categories" :key="cat.key">
        <h4 class="node-palette__category">{{ cat.label }}</h4>
        <div
          v-for="desc in filteredByCategory(cat.key)"
          :key="desc.type"
          class="node-palette__item"
          draggable="true"
          @dragstart="onDragStart($event, desc)"
        >
          <i :class="['pi', desc.icon || 'pi-circle', 'node-palette__icon']" />
          <span class="node-palette__label">{{ desc.label }}</span>
        </div>
      </template>
    </div>
  </Panel>
</template>

<script setup lang="ts">
import Panel from 'primevue/panel'
import InputText from 'primevue/inputtext'
import type { NodeTypeDescriptor } from '~~/types/workflow'
import { NODE_TYPE_DESCRIPTORS } from '~~/lib/workflow/descriptors'
import { computed, ref } from 'vue'

const search = ref('')

const categories = [
  { key: 'trigger' as const, label: 'Trigger' },
  { key: 'condition' as const, label: 'Condition' },
  { key: 'action' as const, label: 'Action' },
]

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return NODE_TYPE_DESCRIPTORS
  return NODE_TYPE_DESCRIPTORS.filter(
    (d) =>
      d.label.toLowerCase().includes(q) ||
      d.type.toLowerCase().includes(q)
  )
})

function filteredByCategory(category: NodeTypeDescriptor['category']) {
  return filtered.value.filter((d) => d.category === category)
}

const emit = defineEmits<{
  dragStart: [descriptor: NodeTypeDescriptor]
}>()

function onDragStart(e: DragEvent, desc: NodeTypeDescriptor) {
  if (!e.dataTransfer) return
  e.dataTransfer.setData('application/json', JSON.stringify(desc))
  e.dataTransfer.effectAllowed = 'copy'
  emit('dragStart', desc)
}
</script>

<style scoped>
.node-palette {
  height: 100%;
  display: flex;
  flex-direction: column;
  border: none;
  border-radius: 0;
}
.node-palette :deep(.p-panel) {
  height: 100%;
  display: flex;
  flex-direction: column;
  border: none;
  background: var(--p-surface-section, #f8fafc);
}
.node-palette :deep(.p-panel-content) {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: var(--p-content-padding, 1rem);
  border-top: 1px solid var(--p-surface-border, #e2e8f0);
}
.node-palette__header {
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--p-text-muted-color, #64748b);
}
.node-palette__header-icon {
  margin-right: 0.5rem;
  color: var(--p-primary-color, #6366f1);
}
.node-palette__search {
  margin-bottom: 0.75rem;
}
.node-palette__search-wrap {
  width: 100%;
}
.node-palette__search-wrap :deep(.p-inputtext) {
  width: 100%;
  padding-left: 2.25rem;
  font-size: 0.875rem;
}
.node-palette__list {
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
}
.node-palette__category {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--p-text-muted-color, #64748b);
  margin: 1rem 0 0.5rem;
  padding: 0 2px;
}
.node-palette__category:first-child {
  margin-top: 0;
}
.node-palette__item {
  display: flex;
  align-items: center;
  gap: var(--p-inline-spacing, 0.5rem);
  padding: 0.5rem 0.75rem;
  border-radius: var(--p-border-radius, 6px);
  cursor: grab;
  margin-bottom: 0.25rem;
  color: var(--p-text-color, #1e293b);
  background: var(--p-surface-0, #fff);
  border: 1px solid var(--p-surface-border, #e2e8f0);
  transition: background 0.15s ease, border-color 0.15s ease;
}
.node-palette__item:hover {
  background: var(--p-surface-hover, #f1f5f9);
  border-color: var(--p-surface-hover-border, #cbd5e1);
}
.node-palette__icon {
  font-size: 1rem;
  color: var(--p-primary-color, #6366f1);
}
.node-palette__label {
  font-size: 0.875rem;
}
</style>
