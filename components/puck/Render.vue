<template>
  <div class="puck-render">
    <div
      v-for="(item, i) in content"
      :key="item.props?.id || i"
      class="puck-render-item"
    >
      <component
        v-if="getComponent(item.type)"
        :is="getComponent(item.type)"
        v-bind="item.props || {}"
      />
      <div v-else class="puck-render-unknown">{{ item.type }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  config: any
  data: any
  metadata?: Record<string, any>
}>()

const content = computed(() => props.data?.content || [])

function getComponent(type: string) {
  return props.config?.components?.[type]?.render ?? null
}
</script>

<style scoped>
.puck-render-item {
  margin-bottom: 0;
}
.puck-render-unknown {
  padding: 16px;
  color: #9ca3af;
  text-align: center;
  border: 1px dashed #d1d5db;
  border-radius: 4px;
}
</style>
