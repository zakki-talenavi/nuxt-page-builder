<template>
  <Button
    v-bind="$attrs"
    :label="label"
    :icon="icon"
    :severity="severity"
    :outlined="outlined"
    :text="text"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <template v-if="$slots.default">
      <slot />
    </template>
  </Button>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })
defineProps<{
  label?: string
  icon?: string
  severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'contrast'
  outlined?: boolean
  text?: boolean
  disabled?: boolean
}>()
defineEmits<{ (e: 'click', ev: Event): void }>()
</script>
