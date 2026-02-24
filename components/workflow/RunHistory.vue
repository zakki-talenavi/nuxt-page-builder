<template>
  <div class="run-history">
    <h4 class="run-history__title">Riwayat run</h4>
    <div v-if="runs.length === 0" class="run-history__empty">Belum ada run.</div>
    <ul v-else class="run-history__list">
      <li
        v-for="run in runs"
        :key="run.runId || run.id || run.createdAt"
        class="run-history__item"
        :class="`run-history__item--${run.status}`"
        @click="$emit('selectRun', run)"
      >
        <span class="run-history__status">{{ run.status }}</span>
        <span class="run-history__meta">{{ run.triggerType ?? 'manual' }} · {{ formatDate(run.createdAt ?? run.startedAt) }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { WorkflowRun } from '~~/types/workflow'

defineProps<{
  runs: (WorkflowRun & { runId?: string })[]
}>()

defineEmits<{
  selectRun: [run: WorkflowRun & { runId?: string }]
}>()

function formatDate(v: string | undefined) {
  if (!v) return '—'
  try {
    const d = new Date(v)
    return d.toLocaleString()
  } catch {
    return v
  }
}
</script>

<style scoped>
.run-history__title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin: 0 0 0.75rem;
  color: var(--p-text-muted-color, #64748b);
}
.run-history__empty {
  font-size: 0.8125rem;
  color: var(--p-text-muted-color, #64748b);
}
.run-history__list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.run-history__item {
  padding: 0.5rem 0.625rem;
  border-radius: var(--p-border-radius, 6px);
  cursor: pointer;
  margin-bottom: 0.25rem;
  font-size: 0.8125rem;
  background: var(--p-surface-50, #f8fafc);
  border: 1px solid var(--p-surface-border, #e2e8f0);
  border-left-width: 3px;
}
.run-history__item:hover {
  background: var(--p-surface-hover, #f1f5f9);
}
.run-history__item--completed {
  border-left-color: var(--p-green-500, #22c55e);
}
.run-history__item--failed {
  border-left-color: var(--p-red-500, #ef4444);
}
.run-history__item--running,
.run-history__item--pending {
  border-left-color: var(--p-primary-color, #6366f1);
}
.run-history__status {
  display: block;
  font-weight: 600;
  text-transform: capitalize;
  color: var(--p-text-color, #1e293b);
}
.run-history__meta {
  font-size: 0.75rem;
  color: var(--p-text-muted-color, #64748b);
}
</style>
