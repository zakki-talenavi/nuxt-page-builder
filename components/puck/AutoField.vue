<template>
  <div class="puck-field">
    <label class="puck-field__label">{{ label }}</label>

    <component
      v-if="customFieldComponent"
      :is="customFieldComponent"
      :value="value"
      :field="fieldConfig"
      :name="fieldKey"
      :read-only="false"
      @change="(val: any) => $emit('change', val)"
    />

    <select
      v-else-if="fieldType === 'select'"
      class="puck-field__input"
      :value="value"
      @change="onChange"
    >
      <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
    </select>

    <div v-else-if="fieldType === 'radio'" class="puck-field__radios">
      <label v-for="opt in options" :key="opt.value" class="puck-field__radio">
        <input type="radio" :name="fieldKey" :value="opt.value" :checked="value === opt.value" @change="onChange" />
        <span>{{ opt.label }}</span>
      </label>
    </div>

    <textarea
      v-else-if="fieldType === 'textarea'"
      class="puck-field__input puck-field__textarea"
      :value="value ?? ''"
      @input="onChange"
    />

    <input
      v-else-if="fieldType === 'number'"
      class="puck-field__input"
      type="number"
      :value="value ?? ''"
      @input="onChange"
    />

    <ClientOnly v-else-if="fieldType === 'richtext'">
      <PuckRichTextEditor
        :model-value="value ?? ''"
        @update:model-value="(val: string) => $emit('change', val)"
      />
    </ClientOnly>

    <PuckFieldsArrayField
      v-else-if="fieldType === 'array'"
      :value="value ?? []"
      :field-config="fieldConfig"
      @change="(val: any) => $emit('change', val)"
    />

    <PuckFieldsObjectField
      v-else-if="fieldType === 'object'"
      :value="value ?? {}"
      :field-config="fieldConfig"
      @change="(val: any) => $emit('change', val)"
    />

    <PuckExternalInput
      v-else-if="fieldType === 'external'"
      :value="value"
      :placeholder="fieldConfig?.placeholder"
      :modal-title="label"
      :fetch-list="fieldConfig?.fetchList"
      @change="(val: any) => $emit('change', val)"
    />

    <input
      v-else
      class="puck-field__input"
      type="text"
      :value="value ?? ''"
      @input="onChange"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  fieldKey: string
  fieldConfig: any
  value: any
  /** Vue component for custom field type (from overrides.fieldTypes) */
  customFieldComponent?: any
}>()

const emit = defineEmits<{ (e: 'change', value: any): void }>()

const label = computed(() => props.fieldConfig?.label || props.fieldKey)
const fieldType = computed(() => props.fieldConfig?.type || 'text')
const options = computed(() => {
  const opts = props.fieldConfig?.options || []
  return opts.map((o: any) => typeof o === 'string' ? { label: o, value: o } : o)
})

function onChange(e: Event) {
  const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  let val: any = target.value
  if (fieldType.value === 'number') val = parseFloat(val) || 0
  emit('change', val)
}
</script>

<style scoped>
.puck-field { display: flex; flex-direction: column; gap: 4px; }
.puck-field__label {
  font-size: 12px; font-weight: 600; color: #6b7280;
  text-transform: uppercase; letter-spacing: 0.03em;
}
.puck-field__input {
  padding: 8px 10px; font-size: 13px; border: 1px solid #d1d5db;
  border-radius: 6px; background: #fff; color: #1f2937;
  outline: none; transition: border-color 0.15s ease, box-shadow 0.15s ease;
  font-family: inherit; width: 100%; box-sizing: border-box;
}
.puck-field__input:focus {
  border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}
.puck-field__textarea { resize: vertical; min-height: 80px; }
.puck-field__radios { display: flex; flex-direction: column; gap: 6px; }
.puck-field__radio {
  display: flex; align-items: center; gap: 6px;
  font-size: 13px; color: #374151; cursor: pointer;
}
.puck-field__radio input { accent-color: #6366f1; }
</style>
