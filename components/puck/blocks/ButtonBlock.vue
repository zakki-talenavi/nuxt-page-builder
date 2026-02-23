<template>
  <div class="puck-button-block">
    <!-- Link: render as anchor -->
    <a
      v-if="actionType === 'link'"
      :href="href"
      class="puck-button-block__btn"
      :class="btnClass"
    >
      <component v-if="isLabelVNode" :is="label" />
      <template v-else>{{ label }}</template>
    </a>

    <!-- Modal: render as button that opens modal -->
    <template v-else>
      <button
        type="button"
        class="puck-button-block__btn"
        :class="btnClass"
        @click="openModal"
      >
        <component v-if="isLabelVNode" :is="label" />
        <template v-else>{{ label }}</template>
      </button>
      <PuckModal
        v-model="showModal"
        :title="modalTitle || (isLabelVNode ? 'Button' : (label as string))"
        :max-width="520"
      >
        <!-- Rich text content -->
        <div
          v-if="modalContentType === 'richtext' && modalContent"
          class="puck-button-block__modal-body"
          v-html="modalContent"
        />
        <p v-else-if="modalContentType === 'richtext'" class="puck-button-block__modal-empty">
          Tidak ada konten modal.
        </p>

        <!-- Form dari form builder (referensi formId) -->
        <template v-else-if="modalContentType === 'form'">
          <div v-if="!formId" class="puck-button-block__form-placeholder">
            Isi <strong>ID Form</strong> di properti komponen, lalu buat form tersebut di Form Builder.
          </div>
          <div v-else-if="!schema" class="puck-button-block__form-placeholder">
            Form dengan ID <strong>{{ formId }}</strong> belum ada. Buat di Form Builder terlebih dahulu.
          </div>
          <form
            v-else
            class="puck-button-block__form"
            @submit.prevent="onFormSubmit"
          >
            <div
              v-for="(field, index) in normalizedFormFields"
              :key="index"
              class="puck-button-block__form-group"
            >
              <label v-if="field.label" class="puck-button-block__form-label">
                {{ field.label }}
                <span v-if="field.required" class="puck-button-block__form-required">*</span>
              </label>
              <input
                v-if="field.type !== 'textarea'"
                v-model="formData[field.name]"
                :type="inputType(field.type)"
                :name="field.name"
                :placeholder="field.placeholder"
                class="puck-button-block__form-input"
              />
              <textarea
                v-else
                v-model="formData[field.name]"
                :name="field.name"
                :placeholder="field.placeholder"
                class="puck-button-block__form-input puck-button-block__form-textarea"
                rows="3"
              />
            </div>
            <div class="puck-button-block__form-actions">
              <button type="button" class="puck-button-block__form-btn puck-button-block__form-btn--ghost" @click="showModal = false">
                Batal
              </button>
              <button type="submit" class="puck-button-block__form-btn puck-button-block__form-btn--primary">
                {{ submitLabel }}
              </button>
            </div>
          </form>
        </template>
      </PuckModal>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { FormFieldSchema } from '~~/composables/useFormSchema'
import { useFormSchema } from '~~/composables/useFormSchema'

const props = withDefaults(
  defineProps<{
    label?: string
    href?: string
    variant?: string
    actionType?: 'link' | 'modal'
    modalTitle?: string
    modalContentType?: 'richtext' | 'form'
    modalContent?: string
    /** ID form dari form builder. Definisi form (field, dll) tidak di sini. */
    formId?: string
  }>(),
  {
    label: 'Button',
    href: '#',
    variant: 'primary',
    actionType: 'link',
    modalTitle: '',
    modalContentType: 'richtext',
    modalContent: '',
    formId: '',
  }
)

const emit = defineEmits<{
  (e: 'formSubmit', data: Record<string, string>): void
}>()

const showModal = ref(false)
const formData = ref<Record<string, string>>({})

const { schema, fields, submitLabel } = useFormSchema(props.formId)

const btnClass = computed(() => ({
  'puck-button-block__btn--primary': props.variant !== 'secondary',
  'puck-button-block__btn--secondary': props.variant === 'secondary',
}))

/** In edit mode label can be a VNode (InlineTextEdit) for in-canvas editing */
const isLabelVNode = computed(() =>
  typeof props.label === 'object' && props.label !== null && !!(props.label as any).__v_isVNode
)

const normalizedFormFields = computed(() => {
  const list = fields.value || []
  return list
    .filter((f: FormFieldSchema) => f && f.name)
    .map((f: FormFieldSchema) => ({
      name: f.name,
      type: f.type || 'text',
      label: f.label || '',
      placeholder: f.placeholder || '',
      required: f.required ?? false,
    }))
})

function inputType(type: string) {
  if (type === 'email') return 'email'
  if (type === 'number' || type === 'tel') return type
  return 'text'
}

function openModal() {
  if (props.modalContentType === 'form' && normalizedFormFields.value.length) {
    const initial: Record<string, string> = {}
    normalizedFormFields.value.forEach((f: { name: string }) => { initial[f.name] = '' })
    formData.value = { ...initial }
  }
  showModal.value = true
}

function onFormSubmit() {
  emit('formSubmit', { ...formData.value })
  showModal.value = false
}
</script>

<style scoped>
.puck-button-block { padding: 8px 0; }
.puck-button-block__btn {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s;
  text-decoration: none;
  border: none;
  font-family: inherit;
}
.puck-button-block__btn--primary {
  background: #6366f1;
  color: #fff;
}
.puck-button-block__btn--primary:hover {
  background: #4f46e5;
}
.puck-button-block__btn--secondary {
  background: #fff;
  color: #6366f1;
  border: 2px solid #6366f1;
}
.puck-button-block__btn--secondary:hover {
  background: #eef2ff;
}

.puck-button-block__modal-body :deep(p) { margin: 0 0 12px; }
.puck-button-block__modal-body :deep(p:last-child) { margin-bottom: 0; }
.puck-button-block__modal-body :deep(a) { color: #6366f1; }
.puck-button-block__modal-empty { margin: 0; color: #9ca3af; font-size: 14px; }

.puck-button-block__form-placeholder {
  padding: 24px 16px;
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px dashed #e5e7eb;
}
.puck-button-block__form-placeholder strong { color: #374151; }

.puck-button-block__form { display: flex; flex-direction: column; gap: 16px; }
.puck-button-block__form-group { display: flex; flex-direction: column; gap: 4px; }
.puck-button-block__form-label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}
.puck-button-block__form-required { color: #ef4444; }
.puck-button-block__form-input {
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.puck-button-block__form-input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}
.puck-button-block__form-textarea { resize: vertical; min-height: 80px; }
.puck-button-block__form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid #e5e7eb;
}
.puck-button-block__form-btn {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}
.puck-button-block__form-btn--primary {
  background: #6366f1;
  color: #fff;
  border: none;
}
.puck-button-block__form-btn--primary:hover {
  background: #4f46e5;
}
.puck-button-block__form-btn--ghost {
  background: transparent;
  color: #6b7280;
  border: 1px solid #e5e7eb;
}
.puck-button-block__form-btn--ghost:hover {
  background: #f3f4f6;
  color: #374151;
}
</style>
