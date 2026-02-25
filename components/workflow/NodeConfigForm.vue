<template>
  <div class="node-config-form">
    <h4 class="node-config-form__title">{{ descriptor?.label ?? node.type }}</h4>
    <template v-if="node.type === 'form_submitted'">
      <label class="node-config-form__label">Form ID</label>
      <input
        :value="(node.config.formId as string) ?? ''"
        type="text"
        class="node-config-form__input"
        placeholder="support_form"
        @input="update('formId', ($event.target as HTMLInputElement).value)"
      />
    </template>
    <template v-else-if="node.type === 'if_else'">
      <label class="node-config-form__label">Field (path)</label>
      <input
        :value="(node.config.field as string) ?? ''"
        type="text"
        class="node-config-form__input"
        placeholder="payload.priority"
        @input="update('field', ($event.target as HTMLInputElement).value)"
      />
      <label class="node-config-form__label">Operator</label>
      <select
        :value="(node.config.operator as string) ?? 'eq'"
        class="node-config-form__input"
        @change="update('operator', ($event.target as HTMLSelectElement).value)"
      >
        <option value="eq">equals</option>
        <option value="neq">not equals</option>
        <option value="contains">contains</option>
        <option value="gt">greater than</option>
        <option value="lt">less than</option>
      </select>
      <label class="node-config-form__label">Value</label>
      <input
        :value="(node.config.value as string) ?? ''"
        type="text"
        class="node-config-form__input"
        placeholder="high"
        @input="update('value', ($event.target as HTMLInputElement).value)"
      />
    </template>
    <template v-else-if="node.type === 'approve_or_reject'">
      <p class="node-config-form__label">Request approval by</p>
      <p class="node-config-form__hint">Email</p>
      <label class="node-config-form__label">Approvers *</label>
      <div v-for="(email, i) in approversList" :key="i" class="node-config-form__row">
        <input
          :value="email"
          type="email"
          class="node-config-form__input"
          placeholder="email@example.com"
          @input="setApprover(i, ($event.target as HTMLInputElement).value)"
        />
        <button type="button" class="node-config-form__remove" title="Hapus" @click="removeApprover(i)">×</button>
      </div>
      <button type="button" class="node-config-form__add" @click="addApprover">+ Tambah approver</button>
      <label class="node-config-form__label">Options *</label>
      <div v-for="(opt, i) in optionsList" :key="opt.id || i" class="node-config-form__option-row">
        <input
          :value="opt.color"
          type="color"
          class="node-config-form__color"
          title="Warna"
          @input="setOption(i, 'color', ($event.target as HTMLInputElement).value)"
        />
        <input
          :value="opt.label"
          type="text"
          class="node-config-form__input node-config-form__input--flex"
          placeholder="Label opsi"
          @input="setOption(i, 'label', ($event.target as HTMLInputElement).value)"
        />
        <button type="button" class="node-config-form__remove" title="Hapus" @click="removeOption(i)">×</button>
      </div>
      <button type="button" class="node-config-form__add" @click="addOption">+ Add option</button>
      <label class="node-config-form__label">Approver input</label>
      <button type="button" class="node-config-form__add" @click="addApproverInput">+ Add input</button>
      <div v-for="(inp, i) in approverInputsList" :key="i" class="node-config-form__row">
        <input
          :value="inp.key"
          type="text"
          class="node-config-form__input"
          placeholder="Key"
          @input="setApproverInput(i, 'key', ($event.target as HTMLInputElement).value)"
        />
        <input
          :value="inp.label"
          type="text"
          class="node-config-form__input"
          placeholder="Label"
          @input="setApproverInput(i, 'label', ($event.target as HTMLInputElement).value)"
        />
        <button type="button" class="node-config-form__remove" @click="removeApproverInput(i)">×</button>
      </div>
      <label class="node-config-form__label">Notification email</label>
      <label class="node-config-form__sublabel">Subject</label>
      <input
        :value="(node.config.notificationSubject as string) ?? '[Action required] Approve submission'"
        type="text"
        class="node-config-form__input"
        placeholder="[Action required] Approve submission"
        @input="update('notificationSubject', ($event.target as HTMLInputElement).value)"
      />
      <div class="node-config-form__btn-row">
        <button type="button" class="node-config-form__btn" @click="showEditEmail = !showEditEmail">
          <i class="pi pi-envelope" /> Edit email
        </button>
        <button type="button" class="node-config-form__btn">Preview</button>
      </div>
      <template v-if="showEditEmail">
        <label class="node-config-form__sublabel">Body</label>
        <textarea
          :value="(node.config.notificationBody as string) ?? ''"
          class="node-config-form__input node-config-form__textarea"
          rows="4"
          placeholder="Isi email notifikasi..."
          @input="update('notificationBody', ($event.target as HTMLTextAreaElement).value)"
        />
      </template>
    </template>
    <template v-else-if="node.type === 'send_email'">
      <label class="node-config-form__label">To</label>
      <input
        :value="(node.config.to as string) ?? ''"
        type="text"
        class="node-config-form__input"
        placeholder="{{ payload.email }}"
        @input="update('to', ($event.target as HTMLInputElement).value)"
      />
      <label class="node-config-form__label">Subject</label>
      <input
        :value="(node.config.subject as string) ?? ''"
        type="text"
        class="node-config-form__input"
        @input="update('subject', ($event.target as HTMLInputElement).value)"
      />
      <label class="node-config-form__label">Body</label>
      <textarea
        :value="(node.config.body as string) ?? ''"
        class="node-config-form__input node-config-form__textarea"
        rows="3"
        @input="update('body', ($event.target as HTMLTextAreaElement).value)"
      />
    </template>
    <template v-else-if="node.type === 'send_webhook'">
      <label class="node-config-form__label">URL</label>
      <input
        :value="(node.config.url as string) ?? ''"
        type="text"
        class="node-config-form__input"
        placeholder="https://..."
        @input="update('url', ($event.target as HTMLInputElement).value)"
      />
      <label class="node-config-form__label">Method</label>
      <select
        :value="(node.config.method as string) ?? 'POST'"
        class="node-config-form__input"
        @change="update('method', ($event.target as HTMLSelectElement).value)"
      >
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
        <option value="PATCH">PATCH</option>
        <option value="DELETE">DELETE</option>
      </select>
      <label class="node-config-form__label">Body (JSON)</label>
      <textarea
        :value="typeof node.config.body === 'string' ? node.config.body : JSON.stringify(node.config.body ?? {})"
        class="node-config-form__input node-config-form__textarea"
        rows="3"
        @input="updateBodyJson(($event.target as HTMLTextAreaElement).value)"
      />
    </template>
    <template v-else-if="node.type === 'delay'">
      <label class="node-config-form__label">Delay (ms)</label>
      <input
        :value="(node.config.delayMs as number) ?? 60000"
        type="number"
        class="node-config-form__input"
        min="0"
        @input="update('delayMs', Number(($event.target as HTMLInputElement).value))"
      />
    </template>
    <template v-else-if="node.type === 'manual_trigger' || node.type === 'webhook_received'">
      <p class="node-config-form__hint">Tidak ada konfigurasi tambahan.</p>
    </template>
    <template v-else>
      <p class="node-config-form__hint">Config untuk tipe "{{ node.type }}" — edit manual nanti.</p>
      <pre class="node-config-form__pre">{{ JSON.stringify(node.config, null, 2) }}</pre>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { WorkflowNode, NodeTypeDescriptor } from '~~/types/workflow'
import { computed, ref } from 'vue'

const props = defineProps<{
  node: WorkflowNode
  descriptor?: NodeTypeDescriptor | null
}>()

const emit = defineEmits<{
  update: [config: Record<string, unknown>]
}>()

const showEditEmail = ref(false)

const approversList = computed(() => {
  const a = props.node.config?.approvers
  return Array.isArray(a) && a.length > 0 ? [...a] : ['']
})

const optionsList = computed(() => {
  const o = props.node.config?.options
  if (!Array.isArray(o) || o.length === 0) {
    return [
      { id: 'approve', label: 'Approve', color: '#16a34a' },
      { id: 'reject', label: 'Reject', color: '#dc2626' },
      { id: 'revise', label: 'Revise', color: '#eab308' },
    ]
  }
  return o.map((x: any) => ({ id: x.id ?? x.label?.toLowerCase?.()?.replace(/\s+/g, '_') ?? `opt_${Date.now()}`, label: x.label ?? '', color: x.color ?? '#94a3b8' }))
})

const approverInputsList = computed(() => {
  const i = props.node.config?.approverInputs
  return Array.isArray(i) ? i : []
})

function update(key: string, value: unknown) {
  emit('update', { ...props.node.config, [key]: value })
}

function setApprover(index: number, value: string) {
  const list = [...approversList.value]
  list[index] = value
  emit('update', { ...props.node.config, approvers: list })
}

function removeApprover(index: number) {
  const list = approversList.value.filter((_, i) => i !== index)
  emit('update', { ...props.node.config, approvers: list.length ? list : [''] })
}

function addApprover() {
  emit('update', { ...props.node.config, approvers: [...approversList.value, ''] })
}

function setOption(index: number, field: 'label' | 'color', value: string) {
  const list = optionsList.value.map((o, i) => (i === index ? { ...o, [field]: value } : o))
  if (field === 'label' && list[index]) {
    const id = value.toLowerCase().replace(/\s+/g, '_') || list[index].id
    list[index] = { ...list[index], id }
  }
  emit('update', { ...props.node.config, options: list })
}

function removeOption(index: number) {
  const list = optionsList.value.filter((_, i) => i !== index)
  emit('update', { ...props.node.config, options: list.length ? list : [{ id: 'approve', label: 'Approve', color: '#16a34a' }] })
}

function addOption() {
  const list = [...optionsList.value, { id: `option_${Date.now()}`, label: 'New option', color: '#94a3b8' }]
  emit('update', { ...props.node.config, options: list })
}

function setApproverInput(index: number, field: string, value: string) {
  const list = approverInputsList.value.map((inp, i) => (i === index ? { ...inp, [field]: value } : inp))
  emit('update', { ...props.node.config, approverInputs: list })
}

function removeApproverInput(index: number) {
  const list = approverInputsList.value.filter((_, i) => i !== index)
  emit('update', { ...props.node.config, approverInputs: list })
}

function addApproverInput() {
  emit('update', { ...props.node.config, approverInputs: [...approverInputsList.value, { key: '', label: '' }] })
}

function updateBodyJson(raw: string) {
  try {
    const body = JSON.parse(raw || '{}')
    emit('update', { ...props.node.config, body })
  } catch {
    emit('update', { ...props.node.config, body: raw })
  }
}
</script>

<style scoped>
.node-config-form__title {
  font-size: 0.8125rem;
  font-weight: 600;
  margin: 0 0 0.75rem;
  color: var(--p-text-color, #1e293b);
}
.node-config-form__label {
  display: block;
  font-size: 0.75rem;
  color: var(--p-text-muted-color, #64748b);
  margin: 0.75rem 0 0.25rem;
}
.node-config-form__label:first-of-type {
  margin-top: 0;
}
.node-config-form__input {
  width: 100%;
  padding: 0.5rem 0.625rem;
  border: 1px solid var(--p-surface-border, #e2e8f0);
  border-radius: var(--p-border-radius, 6px);
  font-size: 0.875rem;
  background: var(--p-input-background, #fff);
  color: var(--p-text-color, #1e293b);
}
.node-config-form__input:focus {
  outline: none;
  border-color: var(--p-primary-color, #6366f1);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--p-primary-color, #6366f1) 20%, transparent);
}
.node-config-form__textarea {
  resize: vertical;
  min-height: 60px;
}
.node-config-form__hint {
  font-size: 0.8125rem;
  color: var(--p-text-muted-color, #64748b);
  margin: 0;
}
.node-config-form__pre {
  font-size: 0.75rem;
  background: var(--p-surface-50, #f8fafc);
  padding: 0.5rem 0.625rem;
  border-radius: var(--p-border-radius, 6px);
  overflow: auto;
  margin: 0.5rem 0 0;
  border: 1px solid var(--p-surface-border, #e2e8f0);
}
.node-config-form__row,
.node-config-form__option-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}
.node-config-form__row .node-config-form__input,
.node-config-form__option-row .node-config-form__input {
  flex: 1;
  margin-top: 0;
}
.node-config-form__input--flex {
  flex: 1;
}
.node-config-form__remove {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border: 1px solid var(--p-surface-border, #e2e8f0);
  border-radius: 6px;
  background: #fff;
  color: #64748b;
  cursor: pointer;
  font-size: 1.1rem;
  line-height: 1;
}
.node-config-form__remove:hover {
  background: #fef2f2;
  color: #dc2626;
  border-color: #fecaca;
}
.node-config-form__add {
  margin-top: 6px;
  padding: 0.4rem 0.6rem;
  font-size: 0.8125rem;
  border: 1px dashed var(--p-surface-border, #e2e8f0);
  border-radius: 6px;
  background: #fff;
  color: #64748b;
  cursor: pointer;
}
.node-config-form__add:hover {
  border-color: var(--p-primary-color, #6366f1);
  color: var(--p-primary-color, #6366f1);
}
.node-config-form__color {
  width: 32px;
  height: 28px;
  padding: 2px;
  border: 1px solid var(--p-surface-border, #e2e8f0);
  border-radius: 6px;
  cursor: pointer;
  flex-shrink: 0;
}
.node-config-form__sublabel {
  font-size: 0.7rem;
  color: #94a3b8;
  margin: 0.25rem 0 0;
}
.node-config-form__btn-row {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
.node-config-form__btn {
  padding: 0.4rem 0.75rem;
  font-size: 0.8125rem;
  border: 1px solid var(--p-surface-border, #e2e8f0);
  border-radius: 6px;
  background: #fff;
  color: #64748b;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.node-config-form__btn:hover {
  background: #f8fafc;
  color: #1e293b;
}
.node-config-form__btn .pi {
  font-size: 0.875rem;
}
</style>
