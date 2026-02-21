<template>
  <ClientOnly>
    <div v-if="resolvedData" class="puck-view">
      <div v-if="resolvedData.content.length === 0" class="puck-view__empty">
        <p>No content yet. <NuxtLink to="/edit">Open the editor</NuxtLink> to start building.</p>
      </div>
      <div v-for="(item, i) in resolvedData.content" :key="item.props?.id || i">
        <component
          v-if="getRenderer(item.type)"
          :is="getRenderer(item.type)"
          v-bind="item.props || {}"
        />
        <div v-else class="puck-view__unknown">{{ item.type }}</div>
      </div>
    </div>
    <div v-else class="puck-view__loading">Loading...</div>
    <template #fallback>
      <div class="puck-view__loading">Loading...</div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { puckConfig } from '~/config/puck.config'

const route = useRoute()
const path = computed(() => (route.params.path as string[] | undefined)?.join('/') || '')
const storageKey = computed(() => `puck-data-${path.value || 'index'}`)

const resolvedData = ref<any>(null)

onMounted(() => {
  try {
    const raw = localStorage.getItem(storageKey.value)
    if (raw) {
      resolvedData.value = JSON.parse(raw)
    } else {
      resolvedData.value = { root: { props: {} }, content: [] }
    }
  } catch {
    resolvedData.value = { root: { props: {} }, content: [] }
  }
})

function getRenderer(type: string) {
  return (puckConfig.components as any)?.[type]?.render || null
}
</script>

<style scoped>
.puck-view {
  max-width: 960px;
  margin: 0 auto;
}
.puck-view__empty {
  padding: 48px;
  text-align: center;
  color: #6b7280;
}
.puck-view__empty a {
  color: #6366f1;
}
.puck-view__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: #6b7280;
}
.puck-view__unknown {
  padding: 16px 24px;
  color: #9ca3af;
  border: 1px dashed #d1d5db;
  border-radius: 4px;
  text-align: center;
  margin: 8px 0;
}
</style>
