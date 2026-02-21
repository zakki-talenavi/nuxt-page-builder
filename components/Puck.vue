<template>
  <div class="puck-editor">
    <!-- Header -->
    <header class="puck-header">
      <div class="puck-header__left">
        <svg class="puck-logo" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 3v18M3 9h6" />
        </svg>
        <span class="puck-header__title">{{ rootTitle || 'Puck Editor' }}</span>
      </div>
      <div class="puck-header__right">
        <button class="puck-btn puck-btn--ghost" @click="handleUndo" :disabled="!canUndo" title="Undo">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7v6h6"/><path d="M3 13a9 9 0 1 0 2.6-6.4L3 9"/></svg>
        </button>
        <button class="puck-btn puck-btn--ghost" @click="handleRedo" :disabled="!canRedo" title="Redo">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 7v6h-6"/><path d="M21 13a9 9 0 1 1-2.6-6.4L21 9"/></svg>
        </button>
        <div class="puck-header__divider" />
        <button class="puck-btn puck-btn--primary" @click="handlePublish">Publish</button>
      </div>
    </header>

    <!-- Body -->
    <div class="puck-body">
      <!-- Left Sidebar: Component List -->
      <aside class="puck-sidebar puck-sidebar--left">
        <div class="puck-sidebar__tabs">
          <button
            v-for="tab in leftTabs"
            :key="tab.id"
            class="puck-sidebar__tab"
            :class="{ active: activeLeftTab === tab.id }"
            @click="activeLeftTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Components Tab -->
        <div v-if="activeLeftTab === 'components'" class="puck-sidebar__content">
          <div class="puck-sidebar__section-title">Components</div>
          <div
            v-for="comp in componentList"
            :key="comp.key"
            class="puck-drawer-item"
            draggable="true"
            @dragstart="onDragStart($event, comp.key)"
          >
            <svg class="puck-drawer-item__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/>
              <circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/>
            </svg>
            <span>{{ comp.label }}</span>
          </div>
        </div>

        <!-- Outline Tab -->
        <div v-if="activeLeftTab === 'outline'" class="puck-sidebar__content">
          <div class="puck-sidebar__section-title">Outline</div>
          <div v-if="!items.length" class="puck-outline-empty">No components added yet</div>
          <div
            v-for="(item, index) in items"
            :key="item.props?.id || index"
            class="puck-outline-item"
            :class="{ active: selectedIdx === index }"
            @click="selectItem(index)"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
            </svg>
            <span>{{ getComponentLabel(item.type) }}</span>
          </div>
        </div>
      </aside>

      <!-- Canvas -->
      <main class="puck-canvas" @dragover.prevent @drop.prevent="onDrop" @click.self="deselectAll">
        <div class="puck-canvas__viewport">
          <div
            v-for="(item, index) in items"
            :key="item.props?.id || index"
            class="puck-canvas-item"
            :class="{
              'is-selected': selectedIdx === index,
              'is-hovered': hoveredIdx === index && selectedIdx !== index
            }"
            @click.stop="selectItem(index)"
            @mouseenter="hoveredIdx = index"
            @mouseleave="hoveredIdx = -1"
          >
            <!-- Action bar -->
            <div v-if="selectedIdx === index" class="puck-canvas-item__actions">
              <span class="puck-canvas-item__label">{{ getComponentLabel(item.type) }}</span>
              <button class="puck-action-btn" @click.stop="duplicateItem(index)" title="Duplicate">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              </button>
              <button class="puck-action-btn puck-action-btn--danger" @click.stop="removeItem(index)" title="Delete">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
            <!-- Component render -->
            <component
              v-if="getRenderer(item.type)"
              :is="getRenderer(item.type)"
              v-bind="item.props || {}"
            />
            <div v-else class="puck-canvas-item__placeholder">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8M8 12h8"/></svg>
              <span>{{ item.type }}</span>
            </div>
          </div>

          <div v-if="!items.length" class="puck-canvas__empty" @dragover.prevent @drop.prevent="onDrop">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M12 8v8M8 12h8"/>
            </svg>
            <p>Drag components here to start building</p>
          </div>
        </div>
      </main>

      <!-- Right Sidebar: Fields -->
      <aside class="puck-sidebar puck-sidebar--right" v-if="selectedIdx >= 0 || showPageFields">
        <div class="puck-sidebar__tabs">
          <button
            class="puck-sidebar__tab"
            :class="{ active: rightPanel === 'component' }"
            @click="rightPanel = 'component'"
            v-if="selectedIdx >= 0"
          >
            {{ getComponentLabel(items[selectedIdx]?.type) }}
          </button>
          <button
            class="puck-sidebar__tab"
            :class="{ active: rightPanel === 'page' }"
            @click="rightPanel = 'page'; selectedIdx = -1"
          >
            Page
          </button>
        </div>

        <!-- Component Fields -->
        <div v-if="rightPanel === 'component' && selectedIdx >= 0" class="puck-sidebar__content">
          <div class="puck-fields">
            <div
              v-for="field in selectedComponentFields"
              :key="field.key"
              class="puck-field"
            >
              <label class="puck-field__label">{{ field.label }}</label>
              <textarea
                v-if="field.fieldType === 'textarea'"
                class="puck-field__input puck-field__textarea"
                :value="getItemProp(selectedIdx, field.key)"
                @input="onFieldInput(selectedIdx, field.key, $event)"
              />
              <input
                v-else
                class="puck-field__input"
                type="text"
                :value="getItemProp(selectedIdx, field.key)"
                @input="onFieldInput(selectedIdx, field.key, $event)"
              />
            </div>
          </div>
        </div>

        <!-- Page Fields -->
        <div v-if="rightPanel === 'page'" class="puck-sidebar__content">
          <div class="puck-fields">
            <div
              v-for="field in pageFieldList"
              :key="field.key"
              class="puck-field"
            >
              <label class="puck-field__label">{{ field.label }}</label>
              <input
                class="puck-field__input"
                type="text"
                :value="rootProps[field.key] || ''"
                @input="onRootFieldInput(field.key, $event)"
              />
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  config: any
  data: any
  metadata?: any
}>()

const emit = defineEmits<{ (e: 'publish', data: any): void }>()

const items = ref<any[]>([])
const selectedIdx = ref(-1)
const hoveredIdx = ref(-1)
const activeLeftTab = ref('components')
const rightPanel = ref<'component' | 'page'>('component')
const showPageFields = ref(true)
const history = ref<any[][]>([])
const historyIdx = ref(-1)

const rootProps = ref<Record<string, any>>({})

const leftTabs = [
  { id: 'components', label: 'Components' },
  { id: 'outline', label: 'Outline' },
]

const rootTitle = computed(() => rootProps.value?.title || props.data?.root?.props?.title || '')

onMounted(() => {
  items.value = props.data?.content ? [...props.data.content] : []
  rootProps.value = { ...(props.data?.root?.props || {}) }
  pushHistory()
})

const componentList = computed(() =>
  Object.entries(props.config?.components || {}).map(([key, cfg]: [string, any]) => ({
    key,
    label: cfg?.label || key,
  }))
)

const pageFields = computed(() => props.config?.root?.fields || {})

const selectedComponentFields = computed(() => {
  if (selectedIdx.value < 0) return []
  const type = items.value[selectedIdx.value]?.type
  const fields = props.config?.components?.[type]?.fields || {}
  return Object.entries(fields).map(([key, cfg]: [string, any]) => ({
    key,
    label: cfg?.label || key,
    fieldType: cfg?.type || 'text',
  }))
})

const pageFieldList = computed(() => {
  const fields = pageFields.value
  return Object.entries(fields).map(([key, cfg]: [string, any]) => ({
    key,
    label: cfg?.label || key,
    fieldType: cfg?.type || 'text',
  }))
})

const canUndo = computed(() => historyIdx.value > 0)
const canRedo = computed(() => historyIdx.value < history.value.length - 1)

function getRenderer(type: string) {
  return props.config?.components?.[type]?.render || null
}

function getComponentLabel(type: string) {
  return props.config?.components?.[type]?.label || type || 'Unknown'
}

function onDragStart(e: DragEvent, type: string) {
  e.dataTransfer?.setData('text/plain', type)
  e.dataTransfer!.effectAllowed = 'copy'
}

function onDrop(e: DragEvent) {
  const type = e.dataTransfer?.getData('text/plain')
  if (!type || !props.config?.components?.[type]) return
  const cfg = props.config.components[type]
  items.value.push({
    type,
    props: { ...(cfg.defaultProps || {}), id: `${type}-${Date.now()}` },
  })
  selectedIdx.value = items.value.length - 1
  rightPanel.value = 'component'
  pushHistory()
}

function selectItem(index: number) {
  selectedIdx.value = selectedIdx.value === index ? -1 : index
  if (selectedIdx.value >= 0) {
    rightPanel.value = 'component'
  }
}

function deselectAll() {
  selectedIdx.value = -1
}

function removeItem(index: number) {
  items.value.splice(index, 1)
  selectedIdx.value = -1
  pushHistory()
}

function duplicateItem(index: number) {
  const original = items.value[index]
  const copy = JSON.parse(JSON.stringify(original))
  copy.props.id = `${copy.type}-${Date.now()}`
  items.value.splice(index + 1, 0, copy)
  selectedIdx.value = index + 1
  pushHistory()
}

function getItemProp(index: number, key: string): string {
  return items.value[index]?.props?.[key] || ''
}

function onFieldInput(index: number, key: string, event: Event) {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  if (!items.value[index]) return
  if (!items.value[index].props) items.value[index].props = {}
  items.value[index].props[key] = target.value
}

function onRootFieldInput(key: string, event: Event) {
  const target = event.target as HTMLInputElement
  rootProps.value[key] = target.value
}

function pushHistory() {
  const snapshot = JSON.parse(JSON.stringify(items.value))
  if (historyIdx.value < history.value.length - 1) {
    history.value = history.value.slice(0, historyIdx.value + 1)
  }
  history.value.push(snapshot)
  historyIdx.value = history.value.length - 1
}

function handleUndo() {
  if (!canUndo.value) return
  historyIdx.value--
  items.value = JSON.parse(JSON.stringify(history.value[historyIdx.value]))
  selectedIdx.value = -1
}

function handleRedo() {
  if (!canRedo.value) return
  historyIdx.value++
  items.value = JSON.parse(JSON.stringify(history.value[historyIdx.value]))
  selectedIdx.value = -1
}

function handlePublish() {
  const payload = {
    root: { props: { ...rootProps.value } },
    content: items.value,
  }
  emit('publish', payload)
}
</script>

<style scoped>
.puck-editor {
  display: flex;
  flex-direction: column;
  height: 100vh;
  color: #1f2937;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.5;
}

/* ── Header ── */
.puck-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 48px;
  border-bottom: 1px solid #e5e7eb;
  background: #fff;
  flex-shrink: 0;
}
.puck-header__left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.puck-logo {
  color: #6366f1;
}
.puck-header__title {
  font-weight: 600;
  font-size: 14px;
  color: #1f2937;
}
.puck-header__right {
  display: flex;
  align-items: center;
  gap: 4px;
}
.puck-header__divider {
  width: 1px;
  height: 20px;
  background: #e5e7eb;
  margin: 0 8px;
}

/* ── Buttons ── */
.puck-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 500;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
  color: #1f2937;
}
.puck-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.puck-btn--primary {
  background: #6366f1;
  color: #fff;
}
.puck-btn--primary:hover:not(:disabled) {
  background: #4f46e5;
}
.puck-btn--ghost {
  background: transparent;
  color: #6b7280;
  padding: 6px;
}
.puck-btn--ghost:hover:not(:disabled) {
  background: #f3f4f6;
  color: #1f2937;
}

/* ── Body ── */
.puck-body {
  display: flex;
  flex: 1;
  min-height: 0;
}

/* ── Sidebar ── */
.puck-sidebar {
  width: 256px;
  background: #fff;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden;
}
.puck-sidebar--left {
  border-right: 1px solid #e5e7eb;
}
.puck-sidebar--right {
  border-left: 1px solid #e5e7eb;
}
.puck-sidebar__tabs {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
}
.puck-sidebar__tab {
  flex: 1;
  padding: 10px 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #9ca3af;
  border-bottom: 2px solid transparent;
  transition: all 0.15s ease;
}
.puck-sidebar__tab:hover {
  color: #6b7280;
}
.puck-sidebar__tab.active {
  color: #6366f1;
  border-bottom-color: #6366f1;
}
.puck-sidebar__content {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}
.puck-sidebar__section-title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #9ca3af;
  margin-bottom: 8px;
}

/* ── Drawer Items (component list) ── */
.puck-drawer-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  margin-bottom: 2px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: grab;
  font-size: 13px;
  color: #374151;
  background: #fff;
  transition: all 0.15s ease;
  user-select: none;
}
.puck-drawer-item:hover {
  background: #f9fafb;
  border-color: #6366f1;
  color: #6366f1;
}
.puck-drawer-item:active {
  cursor: grabbing;
}
.puck-drawer-item__icon {
  color: #9ca3af;
  flex-shrink: 0;
}

/* ── Outline Items ── */
.puck-outline-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  margin-bottom: 2px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  color: #374151;
  transition: background 0.1s ease;
}
.puck-outline-item:hover {
  background: #f3f4f6;
}
.puck-outline-item.active {
  background: #eef2ff;
  color: #6366f1;
}
.puck-outline-empty {
  color: #9ca3af;
  font-size: 13px;
  text-align: center;
  padding: 24px 12px;
}

/* ── Canvas ── */
.puck-canvas {
  flex: 1;
  background: #f3f4f6;
  overflow-y: auto;
  padding: 24px;
}
.puck-canvas__viewport {
  max-width: 960px;
  margin: 0 auto;
  min-height: 100%;
}

/* ── Canvas Items ── */
.puck-canvas-item {
  position: relative;
  background: #fff;
  border-radius: 6px;
  margin-bottom: 8px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.puck-canvas-item:hover,
.puck-canvas-item.is-hovered {
  border-color: #c7d2fe;
}
.puck-canvas-item.is-selected {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}
.puck-canvas-item__actions {
  position: absolute;
  top: -36px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 4px 6px;
  background: #6366f1;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
  white-space: nowrap;
}
.puck-canvas-item__label {
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  padding: 0 6px;
}
.puck-action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.1s ease;
}
.puck-action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}
.puck-action-btn--danger:hover {
  background: #ef4444;
  color: #fff;
}
.puck-canvas-item__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px;
  color: #9ca3af;
  border: 1px dashed #d1d5db;
  border-radius: 4px;
  margin: 4px;
}

/* ── Canvas Empty ── */
.puck-canvas__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  background: #fff;
  text-align: center;
}
.puck-canvas__empty p {
  margin: 12px 0 0;
  color: #9ca3af;
  font-size: 14px;
}

/* ── Fields ── */
.puck-fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.puck-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.puck-field__label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
.puck-field__input {
  padding: 8px 10px;
  font-size: 13px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  color: #1f2937;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  font-family: inherit;
}
.puck-field__input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}
.puck-field__textarea {
  resize: vertical;
  min-height: 80px;
}
</style>
