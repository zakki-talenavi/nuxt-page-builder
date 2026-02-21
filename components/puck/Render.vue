<template>
  <div class="puck-render">
    <div v-for="item in content" :key="item.props?.id">
      <component
        v-if="getRenderer(item.type)"
        :is="getRenderer(item.type)"
        v-bind="item.props || {}"
      />
      <div v-else class="puck-render__unknown">
        Unknown component: {{ item.type }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  config: any
  data: any
}>()

const content = computed(() => props.data?.content || [])

function getRenderer(type: string) {
  return props.config?.components?.[type]?.render || null
}
</script>

<style scoped>
.puck-render__unknown {
  padding: 16px; color: #9ca3af; font-size: 13px;
  border: 1px dashed #d1d5db; border-radius: 4px; margin: 4px 0;
  text-align: center;
}
</style>
