<template>
  <div class="puck-external-input">
    <div v-if="value" class="puck-external-input__preview">
      <span class="puck-external-input__value">{{ displayValue }}</span>
      <button class="puck-external-input__clear" @click="$emit('change', null)" title="Clear">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
    </div>
    <button v-else class="puck-external-input__trigger" @click="showModal = true">
      {{ placeholder || 'Select...' }}
    </button>

    <PuckModal v-model="showModal" :title="modalTitle">
      <div class="puck-external-input__search">
        <input
          v-model="searchQuery"
          class="puck-external-input__search-input"
          placeholder="Search..."
          @input="doSearch"
        />
      </div>
      <div class="puck-external-input__results">
        <div v-if="loading" class="puck-external-input__loading"><PuckLoader size="sm" /></div>
        <div
          v-for="item in results"
          :key="item.id || item.title"
          class="puck-external-input__result"
          @click="selectItem(item)"
        >
          <span>{{ item.title || item.label || item.name || JSON.stringify(item) }}</span>
        </div>
        <div v-if="!loading && !results.length && searchQuery" class="puck-external-input__empty">No results</div>
      </div>
    </PuckModal>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  value: any
  placeholder?: string
  modalTitle?: string
  fetchList?: (query: string) => Promise<any[]>
}>()

const emit = defineEmits<{ (e: 'change', value: any): void }>()

const showModal = ref(false)
const searchQuery = ref('')
const results = ref<any[]>([])
const loading = ref(false)

const displayValue = computed(() => {
  if (!props.value) return ''
  return props.value.title || props.value.label || props.value.name || JSON.stringify(props.value)
})

async function doSearch() {
  if (!props.fetchList) return
  loading.value = true
  try {
    results.value = await props.fetchList(searchQuery.value)
  } finally {
    loading.value = false
  }
}

function selectItem(item: any) {
  emit('change', item)
  showModal.value = false
}
</script>

<style scoped>
.puck-external-input__preview {
  display: flex; align-items: center; gap: 8px; padding: 8px 10px;
  border: 1px solid #d1d5db; border-radius: 6px; background: #f9fafb;
}
.puck-external-input__value { flex: 1; font-size: 13px; color: #1f2937; overflow: hidden; text-overflow: ellipsis; }
.puck-external-input__clear {
  border: none; background: transparent; cursor: pointer; color: #9ca3af;
  padding: 2px; border-radius: 3px;
}
.puck-external-input__clear:hover { color: #ef4444; }
.puck-external-input__trigger {
  width: 100%; padding: 8px 10px; border: 1px dashed #d1d5db;
  border-radius: 6px; background: #fff; cursor: pointer; font-size: 13px;
  color: #9ca3af; text-align: left; transition: all 0.15s;
}
.puck-external-input__trigger:hover { border-color: #6366f1; color: #6366f1; }
.puck-external-input__search { margin-bottom: 12px; }
.puck-external-input__search-input {
  width: 100%; padding: 8px 12px; border: 1px solid #d1d5db;
  border-radius: 6px; font-size: 14px; outline: none; box-sizing: border-box;
}
.puck-external-input__search-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
.puck-external-input__result {
  padding: 10px 12px; cursor: pointer; border-radius: 6px;
  font-size: 14px; color: #1f2937; transition: background 0.1s;
}
.puck-external-input__result:hover { background: #eef2ff; }
.puck-external-input__loading { padding: 20px; }
.puck-external-input__empty { padding: 20px; text-align: center; color: #9ca3af; font-size: 14px; }
</style>
