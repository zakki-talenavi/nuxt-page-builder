<template>
  <aside class="puck-sidebar">
    <div class="puck-sidebar__tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="puck-sidebar__tab"
        :class="{ active: activeTab === tab.id }"
        @click="$emit('update:activeTab', tab.id)"
      >{{ tab.label }}</button>
    </div>

    <div v-if="activeTab === 'components'" class="puck-sidebar__content">
      <template v-if="categories.length">
        <div
          v-for="cat in categories"
          :key="cat.id"
          class="puck-accordion"
          :class="{ 'puck-accordion--expanded': cat.expanded }"
        >
          <button
            type="button"
            class="puck-accordion__title"
            :title="cat.expanded ? `Collapse ${cat.title}` : `Expand ${cat.title}`"
            @click="toggleCategory(cat.id)"
          >
            <span class="puck-accordion__title-text">{{ cat.title }}</span>
            <span class="puck-accordion__count">{{ cat.components.length }}</span>
            <span class="puck-accordion__icon" aria-hidden="true">
              <svg v-if="cat.expanded" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>
              <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </span>
          </button>
          <div v-show="cat.expanded" class="puck-accordion__content">
            <div
              v-for="comp in cat.components"
              :key="comp.key"
              class="puck-drawer-item"
              draggable="true"
              @dragstart="onDragStart($event, comp.key)"
            >
              <PuckDragIcon />
              <span>{{ comp.label }}</span>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div
          v-for="comp in filteredComponentList"
          :key="comp.key"
          class="puck-drawer-item"
          draggable="true"
          @dragstart="onDragStart($event, comp.key)"
        >
          <PuckDragIcon />
          <span>{{ comp.label }}</span>
        </div>
      </template>
    </div>

    <div v-if="activeTab === 'outline'" class="puck-sidebar__content">
      <PuckLayerTree
        :items="outlineTree"
        :selected-id="selectedId"
        :hovered-id="null"
        :config="store.config"
        @select="(id) => $emit('select', id)"
        @hover="() => {}"
        @outline-drop="$emit('outlineDrop', $event)"
      />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { usePuckStore } from '~~/stores/puck'

const props = defineProps<{
  componentList: { key: string; label: string }[]
  /** Tree for outline (root + nested zone children), same structure as canvas */
  outlineTree: { type: string; props?: { id?: string }; children?: any[] }[]
  selectedId: string | null
  activeTab: string
}>()

defineEmits<{
  (e: 'update:activeTab', tab: string): void
  (e: 'select', id: string): void
  (e: 'dragStart', event: DragEvent, type: string): void
  (e: 'outlineDrop', payload: { draggedId: string; targetId: string; position: 'before' | 'after' }): void
}>()

const store = usePuckStore()
const tabs = [
  { id: 'components', label: 'Components' },
  { id: 'outline', label: 'Outline' },
]

const filteredComponentList = computed(() =>
  props.componentList.filter((comp) => {
    const perms = store.getPermissions({ type: comp.key })
    return perms?.insert !== false
  })
)

const categories = computed(() => {
  const cats = (store.config as any)?.categories
  const uiList = store.state?.ui?.componentList || {}
  if (!cats) return []

  return Object.entries(cats).map(([id, cat]: [string, any]) => {
    const uiEntry = uiList[id] || {}
    const expanded = uiEntry.expanded ?? true
    const components = (cat.components || [])
      .map((compKey: string) => filteredComponentList.value.find((c) => c.key === compKey))
      .filter(Boolean)
    return {
      id,
      title: cat.title || id,
      components,
      expanded,
    }
  }).filter((c) => c.components.length > 0)
})

function toggleCategory(id: string) {
  const uiList = store.state?.ui?.componentList || {}
  const current = uiList[id] || {}
  store.setUi({
    componentList: {
      ...uiList,
      [id]: { ...current, expanded: !current.expanded },
    },
  })
}

function onDragStart(e: DragEvent, type: string) {
  e.dataTransfer?.setData('text/plain', type)
  e.dataTransfer?.setData('application/puck-component', type)
  e.dataTransfer!.effectAllowed = 'copy'
}
</script>

<style scoped>
.puck-sidebar {
  width: 256px; background: #fff; display: flex;
  flex-direction: column; flex-shrink: 0; overflow: hidden;
  border-right: 1px solid #e5e7eb;
}
.puck-sidebar__tabs { display: flex; border-bottom: 1px solid #e5e7eb; flex-shrink: 0; }
.puck-sidebar__tab {
  flex: 1; padding: 10px 12px; font-size: 12px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.05em; border: none;
  background: transparent; cursor: pointer; color: #9ca3af;
  border-bottom: 2px solid transparent; transition: all 0.15s ease;
}
.puck-sidebar__tab:hover { color: #6b7280; }
.puck-sidebar__tab.active { color: #6366f1; border-bottom-color: #6366f1; }
.puck-sidebar__content { flex: 1; overflow-y: auto; padding: 12px; }

/* Accordion (per puck-main ComponentList) */
.puck-accordion { max-width: 100%; margin-bottom: 2px; }
.puck-accordion--expanded + .puck-accordion { margin-top: 2px; }
.puck-accordion__content { display: none; margin-bottom: 6px; padding: 2px 0 8px; }
.puck-accordion--expanded > .puck-accordion__content { display: block; }

.puck-accordion__title {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 8px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  font: inherit;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #9ca3af;
  list-style: none;
  transition: background-color 0.05s ease, color 0.05s ease;
}
.puck-accordion__title:hover { background: #f3f4f6; color: #6b7280; }
.puck-accordion__title:focus-visible {
  outline: 2px solid var(--puck-color-primary, #6366f1);
  outline-offset: 2px;
}
.puck-accordion__title-text { flex: 1; text-align: left; }
.puck-accordion__count {
  font-size: 10px;
  background: #f3f4f6;
  color: #9ca3af;
  padding: 1px 5px;
  border-radius: 8px;
}
.puck-accordion__icon { flex-shrink: 0; display: flex; align-items: center; justify-content: center; }

.puck-drawer-item {
  display: flex; align-items: center; gap: 8px; padding: 8px 10px;
  margin-bottom: 2px; border: 1px solid #e5e7eb; border-radius: 6px;
  cursor: grab; font-size: 13px; color: #374151; background: #fff;
  transition: all 0.15s ease; user-select: none;
}
.puck-drawer-item:hover { background: #f9fafb; border-color: #6366f1; color: #6366f1; }
.puck-drawer-item:active { cursor: grabbing; }
</style>
