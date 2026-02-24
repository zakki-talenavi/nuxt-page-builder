/**
 * Workflow frontend types — definitions, runs, palette, validation.
 */

export interface WorkflowDefinition {
  id: string
  name: string
  description?: string
  version: number
  status?: 'draft' | 'published'
  publishedAt?: string
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  createdAt?: string
  updatedAt?: string
}

export interface WorkflowNode {
  id: string
  type: string
  position?: { x: number; y: number }
  config: Record<string, unknown>
  meta?: NodeMeta
}

export interface NodeMeta {
  timeoutMs?: number
  retryPolicy?: {
    maxAttempts: number
    backoffMs?: number
    backoffMultiplier?: number
  }
  inputMapping?: Record<string, string>
  outputMapping?: Record<string, string>
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
  sourceHandle?: string | null
}

export interface WorkflowVersion {
  id: string
  workflowId: string
  version: number
  definition: WorkflowDefinition
  publishedAt: string
}

export interface WorkflowRun {
  id: string
  workflowId: string
  workflowVersionId?: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'partial'
  triggerType?: string
  triggerPayload?: Record<string, unknown>
  startedAt?: string
  completedAt?: string
  errorMessage?: string
  createdAt?: string
  nodeRuns?: NodeRun[]
}

export interface NodeRun {
  id: string
  workflowRunId: string
  nodeId: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped'
  input?: Record<string, unknown>
  output?: Record<string, unknown>
  errorMessage?: string
  startedAt?: string
  completedAt?: string
  attempt: number
}

export interface NodeTypeDescriptor {
  type: string
  category: 'trigger' | 'condition' | 'action'
  label: string
  description?: string
  icon?: string
  defaultMeta?: Partial<NodeMeta>
  defaultConfig?: Record<string, unknown>
  /** Branch keys for condition nodes (e.g. ['true', 'false'] or ['approve', 'reject']) */
  branches?: string[]
}

export interface WorkflowValidationError {
  nodeId?: string | null
  edgeId?: string | null
  code: string
  message: string
}

/** Result from POST /api/workflows/trigger (run summary) */
export interface WorkflowRunResult {
  runId: string
  status: string
  errorMessage?: string
  nodeRuns?: NodeRun[]
}
