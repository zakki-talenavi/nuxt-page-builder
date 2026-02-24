<template>
  <BuilderPageTabs>
    <div class="builder-workflows">
      <section class="builder-workflows__section">
        <div class="builder-workflows__section-head">
          <h2 class="builder-workflows__section-title">Your workflows</h2>
          <div class="builder-workflows__section-actions">
            <NuxtLink to="/edit/workflows" class="builder-workflows__link">All workflows</NuxtLink>
            <NuxtLink to="/workflows/new" class="builder-workflows__btn-new">+ New workflow</NuxtLink>
          </div>
        </div>
        <div v-if="workflowStore.workflows.length === 0" class="builder-workflows__empty">
          <p>Belum ada workflow.</p>
          <NuxtLink to="/workflows/new" class="builder-workflows__btn-new builder-workflows__btn-new--inline">+ New workflow</NuxtLink>
        </div>
        <div v-else class="builder-workflows__cards">
          <NuxtLink
            v-for="wf in workflowStore.workflows.slice(0, 6)"
            :key="wf.id"
            :to="`/workflows/${wf.id}`"
            class="builder-workflows__card"
          >
            <div class="builder-workflows__card-icons">
              <i class="pi pi-file" />
              <i class="pi pi-users" />
            </div>
            <div class="builder-workflows__card-main">
              <h3 class="builder-workflows__card-title">{{ wf.name || 'Untitled' }}</h3>
              <p class="builder-workflows__card-meta">
                {{ triggerLabel(wf) }} • {{ firstActionLabel(wf) }}
              </p>
            </div>
            <span class="builder-workflows__card-status">Disabled</span>
            <span class="builder-workflows__card-menu" aria-hidden="true">
              <i class="pi pi-ellipsis-v" />
            </span>
          </NuxtLink>
        </div>
      </section>

      <section class="builder-workflows__section">
        <h2 class="builder-workflows__section-title">Notifications</h2>
        <div class="builder-workflows__templates">
          <div class="builder-workflows__template">
            <div class="builder-workflows__template-icons"><i class="pi pi-file" /><i class="pi pi-envelope" /></div>
            <div>
              <h4 class="builder-workflows__template-title">Thank you email</h4>
              <p class="builder-workflows__template-desc">Send personalized email after form submission.</p>
            </div>
          </div>
          <div class="builder-workflows__template">
            <div class="builder-workflows__template-icons"><i class="pi pi-file" /><i class="pi pi-clock" /></div>
            <div>
              <h4 class="builder-workflows__template-title">Send email after delay</h4>
              <p class="builder-workflows__template-desc">Wait to send an email until a certain time.</p>
            </div>
          </div>
          <div class="builder-workflows__template">
            <div class="builder-workflows__template-icons"><i class="pi pi-file" /><i class="pi pi-filter" /></div>
            <div>
              <h4 class="builder-workflows__template-title">Send email only if conditions match</h4>
              <p class="builder-workflows__template-desc">Send email after form submission, only if certain answers are chosen.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="builder-workflows__section">
        <h2 class="builder-workflows__section-title">Approvals</h2>
        <div class="builder-workflows__templates">
          <div class="builder-workflows__template">
            <div class="builder-workflows__template-icons"><i class="pi pi-file" /><i class="pi pi-users" /></div>
            <div>
              <h4 class="builder-workflows__template-title">Approve or reject</h4>
              <p class="builder-workflows__template-desc">Send an automated email based on a manual approval step.</p>
            </div>
          </div>
          <div class="builder-workflows__template">
            <div class="builder-workflows__template-icons"><i class="pi pi-file" /><i class="pi pi-users" /></div>
            <div>
              <h4 class="builder-workflows__template-title">Assign task</h4>
              <p class="builder-workflows__template-desc">Assign an internal task for form submission.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="builder-workflows__section">
        <h2 class="builder-workflows__section-title">Scheduling</h2>
        <p class="builder-workflows__section-desc">Workflow terjadwal akan tersedia di versi mendatang.</p>
      </section>
    </div>
  </BuilderPageTabs>
</template>

<script setup lang="ts">
import { useWorkflowStore } from '~~/stores/workflow'
import { getNodeDescriptor } from '~~/lib/workflow/descriptors'

const workflowStore = useWorkflowStore()

onMounted(() => {
  workflowStore.loadFromStorage()
})

function triggerLabel(wf: { nodes?: { type: string }[] }) {
  const trigger = wf.nodes?.find((n) => getNodeDescriptor(n.type)?.category === 'trigger')
  return trigger ? (getNodeDescriptor(trigger.type)?.label ?? trigger.type) : '—'
}

function firstActionLabel(wf: { nodes?: { type: string }[] }) {
  const action = wf.nodes?.find((n) => getNodeDescriptor(n.type)?.category === 'action')
  return action ? (getNodeDescriptor(action.type)?.label ?? action.type) : '—'
}
</script>

<style scoped>
.builder-workflows {
  flex: 1;
  overflow-y: auto;
  background: #f9fafb;
  padding: 24px;
}
.builder-workflows__section {
  margin-bottom: 32px;
}
.builder-workflows__section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.builder-workflows__section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px;
}
.builder-workflows__section-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
.builder-workflows__link {
  font-size: 0.875rem;
  color: #6366f1;
  text-decoration: none;
}
.builder-workflows__link:hover {
  text-decoration: underline;
}
.builder-workflows__btn-new {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  background: #6366f1;
  color: #fff;
  border-radius: 6px;
  text-decoration: none;
}
.builder-workflows__btn-new:hover {
  background: #4f46e5;
}
.builder-workflows__btn-new--inline {
  margin-top: 8px;
}
.builder-workflows__empty {
  padding: 32px;
  text-align: center;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #6b7280;
}
.builder-workflows__cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.builder-workflows__card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.builder-workflows__card:hover {
  border-color: #6366f1;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.08);
}
.builder-workflows__card-icons {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #6b7280;
  font-size: 1rem;
}
.builder-workflows__card-main {
  flex: 1;
  min-width: 0;
}
.builder-workflows__card-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px;
}
.builder-workflows__card-meta {
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0;
}
.builder-workflows__card-status {
  font-size: 0.8125rem;
  color: #9ca3af;
}
.builder-workflows__card-menu {
  padding: 4px 8px;
  color: #9ca3af;
  border-radius: 4px;
}
.builder-workflows__templates {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 12px;
}
.builder-workflows__template {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.builder-workflows__template:hover {
  border-color: #6366f1;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.1);
}
.builder-workflows__template-icons {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #6b7280;
  font-size: 1rem;
  flex-shrink: 0;
}
.builder-workflows__template-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px;
}
.builder-workflows__template-desc {
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
}
.builder-workflows__section-desc {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}
</style>
