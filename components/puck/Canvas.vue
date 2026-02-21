<template>
  <div class="puck-canvas" ref="containerRef">
    <div class="puck-canvas__preview">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const containerRef = ref<HTMLElement | null>(null)
</script>

<style scoped>
.puck-canvas {
  padding: 24px;
  min-height: 100%;
}
.puck-canvas__preview {
  max-width: 100%;
  margin: 0 auto;
  background: white;
  min-height: 400px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
