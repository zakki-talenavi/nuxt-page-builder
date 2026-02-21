<template>
  <!-- Multi-zone layout (Grid / Columns): render each column zone -->
  <template v-if="layoutType === 'multi-zone'">
    <component :is="renderer" v-bind="cleanProps">
      <div
        v-for="colIdx in columnCount"
        :key="colIdx"
        style="min-height: 20px;"
      >
        <PuckRenderItem
          v-for="child in getColumnContent(colIdx - 1)"
          :key="child.props?.id"
          :item="child"
          :config="config"
          :zones="zones"
        />
      </div>
    </component>
  </template>

  <!-- Single-zone layout (Flex): render all zone children -->
  <template v-else-if="layoutType === 'single-zone'">
    <component :is="renderer" v-bind="cleanProps">
      <PuckRenderItem
        v-for="child in flexContent"
        :key="child.props?.id"
        :item="child"
        :config="config"
        :zones="zones"
      />
    </component>
  </template>

  <!-- Regular component -->
  <template v-else>
    <component
      v-if="renderer"
      :is="renderer"
      v-bind="cleanProps"
    />
    <div v-else class="puck-render__unknown">
      Unknown component: {{ item.type }}
    </div>
  </template>
</template>

<script setup lang="ts">
const props = defineProps<{
  item: any
  config: any
  zones: Record<string, any[]>
}>()

const renderer = computed(() => props.config?.components?.[props.item.type]?.render || null)

const layoutType = computed<'multi-zone' | 'single-zone' | 'none'>(() => {
  const type = props.item.type
  if (type === 'Columns' || type === 'Grid') return 'multi-zone'
  if (type === 'Flex') return 'single-zone'
  return 'none'
})

const columnCount = computed(() => {
  const p = props.item.props || {}
  if (props.item.type === 'Columns') return parseInt(String(p.columns)) || 2
  if (props.item.type === 'Grid') return p.numColumns || 4
  return 1
})

const itemId = computed(() => props.item.props?.id || '')

const cleanProps = computed(() => {
  const p = { ...(props.item.props || {}) }
  delete p.id
  return p
})

function getColumnContent(idx: number): any[] {
  const zoneKey = `${itemId.value}:column-${idx}`
  return props.zones?.[zoneKey] || []
}

const flexContent = computed(() => {
  const zoneKey = `${itemId.value}:flex-zone`
  return props.zones?.[zoneKey] || []
})
</script>

<style scoped>
.puck-render__unknown {
  padding: 16px; color: #9ca3af; font-size: 13px;
  border: 1px dashed #d1d5db; border-radius: 4px; margin: 4px 0;
  text-align: center;
}
</style>
