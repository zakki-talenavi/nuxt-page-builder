<template>
  <ClientOnly>
    <div v-if="resolvedData" class="puck-view">
      <div v-if="!resolvedData.content?.length" class="puck-view__empty">
        <p>No content yet. <NuxtLink :to="editLink">Open the editor</NuxtLink> to start building.</p>
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
import { useDemoData } from '~~/composables/useDemoData'

const route = useRoute()
const pathArray = computed(() => {
  const p = route.params.path
  if (Array.isArray(p)) return p
  return p ? [p] : []
})
const path = computed(() => '/' + pathArray.value.join('/'))

const demo = useDemoData({
  path: path.value,
  isEdit: false,
})

const resolvedData = computed(() => demo.resolvedData.value)

const editLink = computed(() => {
  const seg = pathArray.value.join('/')
  return `/edit/${seg}`
})

useHead({
  title: () => (demo.data.value?.root as any)?.props?.title || (demo.data.value?.root as any)?.title || '',
})

provide('puckConfig', computed(() => puckConfig))
</script>

<style scoped>
.puck-view {
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  padding: 16px;
  overflow-x: hidden;
}
@media (min-width: 640px) {
  .puck-view { padding: 24px; }
}
.puck-view__empty { padding: 48px 16px; text-align: center; color: #6b7280; }
.puck-view__empty a { color: #6366f1; }
.puck-view__loading {
  display: flex; align-items: center; justify-content: center;
  height: 100vh; color: #6b7280;
}
</style>
