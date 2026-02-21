<template>
  <ClientOnly>
    <div v-if="resolvedData" class="puck-view">
      <div v-if="!resolvedData.content?.length" class="puck-view__empty">
        <p>No content yet. <NuxtLink to="/edit">Open the editor</NuxtLink> to start building.</p>
      </div>
      <PuckRender v-else :config="puckConfig" :data="resolvedData" />
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
    resolvedData.value = raw ? JSON.parse(raw) : { root: { props: {} }, content: [] }
  } catch {
    resolvedData.value = { root: { props: {} }, content: [] }
  }
})
</script>

<style scoped>
.puck-view { max-width: 960px; margin: 0 auto; }
.puck-view__empty { padding: 48px; text-align: center; color: #6b7280; }
.puck-view__empty a { color: #6366f1; }
.puck-view__loading {
  display: flex; align-items: center; justify-content: center;
  height: 100vh; color: #6b7280;
}
</style>
