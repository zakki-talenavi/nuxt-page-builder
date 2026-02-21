<template>
  <div class="puck-object-field">
    <PuckAutoField
      v-for="f in subFields"
      :key="f.key"
      :field-key="f.key"
      :field-config="f.config"
      :value="localValue[f.key]"
      @change="(val: any) => updateField(f.key, val)"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  value: any
  fieldConfig: any
}>()

const emit = defineEmits<{ (e: 'change', value: any): void }>()

const localValue = computed(() => props.value || {})

const subFields = computed(() => {
  const fields = props.fieldConfig?.objectFields || {}
  return Object.entries(fields).map(([key, config]: [string, any]) => ({ key, config }))
})

function updateField(key: string, val: any) {
  emit('change', { ...localValue.value, [key]: val })
}
</script>

<style scoped>
.puck-object-field {
  display: flex; flex-direction: column; gap: 12px;
  padding: 12px; border: 1px solid #e5e7eb; border-radius: 6px;
  background: #fafafa;
}
</style>
