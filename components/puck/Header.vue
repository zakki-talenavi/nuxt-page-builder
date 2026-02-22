<template>
  <header class="puck-header">
    <div class="puck-header__left">
      <svg class="puck-logo" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 3v18M3 9h6" />
      </svg>
      <span class="puck-header__title">{{ title || 'Puck Editor' }}</span>
      <code v-if="headerPath" class="puck-header__path">{{ headerPath }}</code>
    </div>
    <div class="puck-header__right">
      <slot name="headerActions" :path="headerPath" />
      <button class="puck-btn puck-btn--ghost" @click="$emit('undo')" :disabled="!canUndo" title="Undo">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7v6h6"/><path d="M3 13a9 9 0 1 0 2.6-6.4L3 9"/></svg>
      </button>
      <button class="puck-btn puck-btn--ghost" @click="$emit('redo')" :disabled="!canRedo" title="Redo">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 7v6h-6"/><path d="M21 13a9 9 0 1 1-2.6-6.4L21 9"/></svg>
      </button>
      <div class="puck-header__divider" />
      <button class="puck-btn puck-btn--ghost" @click="$emit('openHelp')" title="Bantuan & shortcut">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        Bantuan
      </button>
      <button class="puck-btn puck-btn--outline" @click="$emit('toggleJson')" title="View JSON Schema">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h1"/><path d="M16 3h1a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-1"/><path d="M12 8v4l2 2"/></svg>
        JSON
      </button>
      <button class="puck-btn puck-btn--primary" @click="$emit('publish')">Publish</button>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  headerPath?: string
  canUndo?: boolean
  canRedo?: boolean
}>()
defineEmits<{
  (e: 'undo'): void
  (e: 'redo'): void
  (e: 'publish'): void
  (e: 'toggleJson'): void
  (e: 'openHelp'): void
}>()
</script>

<style scoped>
.puck-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 48px;
  border-bottom: 1px solid #e5e7eb;
  background: #fff;
  flex-shrink: 0;
}
.puck-header__left { display: flex; align-items: center; gap: 10px; }
.puck-logo { color: #6366f1; }
.puck-header__title { font-weight: 600; font-size: 14px; color: #1f2937; }
.puck-header__path { margin-left: 8px; font-size: 12px; color: #6b7280; background: #f3f4f6; padding: 2px 6px; border-radius: 4px; }
.puck-header__right { display: flex; align-items: center; gap: 4px; }
.puck-header__divider { width: 1px; height: 20px; background: #e5e7eb; margin: 0 8px; }
.puck-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 14px; font-size: 13px; font-weight: 500;
  border-radius: 6px; border: none; cursor: pointer;
  transition: all 0.15s ease; color: #1f2937;
}
.puck-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.puck-btn--primary { background: #6366f1; color: #fff; }
.puck-btn--primary:hover:not(:disabled) { background: #4f46e5; }
.puck-btn--ghost { background: transparent; color: #6b7280; padding: 6px; }
.puck-btn--ghost:hover:not(:disabled) { background: #f3f4f6; color: #1f2937; }
.puck-btn--outline { background: transparent; border: 1px solid #e5e7eb; color: #374151; }
.puck-btn--outline:hover:not(:disabled) { background: #f3f4f6; border-color: #6366f1; color: #6366f1; }
</style>
