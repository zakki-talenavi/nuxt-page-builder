<template>
  <div
    class="workflow-canvas"
    ref="containerRef"
    @dragover.prevent
    @drop="onDrop"
  >
    <div
      class="workflow-canvas__grid"
      :style="gridStyle"
    />
    <!-- Edges as SVG -->
    <svg class="workflow-canvas__edges" :viewBox="svgViewBox" preserveAspectRatio="none">
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
        </marker>
      </defs>
      <template v-for="edge in edges" :key="edge.id">
        <line
          :x1="nodeCenter(edge.source).x"
          :y1="nodeCenter(edge.source).y"
          :x2="nodeCenter(edge.target).x"
          :y2="nodeCenter(edge.target).y"
          class="workflow-canvas__edge"
          stroke="#94a3b8"
          stroke-width="2"
          marker-end="url(#arrowhead)"
        />
      </template>
    </svg>
    <!-- Nodes -->
    <div
      v-for="node in nodes"
      :key="node.id"
      class="workflow-canvas__node"
      :class="[
        `workflow-canvas__node--${getCategory(node.type)}`,
        { 'workflow-canvas__node--selected': selectedNodeIds.includes(node.id) },
      ]"
      :style="nodeStyle(node)"
      @mousedown.stop="selectNode(node.id)"
    >
      <i :class="['pi', getDescriptor(node.type)?.icon || 'pi-circle', 'workflow-canvas__node-icon']" />
      <div class="workflow-canvas__node-label">{{ getDescriptor(node.type)?.label ?? node.type }}</div>
      <div class="workflow-canvas__node-sublabel">{{ getDescriptor(node.type)?.description ?? '' }}</div>
      <div class="workflow-canvas__node-handle workflow-canvas__node-handle--out" title="Output" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WorkflowNode, WorkflowEdge } from '~~/types/workflow'
import { getNodeDescriptor } from '~~/lib/workflow/descriptors'
import { computed, ref } from 'vue'

const props = defineProps<{
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  selectedNodeIds: string[]
  pan: { x: number; y: number }
  zoom: number
}>()

const emit = defineEmits<{
  selectNode: [id: string]
  updateNodePosition: [id: string, position: { x: number; y: number }]
  addNode: [descriptor: { type: string; defaultConfig?: Record<string, unknown> }, position: { x: number; y: number }]
}>()

const containerRef = ref<HTMLElement | null>(null)
const NODE_WIDTH = 200
const NODE_HEIGHT = 72

function getCategory(type: string): string {
  if (['form_submitted', 'schedule_cron', 'webhook_received', 'manual_trigger'].includes(type)) return 'trigger'
  if (['if_else', 'switch', 'filter_group'].includes(type)) return 'condition'
  return 'action'
}

function getDescriptor(type: string) {
  return getNodeDescriptor(type)
}

const nodeMap = computed(() => {
  const m = new Map<string, WorkflowNode>()
  props.nodes.forEach((n) => m.set(n.id, n))
  return m
})

function nodeCenter(nodeId: string): { x: number; y: number } {
  const node = nodeMap.value.get(nodeId)
  if (!node?.position) return { x: 0, y: 0 }
  return {
    x: node.position.x + NODE_WIDTH / 2,
    y: node.position.y + NODE_HEIGHT / 2,
  }
}

const bounds = computed(() => {
  let minX = 0, minY = 0, maxX = 800, maxY = 400
  props.nodes.forEach((n) => {
    if (n.position) {
      minX = Math.min(minX, n.position.x)
      minY = Math.min(minY, n.position.y)
      maxX = Math.max(maxX, n.position.x + NODE_WIDTH)
      maxY = Math.max(maxY, n.position.y + NODE_HEIGHT)
    }
  })
  return { minX, minY, maxX, maxY }
})

const svgViewBox = computed(() => {
  const { minX, minY, maxX, maxY } = bounds.value
  const pad = 40
  return `${minX - pad} ${minY - pad} ${maxX - minX + pad * 2} ${maxY - minY + pad * 2}`
})

const gridStyle = computed(() => ({
  backgroundPosition: `${props.pan.x}px ${props.pan.y}px`,
  backgroundSize: `${20 * props.zoom}px ${20 * props.zoom}px`,
  transform: `scale(${props.zoom}) translate(${props.pan.x}px, ${props.pan.y}px)`,
}))

function nodeStyle(node: WorkflowNode) {
  const pos = node.position ?? { x: 0, y: 0 }
  return {
    left: `${pos.x}px`,
    top: `${pos.y}px`,
  }
}

function selectNode(id: string) {
  emit('selectNode', id)
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  const raw = e.dataTransfer?.getData('application/json')
  if (!raw || !containerRef.value) return
  try {
    const descriptor = JSON.parse(raw) as { type: string; defaultConfig?: Record<string, unknown> }
    const rect = containerRef.value.getBoundingClientRect()
    const x = (e.clientX - rect.left) / props.zoom - props.pan.x - NODE_WIDTH / 2
    const y = (e.clientY - rect.top) / props.zoom - props.pan.y - NODE_HEIGHT / 2
    emit('addNode', descriptor, { x: Math.round(x), y: Math.round(y) })
  } catch {
    /* ignore */
  }
}
</script>

<style scoped>
.workflow-canvas {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;
  overflow: hidden;
  background: #f8fafc;
}
.workflow-canvas__grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, #cbd5e1 1px, transparent 1px);
  transform-origin: 0 0;
  pointer-events: none;
}
.workflow-canvas__edges {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.workflow-canvas__node {
  position: absolute;
  width: 200px;
  min-height: 72px;
  padding: 12px 14px;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: box-shadow 0.15s, border-color 0.15s;
}
.workflow-canvas__node:hover {
  border-color: #94a3b8;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.workflow-canvas__node--selected {
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.3);
}
.workflow-canvas__node--trigger {
  border-left: 4px solid #3b82f6;
}
.workflow-canvas__node--condition {
  border-left: 4px solid #10b981;
}
.workflow-canvas__node--action {
  border-left: 4px solid #f59e0b;
}
.workflow-canvas__node-icon {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 1rem;
  color: #6366f1;
}
.workflow-canvas__node-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  padding-right: 24px;
}
.workflow-canvas__node-sublabel {
  font-size: 0.7rem;
  color: #64748b;
  margin-top: 2px;
}
.workflow-canvas__node-handle--out {
  position: absolute;
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #94a3b8;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px #94a3b8;
}
</style>
