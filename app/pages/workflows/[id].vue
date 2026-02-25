<template>
  <div class="workflow-editor-page">
    <div v-if="!isNew && !workflowStore.current" class="workflow-editor-page__loading">
      Memuat workflow…
    </div>

    <template v-else>
      <header class="workflow-editor-page__header">
        <NuxtLink to="/edit/workflows" class="workflow-editor-page__back">
          <i class="pi pi-arrow-left" /> Daftar workflow
        </NuxtLink>
        <div class="workflow-editor-page__header-center">
          <input
            v-model="name"
            type="text"
            class="workflow-editor-page__title-input"
            placeholder="Nama workflow"
          />
          <p v-if="description" class="workflow-editor-page__subtitle">{{ description }}</p>
        </div>
        <div class="workflow-editor-page__header-actions">
          <Button label="Test" severity="secondary" icon="pi pi-play" size="small" @click="testRun" />
          <Button label="Simpan" icon="pi pi-check" size="small" @click="saveWorkflow" />
          <Button
            v-if="!isNew"
            icon="pi pi-ellipsis-v"
            text
            rounded
            severity="secondary"
            size="small"
            class="workflow-editor-page__menu-btn"
            @click="toggleWorkflowMenu"
          />
        </div>
      </header>
      <div v-if="showWorkflowMenu" class="workflow-editor-page__menu-overlay" @click="showWorkflowMenu = false" />
      <div v-if="showWorkflowMenu" class="workflow-editor-page__menu">
        <button type="button" class="workflow-editor-page__menu-item workflow-editor-page__menu-item--danger" @click="showWorkflowMenu = false; confirmDelete()">
          <i class="pi pi-trash" /> Hapus workflow
        </button>
      </div>

      <Message
        v-if="workflowStore.validationErrors.length"
        severity="error"
        :closable="false"
        class="workflow-editor-page__errors"
      >
        <ul class="workflow-editor-page__errors-list">
          <li v-for="(err, i) in workflowStore.validationErrors" :key="i">
            {{ err.message }} <span v-if="err.nodeId">(node: {{ err.nodeId }})</span>
          </li>
        </ul>
      </Message>

      <div class="workflow-editor-page__body">
        <aside class="workflow-editor-page__sidebar workflow-editor-page__sidebar--left">
          <WorkflowNodePalette />
        </aside>
        <main class="workflow-editor-page__canvas-wrap">
          <WorkflowCanvasVueFlow
            :nodes="workflowStore.current?.nodes ?? []"
            :edges="workflowStore.current?.edges ?? []"
            :selected-node-ids="workflowStore.editor.selectedNodeIds"
            :pan="workflowStore.editor.pan"
            :zoom="workflowStore.editor.zoom"
            :delete-node="onDeleteNode"
            @select-node="onSelectNode"
            @add-node="onAddNode"
            @change="onCanvasChange"
            @viewport-change="onViewportChange"
            @pane-click="workflowStore.clearSelection()"
          />
        </main>
        <aside class="workflow-editor-page__sidebar workflow-editor-page__sidebar--right">
          <div class="workflow-editor-page__right-inner">
            <section v-if="selectedNode" class="workflow-editor-page__section">
              <h4 class="workflow-editor-page__panel-title">Konfigurasi node</h4>
              <WorkflowNodeConfigForm
                :node="selectedNode"
                :descriptor="getDescriptor(selectedNode.type)"
                @update="onNodeConfigUpdate"
              />
            </section>
            <section class="workflow-editor-page__section">
              <WorkflowEdgeList
                :nodes="workflowStore.current?.nodes ?? []"
                :edges="workflowStore.current?.edges ?? []"
                @add="onAddEdge"
                @remove="onRemoveEdge"
              />
            </section>
            <section v-if="lastRun" class="workflow-editor-page__section workflow-editor-page__run">
              <h4 class="workflow-editor-page__panel-title">Hasil test run</h4>
              <p class="workflow-editor-page__run-status"><strong>Status:</strong> {{ lastRun.status }}</p>
              <p v-if="lastRun.errorMessage" class="workflow-editor-page__run-error">{{ lastRun.errorMessage }}</p>
            </section>
            <section class="workflow-editor-page__section">
              <WorkflowRunHistory
                :runs="workflowStore.runsForCurrentWorkflow"
                @select-run="onSelectRun"
              />
            </section>
          </div>
        </aside>
      </div>
    </template>

    <div v-if="showRunDetail" class="workflow-editor-page__modal" @click.self="showRunDetail = false">
      <div class="workflow-editor-page__modal-inner">
        <WorkflowRunDetail
          :run="workflowStore.currentRun"
          :node-runs="workflowStore.nodeRuns"
          @close="showRunDetail = false"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Message from 'primevue/message'
import type { WorkflowDefinition, WorkflowNode, WorkflowEdge, WorkflowRun, NodeRun } from '~~/types/workflow'
import { useWorkflowStore } from '~~/stores/workflow'
import { useWorkflowValidation } from '~~/composables/useWorkflowValidation'
import { getNodeDescriptor } from '~~/lib/workflow/descriptors'
import { computed, watch, ref, onMounted } from 'vue'

const route = useRoute()
const router = useRouter()
const workflowStore = useWorkflowStore()
const { validate } = useWorkflowValidation()

const id = computed(() => route.params.id as string)
const isNew = computed(() => id.value === 'new')

const name = ref('')
const description = ref('')
const lastRun = ref<{ status: string; errorMessage?: string } | null>(null)
const showRunDetail = ref(false)
const showWorkflowMenu = ref(false)

watch(
  () => workflowStore.current,
  (w) => {
    if (w) {
      name.value = w.name
      description.value = w.description ?? ''
    }
  },
  { immediate: true }
)

const selectedNode = computed(() => {
  const cur = workflowStore.current
  const ids = workflowStore.editor.selectedNodeIds
  if (!cur || ids.length !== 1) return null
  return cur.nodes.find((n) => n.id === ids[0]) ?? null
})

function getDescriptor(type: string) {
  return getNodeDescriptor(type)
}

onMounted(() => {
  if (isNew.value) {
    workflowStore.setCurrent({
      id: `wf_${Date.now()}`,
      version: 1,
      name: '',
      description: '',
      nodes: [],
      edges: [],
    })
    return
  }
  workflowStore.loadFromStorage()
  const w = workflowStore.workflows.find((x: WorkflowDefinition) => x.id === id.value) ?? null
  if (w) {
    workflowStore.setCurrent(w)
  } else {
    workflowStore.setCurrent(null)
  }
})

function saveWorkflow() {
  const current = workflowStore.current
  if (!current) return
  const errors = validate({
    ...current,
    name: name.value,
    description: description.value,
  })
  workflowStore.setValidationErrors(errors)
  const updated: WorkflowDefinition = {
    ...current,
    name: name.value,
    description: description.value,
  }
  workflowStore.setCurrent(updated)
  workflowStore.saveCurrentWorkflow()
}

async function testRun() {
  const current = workflowStore.current
  if (!current) return
  const errors = validate({
    ...current,
    name: name.value,
    description: description.value,
  })
  workflowStore.setValidationErrors(errors)
  try {
    const result = await $fetch<{ runId: string; status: string; errorMessage?: string; nodeRuns?: unknown[] }>(
      '/api/workflows/trigger',
      {
        method: 'POST',
        body: {
          workflow: {
            ...current,
            name: name.value,
            description: description.value,
          },
          triggerType: 'manual_trigger',
          payload: { submission: { type: 'support', email: 'test@example.com' } },
        },
      }
    )
    lastRun.value = result
    workflowStore.addRun({
      ...result,
      workflowId: current.id,
      id: result.runId,
      createdAt: new Date().toISOString(),
    } as any)
  } catch (e: any) {
    lastRun.value = {
      status: 'failed',
      errorMessage: e?.data?.message ?? e?.message ?? String(e),
    }
  }
}

function confirmDelete() {
  if (!workflowStore.current || !confirm('Hapus workflow ini?')) return
  workflowStore.deleteWorkflow(workflowStore.current.id)
  router.push('/edit/workflows')
}

function onSelectNode(nodeId: string) {
  workflowStore.setSelectedNodes([nodeId])
}

function toggleWorkflowMenu() {
  showWorkflowMenu.value = !showWorkflowMenu.value
}

function onDeleteNode(nodeId: string) {
  const current = workflowStore.current
  if (!current) return
  const nodes = (current.nodes ?? []).filter((n) => n.id !== nodeId)
  const edges = (current.edges ?? []).filter(
    (e) => e.source !== nodeId && e.target !== nodeId
  )
  workflowStore.setCurrent({ ...current, nodes, edges })
  workflowStore.setSelectedNodes([])
}

function onViewportChange(viewport: { x: number; y: number; zoom: number }) {
  workflowStore.setZoomPan(viewport.zoom, { x: viewport.x, y: viewport.y })
}

function onCanvasChange(payload: { nodes: WorkflowNode[]; edges: WorkflowEdge[] }) {
  const current = workflowStore.current
  if (!current) return
  workflowStore.setCurrent({
    ...current,
    nodes: payload.nodes,
    edges: payload.edges,
  })
}

function onAddNode(
  descriptor: { type: string; defaultConfig?: Record<string, unknown> },
  position: { x: number; y: number }
) {
  const current = workflowStore.current
  if (!current) return
  const nodeId = `node_${Date.now()}`
  const newNode: WorkflowNode = {
    id: nodeId,
    type: descriptor.type,
    position,
    config: { ...(descriptor.defaultConfig ?? {}) },
    meta: {},
  }
  const nodes = [...(current.nodes ?? []), newNode]
  workflowStore.setCurrent({ ...current, nodes })
}

function onNodeConfigUpdate(config: Record<string, unknown>) {
  const node = selectedNode.value
  const current = workflowStore.current
  if (!node || !current) return
  const nodes = current.nodes.map((n) =>
    n.id === node.id ? { ...n, config } : n
  )
  workflowStore.setCurrent({ ...current, nodes })
}

function onAddEdge(edge: Omit<WorkflowEdge, 'id'>) {
  const current = workflowStore.current
  if (!current) return
  const newEdge: WorkflowEdge = {
    ...edge,
    id: `edge_${Date.now()}`,
  }
  const edges = [...(current.edges ?? []), newEdge]
  workflowStore.setCurrent({ ...current, edges })
}

function onRemoveEdge(edgeId: string) {
  const current = workflowStore.current
  if (!current) return
  const edges = (current.edges ?? []).filter((e) => e.id !== edgeId)
  workflowStore.setCurrent({ ...current, edges })
}

function onSelectRun(run: WorkflowRun & { runId?: string }) {
  workflowStore.setCurrentRun(run as WorkflowRun & { nodeRuns?: NodeRun[] })
  showRunDetail.value = true
}
</script>

<style scoped>
/* Force light theme on workflow editor (override PrimeVue dark) */
.workflow-editor-page {
  --p-card-background: #fff;
  --p-surface-ground: #f8fafc;
  --p-surface-section: #f8fafc;
  --p-surface-0: #fff;
  --p-surface-50: #f8fafc;
  --p-surface-100: #f1f5f9;
  --p-surface-200: #e2e8f0;
  --p-surface-border: #e2e8f0;
  --p-surface-hover: #f1f5f9;
  --p-surface-hover-border: #cbd5e1;
  --p-text-color: #1e293b;
  --p-text-muted-color: #64748b;
  --p-input-background: #fff;
  --p-input-border: #e2e8f0;
  --p-primary-color: #6366f1;
  --p-green-50: #f0fdf4;
  --p-green-500: #22c55e;
  --p-red-500: #ef4444;
  --p-red-600: #dc2626;
  --p-orange-500: #f59e0b;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #fff;
  color: #1e293b;
}
.workflow-editor-page__header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid var(--p-surface-border);
  background: var(--p-card-background);
  flex-shrink: 0;
}
.workflow-editor-page__back {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--p-text-muted-color);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.15s;
}
.workflow-editor-page__back:hover {
  color: var(--p-primary-color);
}
.workflow-editor-page__back .pi {
  font-size: 0.8rem;
}
.workflow-editor-page__header-center {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}
.workflow-editor-page__title-input {
  width: 100%;
  max-width: 320px;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--p-text-color);
  background: transparent;
  border: none;
  padding: 0;
  outline: none;
}
.workflow-editor-page__title-input::placeholder {
  color: var(--p-text-muted-color);
}
.workflow-editor-page__subtitle {
  font-size: 0.75rem;
  color: var(--p-text-muted-color);
  margin: 0;
}
.workflow-editor-page__header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.workflow-editor-page__menu-btn {
  margin-left: 0.25rem;
}
.workflow-editor-page__menu-overlay {
  position: fixed;
  inset: 0;
  z-index: 40;
}
.workflow-editor-page__menu {
  position: fixed;
  top: 3.25rem;
  right: 1.25rem;
  background: #fff;
  border: 1px solid var(--p-surface-border);
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 0.25rem;
  z-index: 41;
  min-width: 160px;
}
.workflow-editor-page__menu-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: none;
  background: none;
  border-radius: 6px;
  font-size: 0.875rem;
  color: var(--p-text-color);
  cursor: pointer;
  text-align: left;
}
.workflow-editor-page__menu-item:hover {
  background: var(--p-surface-hover);
}
.workflow-editor-page__menu-item--danger {
  color: var(--p-red-600);
}
.workflow-editor-page__loading {
  padding: 3rem;
  text-align: center;
  color: var(--p-text-muted-color);
}
.workflow-editor-page__errors {
  margin: 0.5rem 1.25rem 0;
  border-radius: 6px;
}
.workflow-editor-page__errors-list {
  margin: 0;
  padding-left: 1.25rem;
  font-size: 0.875rem;
}
.workflow-editor-page__body {
  display: flex;
  flex: 1;
  min-height: 0;
  background: var(--p-surface-ground);
}
.workflow-editor-page__sidebar--left {
  width: 260px;
  flex-shrink: 0;
  border-right: 1px solid var(--p-surface-border);
  overflow-y: auto;
  background: var(--p-card-background);
}
.workflow-editor-page__sidebar--right {
  width: 300px;
  flex-shrink: 0;
  border-left: 1px solid var(--p-surface-border);
  overflow-y: auto;
  background: var(--p-card-background);
}
.workflow-editor-page__right-inner {
  display: flex;
  flex-direction: column;
  gap: 0;
  min-height: 100%;
}
.workflow-editor-page__section {
  padding: 1rem 1rem 0;
  border-bottom: 1px solid var(--p-surface-border);
}
.workflow-editor-page__section:last-child {
  border-bottom: none;
  padding-bottom: 1rem;
}
.workflow-editor-page__canvas-wrap {
  flex: 1;
  min-width: 0;
  position: relative;
}
.workflow-editor-page__panel-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin: 0 0 0.75rem;
  color: var(--p-text-muted-color);
}
.workflow-editor-page__run {
  background: var(--p-green-50);
  margin: 0 -1rem;
  padding-left: 1rem;
  padding-right: 1rem;
  border-radius: 0;
}
.workflow-editor-page__run-status {
  margin: 0;
  font-size: 0.875rem;
  color: var(--p-text-color);
}
.workflow-editor-page__run-error {
  color: var(--p-red-600);
  margin: 0.5rem 0 0;
  font-size: 0.8125rem;
}
.workflow-editor-page__modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}
.workflow-editor-page__modal-inner {
  background: var(--p-card-background);
  border-radius: var(--p-border-radius, 12px);
  max-width: 480px;
  width: 90%;
  max-height: 80vh;
  overflow: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Force PrimeVue components inside workflow editor to light theme */
.workflow-editor-page :deep(.p-inputtext),
.workflow-editor-page :deep(.p-select .p-select-label),
.workflow-editor-page :deep(.p-panel),
.workflow-editor-page :deep(.p-panel-content) {
  background: var(--p-surface-0) !important;
  color: var(--p-text-color) !important;
  border-color: var(--p-surface-border) !important;
}
.workflow-editor-page :deep(.p-select-overlay) {
  background: #fff !important;
  color: #1e293b !important;
}
</style>
