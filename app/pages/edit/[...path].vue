<template>
  <div :key="path">
    <pre v-if="clientError" style="color:#ef4444;padding:1rem;white-space:pre-wrap;background:#fef2f2;border:1px solid #fecaca;border-radius:6px;margin:1rem;">{{ clientError }}</pre>
    <ClientOnly>
      <Puck
        v-if="demo.data.value"
        :config="puckConfig"
        :data="demo.data.value"
        :header-path="path"
        :storage-key="demo.key"
        :iframe="{ enabled: false }"
        @publish="onPublish"
      >
        <template #headerActions="{ path: headerPath }">
          <NuxtLink
            :to="viewLink(headerPath)"
            class="puck-btn puck-btn--outline"
            target="_blank"
            rel="noopener"
          >
            View page
          </NuxtLink>
        </template>
      </Puck>
      <div v-else class="puck-loading">Loading editor...</div>
      <template #fallback>
        <div class="puck-loading">Loading editor...</div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { puckConfig } from '~/config'
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
  isEdit: true,
})

const clientError = ref<string | null>(null)
onErrorCaptured((err: Error) => {
  clientError.value = `${err.message}\n${err.stack}`
  return false
})

onMounted(() => {
  if (!demo.data.value) demo.data.value = demo.getDefaultData()
})

function onPublish(payload: any) {
  demo.save(payload)
  alert('Published successfully!')
}

function viewLink(headerPath: string) {
  const p = (headerPath || '/').replace(/^\/+/, '') || ''
  return p ? `/view/${p}` : '/view'
}

provide('puckConfig', puckConfig)
</script>

<style scoped>
.puck-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 16px;
  color: #6b7280;
}
.puck-btn {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 500;
  border-radius: 6px;
  text-decoration: none;
  color: #374151;
  background: transparent;
  border: 1px solid #e5e7eb;
  cursor: pointer;
}
.puck-btn:hover { background: #f3f4f6; border-color: #6366f1; color: #6366f1; }
</style>
