/**
 * Pinia store for workflows — list, current draft, runs, editor state.
 * Persists workflows to localStorage (client-only).
 */
import { defineStore } from 'pinia'
import type {
  WorkflowDefinition,
  WorkflowRun,
  NodeRun,
  WorkflowValidationError,
  WorkflowRunResult,
} from '~~/types/workflow'

const STORAGE_KEY = 'puck-workflows'

function isClient() {
  return typeof window !== 'undefined'
}

export const useWorkflowStore = defineStore('workflow', {
  state: () => ({
    workflows: [] as WorkflowDefinition[],
    current: null as WorkflowDefinition | null,
    runs: [] as Array<WorkflowRun & { runId?: string }>,
    currentRun: null as (WorkflowRun & { nodeRuns?: NodeRun[] }) | null,
    nodeRuns: [] as NodeRun[],
    validationErrors: [] as WorkflowValidationError[],
    editor: {
      selectedNodeIds: [] as string[],
      selectedEdgeIds: [] as string[],
      zoom: 1,
      pan: { x: 0, y: 0 },
    },
  }),

  getters: {
    currentWorkflow: (s) => s.current,
    currentRuns: (s) => s.runs,
    runsForCurrentWorkflow: (s) =>
      s.runs.filter((r) => r.workflowId === s.current?.id),
    formTriggerWorkflows: (s) =>
      s.workflows.filter((w) =>
        w.nodes?.some((n) => n.type === 'form_submitted')
      ),
  },

  actions: {
    loadFromStorage() {
      if (!isClient()) return
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
          const parsed = JSON.parse(raw) as WorkflowDefinition[]
          if (Array.isArray(parsed)) this.workflows = parsed
        }
      } catch {
        /* ignore */
      }
    },

    saveToStorage() {
      if (!isClient()) return
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.workflows))
      } catch {
        /* ignore */
      }
    },

    setWorkflows(list: WorkflowDefinition[]) {
      this.workflows = list
      this.saveToStorage()
    },

    setCurrent(workflow: WorkflowDefinition | null) {
      this.current = workflow
    },

    saveCurrentWorkflow() {
      const w = this.current
      if (!w) return
      const copy = { ...w }
      const idx = this.workflows.findIndex((x) => x.id === copy.id)
      if (idx >= 0) this.workflows[idx] = copy
      else this.workflows.push(copy)
      this.saveToStorage()
    },

    deleteWorkflow(id: string) {
      this.workflows = this.workflows.filter((w) => w.id !== id)
      if (this.current?.id === id) this.current = null
      this.saveToStorage()
    },

    addRun(run: WorkflowRun | (WorkflowRunResult & { workflowId?: string })) {
      const id = 'id' in run ? run.id : run.runId
      const workflowId = 'workflowId' in run ? run.workflowId : undefined
      const status = 'status' in run ? run.status : 'completed'
      const validStatus: WorkflowRun['status'] =
        status === 'pending' || status === 'running' || status === 'completed' || status === 'failed' || status === 'partial'
          ? status
          : 'completed'
      const entry: WorkflowRun & { runId?: string; nodeRuns?: NodeRun[] } = {
        id,
        workflowId: workflowId ?? '',
        status: validStatus,
        triggerType: 'triggerType' in run ? run.triggerType : undefined,
        triggerPayload: 'triggerPayload' in run ? run.triggerPayload : undefined,
        errorMessage: 'errorMessage' in run ? run.errorMessage : undefined,
        runId: 'runId' in run ? run.runId : undefined,
        nodeRuns: 'nodeRuns' in run ? (run.nodeRuns as NodeRun[]) : undefined,
      }
      this.runs = [entry, ...this.runs].slice(0, 100)
    },

    setCurrentRun(run: (WorkflowRun & { nodeRuns?: NodeRun[] }) | null) {
      this.currentRun = run
      this.nodeRuns = run?.nodeRuns ?? []
    },

    setValidationErrors(errors: WorkflowValidationError[]) {
      this.validationErrors = errors
    },

    setSelectedNodes(ids: string[]) {
      this.editor.selectedNodeIds = ids
    },

    setSelectedEdges(ids: string[]) {
      this.editor.selectedEdgeIds = ids
    },

    setZoomPan(zoom: number, pan: { x: number; y: number }) {
      this.editor.zoom = zoom
      this.editor.pan = pan
    },

    clearSelection() {
      this.editor.selectedNodeIds = []
      this.editor.selectedEdgeIds = []
    },
  },
})
