/**
 * Client-side workflow validation: single trigger, DAG, edges valid, reachable.
 */
import type {
  WorkflowDefinition,
  WorkflowNode,
  WorkflowEdge,
  WorkflowValidationError,
} from '~~/types/workflow'

export function useWorkflowValidation() {
  function validate(workflow: WorkflowDefinition | null): WorkflowValidationError[] {
    const errors: WorkflowValidationError[] = []
    if (!workflow) return errors

    const { nodes, edges } = workflow
    const nodeIds = new Set(nodes.map((n) => n.id))

    // Exactly one trigger: entry (no incoming) atau satu-satunya trigger (boleh ada edge masuk, e.g. Revise → Form submitted)
    const isTriggerType = (n: WorkflowNode) =>
      ['form_submitted', 'schedule_cron', 'webhook_received', 'manual_trigger'].includes(n.type)
    const targets = new Set(edges.map((e) => e.target))
    const allTriggers = nodes.filter((n) => isTriggerType(n))
    const entryTriggers = allTriggers.filter((n) => !targets.has(n.id))
    if (allTriggers.length === 0) {
      errors.push({ code: 'NO_TRIGGER', message: 'Workflow harus memiliki tepat satu node trigger.' })
    } else if (entryTriggers.length > 1) {
      errors.push({ code: 'MULTIPLE_TRIGGERS', message: 'Hanya boleh ada satu node trigger.' })
    }

    // Edges reference existing nodes
    for (const e of edges) {
      if (!nodeIds.has(e.source)) {
        errors.push({
          edgeId: e.id,
          code: 'INVALID_SOURCE',
          message: `Edge source "${e.source}" bukan node yang ada.`,
        })
      }
      if (!nodeIds.has(e.target)) {
        errors.push({
          edgeId: e.id,
          code: 'INVALID_TARGET',
          message: `Edge target "${e.target}" bukan node yang ada.`,
        })
      }
    }

    // No cycles (DFS) — root = entry trigger, atau satu-satunya trigger jika ada edge masuk (loop back)
    const triggerId = entryTriggers[0]?.id ?? (allTriggers.length === 1 ? allTriggers[0]?.id : undefined)
    if (triggerId && nodes.length > 0) {
      const visited = new Set<string>()
      const stack = new Set<string>()
      function visit(id: string): boolean {
        if (stack.has(id)) {
          // Loop kembali ke trigger (e.g. Revise → Form submitted) diperbolehkan
          if (id === triggerId) return false
          return true // cycle lain
        }
        if (visited.has(id)) return false
        visited.add(id)
        stack.add(id)
        for (const e of edges) {
          if (e.source === id && visit(e.target)) {
            stack.delete(id)
            return true
          }
        }
        stack.delete(id)
        return false
      }
      if (triggerId && visit(triggerId)) {
        errors.push({ code: 'CYCLE', message: 'Graph tidak boleh memiliki cycle (DAG).' })
      }
      // All nodes reachable from trigger
      for (const n of nodes) {
        if (!visited.has(n.id)) {
          errors.push({
            nodeId: n.id,
            code: 'UNREACHABLE',
            message: `Node "${n.type}" tidak terjangkau dari trigger.`,
          })
        }
      }
    }

    return errors
  }

  return { validate }
}
