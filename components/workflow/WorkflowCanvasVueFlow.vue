<template>
  <ClientOnly>
    <div
      ref="containerRef"
      class="workflow-canvas-vueflow"
      @dragover.prevent
      @drop="onDrop"
    >
      <VueFlow
        v-model:nodes="flowNodes"
        v-model:edges="flowEdges"
        :node-types="(nodeTypes as any)"
        :default-edge-options="defaultEdgeOptions"
        :min-zoom="0.2"
        :max-zoom="2"
        :default-viewport="defaultViewport"
        fit-view-on-init
        pan-on-drag
        zoom-on-scroll
        zoom-on-pinch
        nodes-draggable
        nodes-connectable
        elements-selectable
        :select-nodes-on-drag="false"
        @nodes-change="onNodesChange"
        @edges-change="onEdgesChange"
        @connect="onConnect"
        @node-click="(e) => onNodeClick(e)"
        @viewport-change="onViewportChange"
        @pane-click="onPaneClick"
      >
        <Background
          :pattern-color="patternColor"
          :gap="16"
          class="workflow-canvas-vueflow__bg"
        />
        <Controls class="workflow-canvas-vueflow__controls" show-interactive />
      </VueFlow>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { VueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'
import type { WorkflowNode, WorkflowEdge } from '~~/types/workflow'
import { WORKFLOW_NODE_TYPE, toVueFlow, fromVueFlow } from '~~/lib/workflow/vue-flow-adapter'
import { getNodeDescriptor } from '~~/lib/workflow/descriptors'
import WorkflowNodeCard from '~~/components/workflow/nodes/WorkflowNodeCard.vue'
import { watch, ref, provide } from 'vue'
import { WORKFLOW_DELETE_NODE_KEY } from '~~/lib/workflow/vue-flow-adapter'

const props = defineProps<{
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  selectedNodeIds: string[]
  pan: { x: number; y: number }
  zoom: number
  deleteNode?: (nodeId: string) => void
}>()

const emit = defineEmits<{
  selectNode: [id: string]
  updateNodePosition: [id: string, position: { x: number; y: number }]
  addNode: [descriptor: { type: string; defaultConfig?: Record<string, unknown> }, position: { x: number; y: number }]
  change: [payload: { nodes: WorkflowNode[]; edges: WorkflowEdge[] }]
  viewportChange: [viewport: { x: number; y: number; zoom: number }]
  paneClick: []
}>()

const containerRef = ref<HTMLElement | null>(null)
/** Latest viewport from Vue Flow for correct drop position */
const lastViewport = ref({ x: 0, y: 0, zoom: 1 })
const nodeTypes: Record<string, unknown> = { [WORKFLOW_NODE_TYPE]: WorkflowNodeCard }

provide(WORKFLOW_DELETE_NODE_KEY, props.deleteNode)

const defaultEdgeOptions = { type: 'smoothstep', animated: false }
const defaultViewport = { x: 0, y: 0, zoom: 1 }
const patternColor = '#d1d5db'

function getLabel(type: string) {
  return getNodeDescriptor(type)?.label ?? type
}
function getDesc(type: string) {
  return getNodeDescriptor(type)?.description ?? ''
}
function getCategory(type: string): 'trigger' | 'condition' | 'action' {
  return getNodeDescriptor(type)?.category ?? 'action'
}
function getIcon(type: string) {
  return getNodeDescriptor(type)?.icon
}

/** Warna edge berdasarkan cabang If/Else agar alur True/False terbaca */
function edgeStyle(sourceHandle: string | undefined | null) {
  if (sourceHandle === 'true') return { stroke: '#16a34a', strokeWidth: 2 }
  if (sourceHandle === 'false') return { stroke: '#dc2626', strokeWidth: 2 }
  return { stroke: '#94a3b8', strokeWidth: 2 }
}

function toFlowEdgesWithStyle(nodes: WorkflowNode[], edges: WorkflowEdge[]) {
  const { edges: raw } = toVueFlow(nodes, edges, getLabel, getDesc, getCategory, getIcon)
  return raw.map((e) => ({ ...e, style: edgeStyle(e.sourceHandle) }))
}

const flowState = toVueFlow(
  props.nodes,
  props.edges,
  getLabel,
  getDesc,
  getCategory,
  getIcon
)
const flowNodes = ref(flowState.nodes)
const flowEdges = ref(toFlowEdgesWithStyle(props.nodes, props.edges))

watch(
  () => [props.nodes, props.edges],
  () => {
    const next = toVueFlow(props.nodes, props.edges, getLabel, getDesc, getCategory, getIcon)
    flowNodes.value = next.nodes
    flowEdges.value = toFlowEdgesWithStyle(props.nodes, props.edges)
  },
  { deep: true }
)

let changeTimeout: ReturnType<typeof setTimeout> | null = null
function scheduleChange() {
  if (changeTimeout) clearTimeout(changeTimeout)
  changeTimeout = setTimeout(() => {
    changeTimeout = null
    const { nodes, edges } = fromVueFlow(flowNodes.value, flowEdges.value)
    emit('change', { nodes, edges })
  }, 50)
}

function onNodesChange() {
  scheduleChange()
}

function onEdgesChange() {
  scheduleChange()
}

function onConnect(conn: { source: string; target: string; sourceHandle?: string | null }) {
  const { nodes, edges } = fromVueFlow(flowNodes.value, flowEdges.value)
  const newEdge: WorkflowEdge = {
    id: `edge_${Date.now()}`,
    source: conn.source,
    target: conn.target,
    sourceHandle: conn.sourceHandle ?? null,
  }
  emit('change', { nodes, edges: [...edges, newEdge] })
}

function onNodeClick(evt: { node?: { id?: string } }) {
  if (evt?.node?.id) emit('selectNode', evt.node.id)
}

function onViewportChange(viewport: { x: number; y: number; zoom: number }) {
  lastViewport.value = { ...viewport }
  emit('viewportChange', viewport)
}

function onPaneClick() {
  emit('paneClick')
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  const raw = e.dataTransfer?.getData('application/json')
  if (!raw || !containerRef.value) return
  try {
    const descriptor = JSON.parse(raw) as { type: string; defaultConfig?: Record<string, unknown> }
    const rect = containerRef.value.getBoundingClientRect()
    const v = lastViewport.value
    const flowX = (e.clientX - rect.left - v.x) / v.zoom
    const flowY = (e.clientY - rect.top - v.y) / v.zoom
    emit('addNode', descriptor, { x: Math.round(flowX), y: Math.round(flowY) })
  } catch {
    /* ignore */
  }
}
</script>

<style scoped>
.workflow-canvas-vueflow {
  width: 100%;
  height: 100%;
  min-height: 400px;
  background: #f1f5f9;
  border-radius: 8px;
}
.workflow-canvas-vueflow :deep(.vue-flow) {
  background: #f1f5f9;
}
.workflow-canvas-vueflow :deep(.vue-flow__edge-path) {
  stroke: #94a3b8;
  stroke-width: 2;
}
.workflow-canvas-vueflow :deep(.vue-flow__edge.selected .vue-flow__edge-path) {
  stroke: #6366f1;
}
.workflow-canvas-vueflow__controls :deep(.vue-flow__controls-button) {
  background: #fff;
  border: 1px solid #e2e8f0;
  color: #475569;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
.workflow-canvas-vueflow__controls :deep(.vue-flow__controls-button:hover) {
  background: #f8fafc;
  color: #1e293b;
}
</style>
