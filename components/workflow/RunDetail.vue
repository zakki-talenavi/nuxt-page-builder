<template>
  <div class="run-detail">
    <div class="run-detail__header">
      <h4 class="run-detail__title">Detail run</h4>
      <button type="button" class="run-detail__close" aria-label="Tutup" @click="$emit('close')">×</button>
    </div>
    <template v-if="run">
      <p class="run-detail__status" :class="`run-detail__status--${run.status}`">
        <strong>Status:</strong> {{ run.status }}
      </p>
      <p v-if="run.errorMessage" class="run-detail__error">{{ run.errorMessage }}</p>
      <p class="run-detail__meta">Run ID: {{ run.runId ?? run.id ?? '—' }}</p>
      <div v-if="nodeRuns?.length" class="run-detail__nodes">
        <h5>Node runs</h5>
        <ul class="run-detail__list">
          <li v-for="nr in nodeRuns" :key="nr.id" class="run-detail__node" :class="`run-detail__node--${nr.status}`">
            <span class="run-detail__node-id">{{ nr.nodeId }}</span>
            <span class="run-detail__node-status">{{ nr.status }}</span>
            <p v-if="nr.errorMessage" class="run-detail__node-error">{{ nr.errorMessage }}</p>
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { WorkflowRun, NodeRun } from '~~/types/workflow'

defineProps<{
  run: (WorkflowRun & { runId?: string }) | null
  nodeRuns?: NodeRun[]
}>()

defineEmits<{
  close: []
}>()
</script>

<style scoped>
.run-detail {
  padding: 12px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-top: 8px;
}
.run-detail__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.run-detail__title {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0;
}
.run-detail__close {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0 4px;
  line-height: 1;
}
.run-detail__status { margin: 0 0 4px; font-size: 0.875rem; }
.run-detail__status--completed { color: #22c55e; }
.run-detail__status--failed { color: #ef4444; }
.run-detail__error { color: #ef4444; font-size: 0.8rem; margin: 4px 0; }
.run-detail__meta { font-size: 0.75rem; color: #6b7280; margin: 0 0 12px; }
.run-detail__nodes h5 { font-size: 0.8rem; margin: 8px 0 4px; }
.run-detail__list { list-style: none; padding: 0; margin: 0; }
.run-detail__node { padding: 6px 8px; border-radius: 4px; margin-bottom: 4px; font-size: 0.8rem; border-left: 3px solid #94a3b8; }
.run-detail__node--completed { border-left-color: #22c55e; }
.run-detail__node--failed { border-left-color: #ef4444; }
.run-detail__node-id { font-weight: 600; margin-right: 8px; }
.run-detail__node-error { color: #ef4444; margin: 4px 0 0; font-size: 0.75rem; }
</style>
