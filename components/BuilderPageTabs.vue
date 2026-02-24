<template>
  <div class="builder-page-tabs">
    <div class="builder-page-tabs__bar">
      <div class="builder-page-tabs__left">
        <svg class="builder-page-tabs__logo" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 3v18M3 9h6" />
        </svg>
        <span class="builder-page-tabs__title">Page builder</span>
      </div>
      <div class="builder-page-tabs__center">
        <SelectButton
          v-model="activeTab"
          :options="tabOptions"
          option-label="label"
          option-value="value"
          size="small"
          aria-labelledby="builder-mode"
          @update:model-value="onTabChange"
        />
      </div>
      <div class="builder-page-tabs__right">
        <slot name="headerActions" />
      </div>
    </div>
    <div class="builder-page-tabs__content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import SelectButton from 'primevue/selectbutton'

const route = useRoute()
const router = useRouter()

const tabOptions = [
  { label: 'Edit', value: 'edit' },
  { label: 'Workflows', value: 'workflows' },
]

const isWorkflows = computed(
  () => route.path === '/edit/workflows' || route.path.startsWith('/edit/workflows/')
)

const activeTab = computed({
  get: () => (isWorkflows.value ? 'workflows' : 'edit'),
  set: () => {},
})

function onTabChange(value: string) {
  if (value === 'workflows') router.push('/edit/workflows')
  else router.push('/edit')
}
</script>

<style scoped>
.builder-page-tabs {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.builder-page-tabs__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 48px;
  border-bottom: 1px solid #e5e7eb;
  background: #fff;
  flex-shrink: 0;
}
.builder-page-tabs__left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 140px;
}
.builder-page-tabs__logo {
  color: #6366f1;
  flex-shrink: 0;
}
.builder-page-tabs__title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}
.builder-page-tabs__center {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-width: 0;
}
.builder-page-tabs__center :deep(.p-selectbutton) {
  display: inline-flex;
}
.builder-page-tabs__center :deep(.p-button) {
  font-size: 13px;
  font-weight: 500;
  padding: 6px 16px;
}
.builder-page-tabs__right {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 140px;
  justify-content: flex-end;
}
.builder-page-tabs__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
</style>
