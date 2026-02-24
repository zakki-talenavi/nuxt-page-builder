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

const props = defineProps<{
  node: WorkflowNode
  descriptor?: NodeTypeDescriptor | null
}>()

const emit = defineEmits<{
  update: [config: Record<string, unknown>]
}>()

function update(key: string, value: unknown) {
  emit('update', { ...props.node.config, [key]: value })
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
</style>
