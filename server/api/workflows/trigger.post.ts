/**
 * POST /api/workflows/trigger
 * Body: { workflow?, workflowId?, triggerType, payload }
 * Returns run summary. Mock implementation for frontend; replace with real executor later.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody<{
    workflow?: { id: string; nodes?: unknown[] }
    workflowId?: string
    triggerType?: string
    payload?: unknown
  }>(event)
  const { workflow, triggerType = 'manual_trigger' } = body ?? {}
  const workflowId = workflow?.id ?? body?.workflowId ?? 'unknown'
  const runId = `run_${Date.now()}`
  return {
    runId,
    status: 'completed',
    workflowId,
    triggerType,
    nodeRuns: workflow?.nodes?.map((n: any, i: number) => ({
      id: `nr_${i}`,
      workflowRunId: runId,
      nodeId: n.id ?? `node_${i}`,
      status: 'completed',
      attempt: 1,
    })) ?? [],
  }
})
