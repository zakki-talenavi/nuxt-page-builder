<template>
  <div class="puck-layout">
    <header class="puck-layout__header">
      <slot name="header" />
    </header>
    <div class="puck-layout__main">
      <aside class="puck-layout__sidebar puck-layout__sidebar--left">
        <slot name="sidebar" />
      </aside>
      <main class="puck-layout__canvas">
        <slot name="canvas" />
      </main>
    </div>
  </div>
</template>

<style scoped>
.puck-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.puck-layout__header {
  flex-shrink: 0;
  padding: 8px 16px;
  border-bottom: 1px solid var(--p-surface-200, #e5e7eb);
  display: flex;
  align-items: center;
  gap: 8px;
}
.puck-layout__main {
  flex: 1;
  display: flex;
  min-height: 0;
}
.puck-layout__sidebar {
  flex-shrink: 0;
  width: 280px;
  border-right: 1px solid var(--p-surface-200, #e5e7eb);
  overflow-y: auto;
}
.puck-layout__canvas {
  flex: 1;
  overflow: auto;
  background: var(--p-surface-100, #f3f4f6);
}
</style>
