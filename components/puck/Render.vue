<template>
  <div class="puck-render" role="article">
    <PuckRenderItem
      v-for="item in content"
      :key="item.props?.id"
      :item="item"
      :config="config"
      :zones="zones"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  config: any
  data: any
}>()

const EMPTY_ZONES: Record<string, any[]> = Object.freeze({})

provide('puckRenderConfig', props.config)
provide('puckRenderZones', props.data?.zones ?? EMPTY_ZONES)

const content = computed(() => props.data?.content || [])
const zones = computed(() => props.data?.zones ?? EMPTY_ZONES)
</script>

<style scoped>
.puck-render {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow-x: hidden;
}
.puck-render__unknown {
  padding: 16px; color: #9ca3af; font-size: 13px;
  border: 1px dashed #d1d5db; border-radius: 4px; margin: 4px 0;
  text-align: center;
}
</style>
