<template>
  <div class="puck-slot-render">
    <div v-for="item in content" :key="item.props?.id">
      <component
        v-if="getRenderer(item.type)"
        :is="getRenderer(item.type)"
        v-bind="item.props || {}"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  content: any[]
  config: any
}>()

function getRenderer(type: string) {
  return props.config?.components?.[type]?.render || null
}
</script>
