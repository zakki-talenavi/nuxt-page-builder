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
        <div v-for="cat in categories" :key="cat.title" class="puck-category">
          <button class="puck-category__header" @click="toggleCategory(cat.title)">
            <svg
              class="puck-category__chevron"
              :class="{ open: !collapsedCats[cat.title] }"
              width="12" height="12" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2"
            ><polyline points="9 18 15 12 9 6"/></svg>
            <span>{{ cat.title }}</span>
            <span class="puck-category__count">{{ cat.components.length }}</span>
          </button>
          <div v-if="!collapsedCats[cat.title]" class="puck-category__items">
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
        :items="items"
        :selected-id="selectedId"
        :hovered-id="null"
        :config="store.config"
        @select="(id: string) => $emit('select', id)"
        @hover="() => {}"
      />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { usePuckStore } from '@@/stores/puck'

const props = defineProps<{
  componentList: { key: string; label: string }[]
  items: any[]
  selectedId: string | null
  activeTab: string
}>()

defineEmits<{
  (e: 'update:activeTab', tab: string): void
  (e: 'select', id: string): void
  (e: 'dragStart', event: DragEvent, type: string): void
}>()

const store = usePuckStore()
const tabs = [
  { id: 'components', label: 'Components' },
  { id: 'outline', label: 'Outline' },
]

const collapsedCats = ref<Record<string, boolean>>({})

function toggleCategory(title: string) {
  collapsedCats.value[title] = !collapsedCats.value[title]
}

const filteredComponentList = computed(() =>
  props.componentList.filter((comp) => {
    const perms = store.getPermissions({ type: comp.key })
    return perms?.insert !== false
  })
)

const categories = computed(() => {
  const cats = (store.config as any)?.categories
  if (!cats) return []

  return Object.entries(cats).map(([key, cat]: [string, any]) => ({
    title: cat.title || key,
    components: (cat.components || [])
      .map((compKey: string) => filteredComponentList.value.find((c) => c.key === compKey))
      .filter(Boolean),
  })).filter((cat) => cat.components.length > 0)
})

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

.puck-category { margin-bottom: 4px; }
.puck-category__header {
  display: flex; align-items: center; gap: 6px; width: 100%;
  padding: 6px 4px; border: none; background: transparent; cursor: pointer;
  font-size: 11px; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.05em; color: #9ca3af; transition: color 0.1s;
}
.puck-category__header:hover { color: #6b7280; }
.puck-category__chevron { transition: transform 0.15s; flex-shrink: 0; }
.puck-category__chevron.open { transform: rotate(90deg); }
.puck-category__count {
  margin-left: auto; font-size: 10px; background: #f3f4f6;
  color: #9ca3af; padding: 1px 5px; border-radius: 8px;
}
.puck-category__items { padding: 2px 0 8px; }

.puck-drawer-item {
  display: flex; align-items: center; gap: 8px; padding: 8px 10px;
  margin-bottom: 2px; border: 1px solid #e5e7eb; border-radius: 6px;
  cursor: grab; font-size: 13px; color: #374151; background: #fff;
  transition: all 0.15s ease; user-select: none;
}
.puck-drawer-item:hover { background: #f9fafb; border-color: #6366f1; color: #6366f1; }
.puck-drawer-item:active { cursor: grabbing; }
</style>
