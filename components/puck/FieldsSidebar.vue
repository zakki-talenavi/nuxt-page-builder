<template>
  <aside class="puck-sidebar puck-sidebar--right">
    <div class="puck-sidebar__tabs">
      <button
        v-if="selectedItem"
        class="puck-sidebar__tab"
        :class="{ active: rightPanel === 'component' }"
        @click="$emit('update:rightPanel', 'component')"
      >{{ componentLabel }}</button>
      <button
        class="puck-sidebar__tab"
        :class="{ active: rightPanel === 'page' }"
        @click="$emit('update:rightPanel', 'page'); $emit('deselect')"
      >Page</button>
    </div>

    <PuckBreadcrumbs
      v-if="selectedItem && crumbs.length > 1"
      :crumbs="crumbs"
      @navigate="(id: string) => $emit('deselect')"
    />

    <div v-if="rightPanel === 'component' && selectedItem" class="puck-sidebar__content">
      <div v-if="!canEdit" class="puck-sidebar__readonly">Editing is disabled for this component.</div>
      <PuckAutoField
        v-else
        v-for="field in componentFields"
        :key="field.key"
        :field-key="field.key"
        :field-config="field.config"
        :value="selectedItem.props?.[field.key]"
        @change="(val: any) => $emit('fieldChange', field.key, val)"
      />
    </div>

    <div v-if="rightPanel === 'page'" class="puck-sidebar__content">
      <PuckAutoField
        v-for="field in pageFields"
        :key="field.key"
        :field-key="field.key"
        :field-config="field.config"
        :value="rootProps?.[field.key]"
        @change="(val: any) => $emit('rootFieldChange', field.key, val)"
      />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { usePuckStore } from '@@/stores/puck'

const store = usePuckStore()

const props = defineProps<{
  selectedItem: any
  config: any
  rootProps: any
  rightPanel: 'component' | 'page'
}>()

defineEmits<{
  (e: 'update:rightPanel', panel: 'component' | 'page'): void
  (e: 'fieldChange', key: string, value: any): void
  (e: 'rootFieldChange', key: string, value: any): void
  (e: 'deselect'): void
}>()

const canEdit = computed(() => {
  if (!props.selectedItem) return true
  return store.getPermissions({ item: props.selectedItem })?.edit !== false
})

const crumbs = computed(() => {
  if (!props.selectedItem) return []
  return [
    { id: 'root', label: 'Page' },
    {
      id: props.selectedItem.props?.id || '',
      label: props.config?.components?.[props.selectedItem.type]?.label || props.selectedItem.type,
    },
  ]
})

const componentLabel = computed(() => {
  if (!props.selectedItem) return ''
  return props.config?.components?.[props.selectedItem.type]?.label || props.selectedItem.type
})

const componentFields = computed(() => {
  if (!props.selectedItem) return []
  const fields = props.config?.components?.[props.selectedItem.type]?.fields || {}
  return Object.entries(fields).map(([key, config]: [string, any]) => ({ key, config }))
})

const pageFields = computed(() => {
  const fields = props.config?.root?.fields || {}
  return Object.entries(fields).map(([key, config]: [string, any]) => ({ key, config }))
})
</script>

<style scoped>
.puck-sidebar {
  width: 256px; background: #fff; display: flex;
  flex-direction: column; flex-shrink: 0; overflow: hidden;
}
.puck-sidebar--right { border-left: 1px solid #e5e7eb; }
.puck-sidebar__tabs { display: flex; border-bottom: 1px solid #e5e7eb; flex-shrink: 0; }
.puck-sidebar__tab {
  flex: 1; padding: 10px 12px; font-size: 12px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.05em; border: none;
  background: transparent; cursor: pointer; color: #9ca3af;
  border-bottom: 2px solid transparent; transition: all 0.15s ease;
}
.puck-sidebar__tab:hover { color: #6b7280; }
.puck-sidebar__tab.active { color: #6366f1; border-bottom-color: #6366f1; }
.puck-sidebar__content { flex: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 16px; }
.puck-sidebar__readonly { padding: 16px; color: #9ca3af; font-size: 13px; text-align: center; font-style: italic; }
</style>
