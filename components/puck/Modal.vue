<template>
  <Teleport to="body">
    <Transition name="puck-modal">
      <div v-if="modelValue" class="puck-modal-overlay" @click.self="close">
        <div class="puck-modal" :style="{ maxWidth: maxWidth + 'px' }">
          <div class="puck-modal__header">
            <h3 class="puck-modal__title">{{ title }}</h3>
            <button class="puck-modal__close" @click="close" title="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="puck-modal__body"><slot /></div>
          <div v-if="$slots.footer" class="puck-modal__footer"><slot name="footer" /></div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  modelValue: boolean
  title?: string
  maxWidth?: number
}>(), { title: '', maxWidth: 560 })

const emit = defineEmits<{ (e: 'update:modelValue', val: boolean): void }>()
function close() { emit('update:modelValue', false) }
</script>

<style scoped>
.puck-modal-overlay {
  position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center;
  justify-content: center; background: rgba(0,0,0,0.4); backdrop-filter: blur(2px);
}
.puck-modal {
  background: #fff; border-radius: 12px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  overflow: hidden; display: flex; flex-direction: column; max-height: 80vh;
}
.puck-modal__header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px; border-bottom: 1px solid #e5e7eb;
}
.puck-modal__title { margin: 0; font-size: 16px; font-weight: 600; color: #1f2937; }
.puck-modal__close {
  border: none; background: transparent; cursor: pointer; padding: 4px;
  border-radius: 4px; color: #9ca3af; transition: all 0.1s;
}
.puck-modal__close:hover { background: #f3f4f6; color: #1f2937; }
.puck-modal__body { flex: 1; overflow-y: auto; padding: 20px; }
.puck-modal__footer { padding: 12px 20px; border-top: 1px solid #e5e7eb; display: flex; justify-content: flex-end; gap: 8px; }

.puck-modal-enter-active, .puck-modal-leave-active { transition: opacity 0.2s; }
.puck-modal-enter-active .puck-modal, .puck-modal-leave-active .puck-modal { transition: transform 0.2s; }
.puck-modal-enter-from, .puck-modal-leave-to { opacity: 0; }
.puck-modal-enter-from .puck-modal { transform: scale(0.95) translateY(10px); }
</style>
