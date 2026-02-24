/**
 * Adapter: WorkflowDefinition (JSON schema) ↔ Vue Flow nodes/edges.
 * Single source of truth: WorkflowDefinition. Vue Flow is view state.
 */
import type { WorkflowNode, WorkflowEdge } from '~~/types/workflow'

export const WORKFLOW_NODE_TYPE = 'workflow-node'

/** Inject key for delete-node callback (canvas provides, node card injects) */
export const WORKFLOW_DELETE_NODE_KEY = 'workflowDeleteNode'

/** Vue Flow node shape (compatible with @vue-flow/core) */
export interface VueFlowNode<T = unknown> {
  id: string
  type: string
  position: { x: number; y: number }
  data: T
}

/** Vue Flow edge shape */
export interface VueFlowEdge {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
}

export interface WorkflowNodeData {
  workflowNode: WorkflowNode
  label: string
  description?: string
  category: 'trigger' | 'condition' | 'action'
  icon?: string
}

/** Workflow nodes + edges → Vue Flow nodes + edges */
export function toVueFlow(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  getLabel: (type: string) => string,
  getDescription: (type: string) => string,
  getCategory: (type: string) => 'trigger' | 'condition' | 'action',
  getIcon: (type: string) => string | undefined
): { nodes: VueFlowNode<WorkflowNodeData>[]; edges: VueFlowEdge[] } {
  const vfNodes: VueFlowNode<WorkflowNodeData>[] = nodes.map((n) => ({
    id: n.id,
    type: WORKFLOW_NODE_TYPE,
    position: n.position ?? { x: 0, y: 0 },
    data: {
      workflowNode: n,
      label: getLabel(n.type),
      description: getDescription(n.type),
      category: getCategory(n.type),
      icon: getIcon(n.type),
    },
  }))
  const vfEdges: VueFlowEdge[] = edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle ?? undefined,
    targetHandle: undefined,
  }))
  return { nodes: vfNodes, edges: vfEdges }
}

/** Vue Flow nodes + edges → Workflow nodes + edges (persist as JSON) */
export function fromVueFlow(
  vfNodes: VueFlowNode<WorkflowNodeData>[],
  vfEdges: VueFlowEdge[]
): { nodes: WorkflowNode[]; edges: WorkflowEdge[] } {
  const nodes: WorkflowNode[] = vfNodes.map((n) => {
    const d = n.data
    return {
      ...d.workflowNode,
      id: n.id,
      position: n.position ? { x: n.position.x, y: n.position.y } : undefined,
    }
  })
  const edges: WorkflowEdge[] = vfEdges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle ?? null,
  }))
  return { nodes, edges }
}
