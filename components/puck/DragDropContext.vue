<template>
  <slot />
</template>

<script setup lang="ts">
const props = defineProps<{
  config?: any
  metadata?: Record<string, any>
}>()

provide('puck:config', computed(() => props.config))
provide('puck:metadata', computed(() => props.metadata ?? {}))
</script>
