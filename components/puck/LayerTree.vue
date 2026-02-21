<template>
  <div class="puck-layer-tree">
    <div v-if="!items.length" class="puck-layer-tree__empty">No components added yet</div>
    <div
      v-for="(item, idx) in items"
      :key="item.props?.id"
      class="puck-layer-tree__item"
      :class="{
        'is-selected': selectedId === item.props?.id,
        'is-hovered': hoveredId === item.props?.id
      }"
      :style="{ paddingLeft: `${depth * 16 + 8}px` }"
      @click.stop="$emit('select', item.props?.id)"
      @mouseenter="$emit('hover', item.props?.id)"
      @mouseleave="$emit('hover', null)"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
      </svg>
      <span class="puck-layer-tree__label">{{ getLabel(item.type) }}</span>
      <span class="puck-layer-tree__type">{{ item.type }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  items: any[]
  selectedId: string | null
  hoveredId: string | null
  config: any
  depth?: number
}>()

defineEmits<{
  (e: 'select', id: string): void
  (e: 'hover', id: string | null): void
}>()

const depth = props.depth ?? 0

function getLabel(type: string) {
  return props.config?.components?.[type]?.label || type
}
</script>

<style scoped>
.puck-layer-tree { display: flex; flex-direction: column; }
.puck-layer-tree__empty { color: #9ca3af; font-size: 13px; text-align: center; padding: 24px 12px; }
.puck-layer-tree__item {
  display: flex; align-items: center; gap: 6px; padding: 5px 8px;
  cursor: pointer; font-size: 13px; color: #374151; transition: background 0.1s;
  border-left: 2px solid transparent;
}
.puck-layer-tree__item:hover { background: #f3f4f6; }
.puck-layer-tree__item.is-selected { background: #eef2ff; color: #6366f1; border-left-color: #6366f1; }
.puck-layer-tree__item.is-hovered { background: #f5f3ff; }
.puck-layer-tree__label { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.puck-layer-tree__type { font-size: 10px; color: #9ca3af; text-transform: uppercase; }
</style>
