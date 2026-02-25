<template>
  <div
    class="workflow-node-card"
    :class="[
      `workflow-node-card--${data?.category ?? 'action'}`,
      { 'workflow-node-card--selected': selected }
    ]"
  >
    <Handle type="target" :position="Position.Top" class="workflow-node-card__handle workflow-node-card__handle--in" />
    <div class="workflow-node-card__body">
      <div class="workflow-node-card__header">
        <div class="workflow-node-card__icon-wrap">
          <i :class="['pi', data?.icon ?? 'pi-circle', 'workflow-node-card__icon']" />
        </div>
        <div class="workflow-node-card__title-wrap">
          <span class="workflow-node-card__label">{{ data?.label ?? 'Node' }}</span>
          <p v-if="data?.description" class="workflow-node-card__desc">{{ data?.description }}</p>
        </div>
        <div class="workflow-node-card__actions">
          <button
            type="button"
            class="workflow-node-card__action-btn"
            title="Konfigurasi"
          >
            <i class="pi pi-cog" />
          </button>
          <button
            v-if="deleteNode"
            type="button"
            class="workflow-node-card__action-btn workflow-node-card__action-btn--danger"
            title="Hapus"
            @click.stop="onDeleteClick"
          >
            <i class="pi pi-trash" />
          </button>
        </div>
      </div>
      <div v-if="isConditionWithBranches" class="workflow-node-card__branches">
        <div class="workflow-node-card__branch workflow-node-card__branch--true">
          <div class="workflow-node-card__branch-btn">True</div>
          <div class="workflow-node-card__branch-out">
            <Handle type="source" :position="Position.Bottom" id="true" class="workflow-node-card__handle workflow-node-card__handle--branch workflow-node-card__handle--branch-true" />
          </div>
        </div>
        <div class="workflow-node-card__branch workflow-node-card__branch--false">
          <div class="workflow-node-card__branch-btn">False</div>
          <div class="workflow-node-card__branch-out">
            <Handle type="source" :position="Position.Bottom" id="false" class="workflow-node-card__handle workflow-node-card__handle--branch workflow-node-card__handle--branch-false" />
          </div>
        </div>
      </div>
      <!-- Approval: satu tombol + handle per opsi (Approve, Reject, Revise, dll.) -->
      <div v-else-if="isApprovalWithBranches" class="workflow-node-card__branches">
        <div
          v-for="opt in approvalOptions"
          :key="opt.id"
          class="workflow-node-card__branch"
        >
          <div
            class="workflow-node-card__branch-btn"
            :style="approvalOptionStyle(opt)"
          >
            {{ opt.label }}
          </div>
          <div class="workflow-node-card__branch-out">
            <Handle
              type="source"
              :position="Position.Bottom"
              :id="opt.id"
              class="workflow-node-card__handle workflow-node-card__handle--branch"
              :style="{ background: opt.color || '#94a3b8', boxShadow: `0 0 0 2px #fff, 0 0 0 3px ${opt.color || '#94a3b8'}` }"
            />
          </div>
        </div>
      </div>
      <!-- Single output handle for non-condition -->
      <div v-else class="workflow-node-card__out">
        <Handle type="source" :position="Position.Bottom" class="workflow-node-card__handle workflow-node-card__handle--out" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import type { WorkflowNodeData } from '~~/lib/workflow/vue-flow-adapter'
import { WORKFLOW_DELETE_NODE_KEY } from '~~/lib/workflow/vue-flow-adapter'
import { computed, inject } from 'vue'

const props = withDefaults(
  defineProps<{
    data?: WorkflowNodeData | null
    selected?: boolean
    node?: { data?: WorkflowNodeData; selected?: boolean; id?: string }
  }>(),
  {}
)

const data = computed(() => props.data ?? props.node?.data ?? null)
const selected = computed(() => props.selected ?? props.node?.selected ?? false)
const nodeId = computed(() => props.node?.id ?? data.value?.workflowNode?.id ?? '')
const deleteNode = inject<((id: string) => void) | undefined>(WORKFLOW_DELETE_NODE_KEY)

const isConditionWithBranches = computed(
  () => data.value?.category === 'condition' && data.value?.workflowNode?.type === 'if_else'
)

const isApprovalWithBranches = computed(
  () => data.value?.category === 'action' && data.value?.workflowNode?.type === 'approve_or_reject'
)

interface ApprovalOption { id: string; label: string; color?: string }
const approvalOptions = computed<ApprovalOption[]>(() => {
  const opts = data.value?.workflowNode?.config?.options
  if (!Array.isArray(opts) || opts.length === 0) {
    return [
      { id: 'approve', label: 'Approve', color: '#16a34a' },
      { id: 'reject', label: 'Reject', color: '#dc2626' },
      { id: 'revise', label: 'Revise', color: '#eab308' },
    ]
  }
  return opts.filter((o: unknown) => o && typeof o === 'object' && 'id' in o && 'label' in o) as ApprovalOption[]
})

function approvalOptionStyle(opt: ApprovalOption) {
  const c = opt.color || '#94a3b8'
  return {
    background: `${c}20`,
    color: c,
    border: `1px solid ${c}40`,
  }
}

function onDeleteClick(e: Event) {
  e.stopPropagation()
  if (nodeId.value && deleteNode) deleteNode(nodeId.value)
}
</script>

<style scoped>
.workflow-node-card {
  min-width: 200px;
  max-width: 280px;
  cursor: pointer;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  position: relative;
}
.workflow-node-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.workflow-node-card--selected {
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.25);
}
.workflow-node-card--trigger {
  border-left: 4px solid #3b82f6;
}
.workflow-node-card--condition {
  border-left: 4px solid #22c55e;
}
.workflow-node-card--action {
  border-left: 4px solid #f59e0b;
}
.workflow-node-card__body {
  padding: 12px 14px;
}
.workflow-node-card__header {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}
.workflow-node-card__icon-wrap {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eef2ff;
  color: #6366f1;
}
.workflow-node-card--trigger .workflow-node-card__icon-wrap {
  background: #dbeafe;
  color: #3b82f6;
}
.workflow-node-card--condition .workflow-node-card__icon-wrap {
  background: #dcfce7;
  color: #22c55e;
}
.workflow-node-card--action .workflow-node-card__icon-wrap {
  background: #fffbeb;
  color: #f59e0b;
}
.workflow-node-card__icon {
  font-size: 1rem;
}
.workflow-node-card__title-wrap {
  flex: 1;
  min-width: 0;
}
.workflow-node-card__label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  display: block;
}
.workflow-node-card__desc {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0.25rem 0 0;
  line-height: 1.3;
}
.workflow-node-card__actions {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}
.workflow-node-card__action-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  border-radius: 6px;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
}
.workflow-node-card__action-btn:hover {
  background: #f1f5f9;
  color: #1e293b;
}
.workflow-node-card__action-btn--danger:hover {
  background: #fef2f2;
  color: #dc2626;
}
.workflow-node-card__action-btn .pi {
  font-size: 0.8rem;
}
.workflow-node-card__branches {
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
}
.workflow-node-card__branch {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  position: relative;
  min-width: 0;
}
/* Tombol cabang (seperti Approve/Reject di Approval) */
.workflow-node-card__branch-btn {
  width: 100%;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
  text-align: center;
  border: none;
  cursor: default;
}
.workflow-node-card__branch--true .workflow-node-card__branch-btn {
  background: #dcfce7;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}
.workflow-node-card__branch--false .workflow-node-card__branch-btn {
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
}
/* Baris titik koneksi di bawah tombol (seperti + di bawah Approve/Reject) */
.workflow-node-card__branch-out {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 20px;
  padding: 2px 0;
  position: relative;
}
.workflow-node-card__out {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: center;
}
.workflow-node-card__handle {
  width: 12px;
  height: 12px;
  background: #94a3b8;
  border: 2px solid #fff;
  border-radius: 50%;
  box-shadow: 0 0 0 1px #94a3b8;
}
.workflow-node-card__handle--in {
  left: 50%;
  top: -6px;
  transform: translateX(-50%);
}
.workflow-node-card__handle--out {
  left: 50%;
  bottom: -6px;
  top: auto;
  transform: translateX(-50%);
}
.workflow-node-card__handle--branch {
  flex-shrink: 0;
  position: relative;
  right: 0;
  top: 0;
  transform: none;
}
.workflow-node-card__handle--branch-true {
  background: #16a34a;
  box-shadow: 0 0 0 2px #fff, 0 0 0 3px #16a34a;
}
.workflow-node-card__handle--branch-false {
  background: #dc2626;
  box-shadow: 0 0 0 2px #fff, 0 0 0 3px #dc2626;
}
</style>
