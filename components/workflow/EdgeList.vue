<template>
  <div class="edge-list">
    <h4 class="edge-list__title">Koneksi</h4>
    <div class="edge-list__add">
      <Select
        v-model="newEdge.source"
        :options="nodeOptions"
        option-label="label"
        option-value="id"
        placeholder="Sumber"
        class="edge-list__select"
      />
      <Select
        v-model="newEdge.target"
        :options="nodeOptions"
        option-label="label"
        option-value="id"
        placeholder="Target"
        class="edge-list__select"
      />
      <Select
        v-if="sourceIsCondition"
        v-model="newEdge.sourceHandle"
        :options="[{ label: 'True', value: 'true' }, { label: 'False', value: 'false' }]"
        option-label="label"
        option-value="value"
        placeholder="Cabang"
        class="edge-list__select"
      />
      <Button label="Tambah" size="small" :disabled="!canAdd" @click="add" />
    </div>
    <ul class="edge-list__list">
      <li v-for="edge in edges" :key="edge.id" class="edge-list__item">
        <span class="edge-list__text">{{ edgeLabel(edge) }}</span>
        <Button icon="pi pi-times" text rounded severity="danger" size="small" class="edge-list__del" aria-label="Hapus" @click="$emit('remove', edge.id)" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import Select from 'primevue/select'
import Button from 'primevue/button'
import type { WorkflowNode, WorkflowEdge } from '~~/types/workflow'
import { getNodeDescriptor } from '~~/lib/workflow/descriptors'
import { computed, ref } from 'vue'

const props = defineProps<{
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}>()

const nodeOptions = computed(() =>
  props.nodes.map((n) => ({ id: n.id, label: getNodeDescriptor(n.type)?.label ?? n.type }))
)

const emit = defineEmits<{
  add: [edge: Omit<WorkflowEdge, 'id'>]
  remove: [edgeId: string]
}>()

const newEdge = ref<{ source: string | null; target: string | null; sourceHandle: string | null }>({
  source: null,
  target: null,
  sourceHandle: null,
})

const sourceIsCondition = computed(() => {
  const n = props.nodes.find((x) => x.id === newEdge.value.source)
  return n ? ['if_else', 'switch', 'filter_group'].includes(n.type) : false
})

const canAdd = computed(() => {
  const { source, target } = newEdge.value
  if (source == null || target == null || source === '' || target === '' || source === target) return false
  const exists = props.edges.some(
    (e) => e.source === source && e.target === target && (e.sourceHandle ?? null) === (newEdge.value.sourceHandle ?? null)
  )
  return !exists
})

function nodeLabel(node: WorkflowNode | undefined) {
  return node ? (getNodeDescriptor(node.type)?.label ?? node.type) : '?'
}

function edgeLabel(edge: WorkflowEdge) {
  const src = props.nodes.find((n) => n.id === edge.source)
  const tgt = props.nodes.find((n) => n.id === edge.target)
  const sh = edge.sourceHandle ? ` [${edge.sourceHandle}]` : ''
  return `${nodeLabel(src!)} → ${nodeLabel(tgt!)}${sh}`
}

function add() {
  if (!canAdd.value || newEdge.value.source == null || newEdge.value.target == null) return
  emit('add', {
    source: newEdge.value.source,
    target: newEdge.value.target,
    sourceHandle: newEdge.value.sourceHandle ?? undefined,
  })
  newEdge.value = { source: null, target: null, sourceHandle: null }
}
</script>

<style scoped>
.edge-list__title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin: 0 0 0.75rem;
  color: var(--p-text-muted-color, #64748b);
}
.edge-list__add {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}
.edge-list__select {
  flex: 1;
  min-width: 80px;
}
.edge-list__select :deep(.p-select) {
  width: 100%;
}
.edge-list__list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.edge-list__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.625rem;
  border-radius: var(--p-border-radius, 6px);
  font-size: 0.8125rem;
  margin-bottom: 0.25rem;
  background: var(--p-surface-50, #f8fafc);
  border: 1px solid var(--p-surface-border, #e2e8f0);
}
.edge-list__text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--p-text-color, #1e293b);
}
.edge-list__del {
  flex-shrink: 0;
}
</style>
