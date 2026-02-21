<template>
  <div>
    <pre v-if="clientError" style="color:#ef4444;padding:1rem;white-space:pre-wrap;background:#fef2f2;border:1px solid #fecaca;border-radius:6px;margin:1rem;">{{ clientError }}</pre>
    <ClientOnly>
      <Puck
        v-if="data"
        :config="puckConfig"
        :data="data"
        @publish="onPublish"
      />
      <div v-else class="puck-loading">Loading editor...</div>
      <template #fallback>
        <div class="puck-loading">Loading editor...</div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { puckConfig } from '~/config/puck.config'

const data = ref<any>(null)
const clientError = ref<string | null>(null)

onErrorCaptured((err: Error) => {
  clientError.value = `${err.message}\n${err.stack}`
  return false
})

onMounted(() => {
  try {
    const key = 'puck-data-index'
    const raw = localStorage.getItem(key)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed?.content && parsed?.root) {
        data.value = parsed
      } else {
        data.value = getDefaultData()
      }
    } else {
      data.value = getDefaultData()
    }
  } catch (e: any) {
    clientError.value = e?.message || String(e)
    data.value = getDefaultData()
  }
})

function getDefaultData() {
  return {
    root: { props: { title: 'My Page' } },
    content: [],
  }
}

function onPublish(payload: any) {
  data.value = payload
  localStorage.setItem('puck-data-index', JSON.stringify(payload))
  alert('Published successfully!')
}
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
</style>
