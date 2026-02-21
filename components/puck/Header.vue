<template>
  <div class="puck-header">
    <slot name="actions" />
    <PuckButton
      label="Publish"
      severity="primary"
      @click="$emit('publish')"
    />
  </div>
</template>

<script setup lang="ts">
defineEmits<{ (e: 'publish'): void }>()
</script>

<style scoped>
.puck-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
</style>
