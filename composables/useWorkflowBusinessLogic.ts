/**
 * Business logic layer for workflow:
 * - Validation (DAG, single trigger, reachable)
 * - Variable resolution ({{ payload.x }})
 * - Node descriptor helpers
 */
import type { WorkflowDefinition, WorkflowNode, WorkflowValidationError } from '~~/types/workflow'
import { getNodeDescriptor } from '~~/lib/workflow/descriptors'

export function useWorkflowBusinessLogic() {
  const { validate } = useWorkflowValidation()

  /**
   * Resolve {{ path }} expressions in a string using context.
   * Example: resolveVariables('Hello {{ payload.name }}', { payload: { name: 'World' } }) → 'Hello World'
   */
  function resolveVariables(
    template: string,
    context: Record<string, unknown>
  ): string {
    if (typeof template !== 'string') return String(template)
    return template.replace(/\{\{\s*([^}]+)\s*\}\}/g, (_, path) => {
      const keys = path.trim().split('.')
      let value: unknown = context
      for (const key of keys) {
        value = value != null && typeof value === 'object' && key in value
          ? (value as Record<string, unknown>)[key]
          : undefined
      }
      return value != null ? String(value) : ''
    })
  }

  /**
   * Resolve all {{ }} in an object (recursively for string values).
   */
  function resolveObject(
    obj: Record<string, unknown>,
    context: Record<string, unknown>
  ): Record<string, unknown> {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === 'string') {
        out[k] = resolveVariables(v, context)
      } else if (v != null && typeof v === 'object' && !Array.isArray(v)) {
        out[k] = resolveObject(v as Record<string, unknown>, context)
      } else {
        out[k] = v
      }
    }
    return out
  }

  function getCategory(type: string): 'trigger' | 'condition' | 'action' {
    const d = getNodeDescriptor(type)
    if (d) return d.category
    if (['form_submitted', 'schedule_cron', 'webhook_received', 'manual_trigger'].includes(type)) return 'trigger'
    if (['if_else', 'switch', 'filter_group'].includes(type)) return 'condition'
    return 'action'
  }

  return {
    validate,
    resolveVariables,
    resolveObject,
    getNodeDescriptor,
    getCategory,
  }
}
