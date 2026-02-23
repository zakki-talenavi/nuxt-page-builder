<template>
  <div class="puck-button-block">
    <!-- Link: PrimeVue Button as anchor -->
    <Button
      v-if="actionType === 'link'"
      as="a"
      :href="href"
      :label="isLabelVNode ? undefined : (label as string)"
      :icon="(isLabelVNode && icon) ? undefined : (icon || undefined)"
      :icon-pos="iconPos"
      :severity="effectiveSeverity"
      :variant="variantProp"
      :size="sizeProp"
      :raised="raised"
      :rounded="rounded"
      :disabled="disabled"
      :loading="loading"
      :badge="badge || undefined"
      :badge-severity="badge ? badgeSeverity : undefined"
      :aria-label="ariaLabel || undefined"
      class="puck-button-block__btn"
    >
      <template v-if="isLabelVNode">
        <span class="puck-button-block__slot" :class="`puck-button-block__slot--icon-${iconPos}`">
          <i v-if="icon" :class="icon" class="puck-button-block__icon" aria-hidden="true" />
          <component :is="label" />
        </span>
      </template>
    </Button>

    <!-- Button (plain): type = button | submit | reset -->
    <Button
      v-else-if="actionType === 'button'"
      :type="buttonType"
      :label="isLabelVNode ? undefined : (label as string)"
      :icon="(isLabelVNode && icon) ? undefined : (icon || undefined)"
      :icon-pos="iconPos"
      :severity="effectiveSeverity"
      :variant="variantProp"
      :size="sizeProp"
      :raised="raised"
      :rounded="rounded"
      :disabled="disabled"
      :loading="loading"
      :badge="badge || undefined"
      :badge-severity="badge ? badgeSeverity : undefined"
      :aria-label="ariaLabel || undefined"
      class="puck-button-block__btn"
    >
      <template v-if="isLabelVNode">
        <span class="puck-button-block__slot" :class="`puck-button-block__slot--icon-${iconPos}`">
          <i v-if="icon" :class="icon" class="puck-button-block__icon" aria-hidden="true" />
          <component :is="label" />
        </span>
      </template>
    </Button>

    <!-- Modal: always type="button" so click only opens modal -->
    <template v-else>
      <Button
        type="button"
        :label="isLabelVNode ? undefined : (label as string)"
        :icon="(isLabelVNode && icon) ? undefined : (icon || undefined)"
        :icon-pos="iconPos"
        :severity="effectiveSeverity"
        :variant="variantProp"
        :size="sizeProp"
        :raised="raised"
        :rounded="rounded"
        :disabled="disabled"
        :loading="loading"
        :badge="badge || undefined"
        :badge-severity="badge ? badgeSeverity : undefined"
        :aria-label="ariaLabel || undefined"
        class="puck-button-block__btn"
        @click="openModal"
      >
        <template v-if="isLabelVNode">
          <span class="puck-button-block__slot" :class="`puck-button-block__slot--icon-${iconPos}`">
            <i v-if="icon" :class="icon" class="puck-button-block__icon" aria-hidden="true" />
            <component :is="label" />
          </span>
        </template>
      </Button>
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
import Button from 'primevue/button'
import type { FormFieldSchema } from '~~/composables/useFormSchema'
import { useFormSchema } from '~~/composables/useFormSchema'

const props = withDefaults(
  defineProps<{
    label?: string
    href?: string
    /** PrimeVue severity: primary, secondary, success, info, warn, help, danger, contrast */
    severity?: string
    /** PrimeVue variant: filled, text, outlined, link */
    variant?: string
    actionType?: 'link' | 'button' | 'modal'
    /** HTML button type: button | submit | reset (only when not link) */
    buttonType?: 'button' | 'submit' | 'reset'
    icon?: string
    iconPos?: 'left' | 'right' | 'top' | 'bottom'
    size?: 'small' | 'normal' | 'large'
    raised?: boolean
    rounded?: boolean
    disabled?: boolean
    loading?: boolean
    badge?: string
    badgeSeverity?: string
    ariaLabel?: string
    modalTitle?: string
    modalContentType?: 'richtext' | 'form'
    modalContent?: string
    formId?: string
  }>(),
  {
    label: 'Button',
    href: '#',
    severity: 'primary',
    variant: 'filled',
    actionType: 'button',
    buttonType: 'button',
    icon: '',
    iconPos: 'left',
    size: 'normal',
    raised: false,
    rounded: false,
    disabled: false,
    loading: false,
    badge: '',
    badgeSeverity: 'danger',
    ariaLabel: '',
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

/** Severity: use severity prop, or fallback for old data that only had variant (primary/secondary) */
const effectiveSeverity = computed(() => {
  if (props.severity) return props.severity
  if (props.variant === 'secondary') return 'secondary'
  return 'primary'
})
/** PrimeVue variant (style): filled = default, only pass text/outlined/link */
const variantProp = computed(() => {
  const v = props.variant
  if (!v || v === 'filled' || v === 'primary' || v === 'secondary') return undefined
  return v
})
/** PrimeVue size: omit when normal */
const sizeProp = computed(() =>
  props.size === 'normal' || !props.size ? undefined : props.size
)

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
/* Wrapper inline agar tombol tidak meregang full width & layout tidak berantakan */
.puck-button-block {
  display: inline-block;
  width: fit-content;
  padding: 8px 0;
  max-width: 100%;
}
/* PrimeVue Button: jangan potong teks/label saat ada icon */
.puck-button-block__btn {
  margin: 0;
  overflow: visible;
  white-space: nowrap;
}
/* Pastikan konten (icon + label) tidak terpotong */
.puck-button-block :deep(button),
.puck-button-block :deep(a) {
  overflow: visible;
}

/* Slot custom (icon + label) saat edit di canvas – urutan ikon sesuai iconPos */
.puck-button-block__slot {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  flex: 1 1 auto;
}
.puck-button-block__slot--icon-left { flex-direction: row; }
.puck-button-block__slot--icon-right { flex-direction: row-reverse; }
.puck-button-block__slot--icon-top { flex-direction: column; }
.puck-button-block__slot--icon-bottom { flex-direction: column-reverse; }
.puck-button-block__icon {
  flex-shrink: 0;
  font-size: inherit;
}
/* Label (InlineTextEdit) jangan menyusut agar teks tidak terpotong */
.puck-button-block__slot :deep(.puck-inline-text-edit) {
  flex: 0 1 auto;
  min-width: min-content;
  overflow: visible;
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
