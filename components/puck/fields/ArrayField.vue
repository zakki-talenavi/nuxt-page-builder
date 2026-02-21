<template>
  <div class="puck-array-field">
    <div
      v-for="(item, idx) in localValue"
      :key="item._arrayId || idx"
      class="puck-array-field__item"
    >
      <div class="puck-array-field__item-header" @click="toggleItem(idx)">
        <svg
          class="puck-array-field__chevron"
          :class="{ open: openIdx === idx }"
          width="14" height="14" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2"
        ><polyline points="9 18 15 12 9 6"/></svg>
        <span class="puck-array-field__item-title">{{ getItemTitle(item, idx) }}</span>
        <button class="puck-array-field__remove" @click.stop="removeItem(idx)" title="Remove">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <div v-if="openIdx === idx" class="puck-array-field__item-body">
        <PuckAutoField
          v-for="f in subFields"
          :key="f.key"
          :field-key="f.key"
          :field-config="f.config"
          :value="item[f.key]"
          @change="(val: any) => updateItem(idx, f.key, val)"
        />
      </div>
    </div>
    <button class="puck-array-field__add" @click="addItem">+ Add item</button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  value: any[]
  fieldConfig: any
}>()

const emit = defineEmits<{ (e: 'change', value: any[]): void }>()

const openIdx = ref(-1)

const localValue = computed(() => {
  const arr = Array.isArray(props.value) ? props.value : []
  return arr.map((item, i) => ({
    ...item,
    _arrayId: item._arrayId || `arr-${i}`,
  }))
})

const subFields = computed(() => {
  const fields = props.fieldConfig?.arrayFields || {}
  return Object.entries(fields).map(([key, config]: [string, any]) => ({ key, config }))
})

function getItemTitle(item: any, idx: number) {
  return item.title || item.label || item.name || `Item ${idx + 1}`
}

function toggleItem(idx: number) {
  openIdx.value = openIdx.value === idx ? -1 : idx
}

function addItem() {
  const defaults: Record<string, any> = {}
  for (const f of subFields.value) {
    defaults[f.key] = f.config?.defaultValue ?? ''
  }
  const newArr = [...(props.value || []), defaults]
  emit('change', newArr)
  openIdx.value = newArr.length - 1
}

function removeItem(idx: number) {
  const newArr = [...(props.value || [])]
  newArr.splice(idx, 1)
  emit('change', newArr)
  if (openIdx.value === idx) openIdx.value = -1
}

function updateItem(idx: number, key: string, val: any) {
  const newArr = [...(props.value || [])]
  newArr[idx] = { ...newArr[idx], [key]: val }
  emit('change', newArr)
}
</script>

<style scoped>
.puck-array-field { display: flex; flex-direction: column; gap: 4px; }
.puck-array-field__item { border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden; }
.puck-array-field__item-header {
  display: flex; align-items: center; gap: 6px; padding: 8px 10px;
  cursor: pointer; background: #f9fafb; transition: background 0.1s;
}
.puck-array-field__item-header:hover { background: #f3f4f6; }
.puck-array-field__chevron { transition: transform 0.15s; color: #9ca3af; flex-shrink: 0; }
.puck-array-field__chevron.open { transform: rotate(90deg); }
.puck-array-field__item-title { flex: 1; font-size: 13px; font-weight: 500; color: #374151; }
.puck-array-field__remove { border: none; background: transparent; cursor: pointer; color: #9ca3af; padding: 2px; border-radius: 3px; }
.puck-array-field__remove:hover { color: #ef4444; }
.puck-array-field__item-body { padding: 12px; display: flex; flex-direction: column; gap: 12px; border-top: 1px solid #e5e7eb; }
.puck-array-field__add {
  padding: 8px; border: 1px dashed #d1d5db; border-radius: 6px;
  background: transparent; cursor: pointer; font-size: 13px; color: #6366f1;
  font-weight: 500; transition: all 0.15s;
}
.puck-array-field__add:hover { background: #eef2ff; border-color: #6366f1; }
</style>
