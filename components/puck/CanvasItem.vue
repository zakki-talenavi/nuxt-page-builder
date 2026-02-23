<template>
  <div
    ref="itemRef"
    class="puck-canvas-item"
    :class="{
      'is-selected': isSelected,
      'is-hovered': isHovered && !isSelected,
      'is-layout': isLayoutComponent,
      'is-dragging': isDragging,
      'is-inline': isInlineComponent,
    }"
    :draggable="canDrag"
    @dragstart.stop="onDragStart"
    @dragend.stop="onDragEnd"
    @click.stop="emit('select', item.props?.id)"
    @mouseenter="emit('hover', item.props?.id)"
    @mouseleave="emit('hover', null)"
  >
    <!-- Toolbar di portal ke body agar tidak tertutup parent/utama -->
    <Teleport v-if="isSelected" to="body">
      <div
        class="puck-canvas-item__actions puck-canvas-item__actions--portal"
        :style="actionsPortalStyle"
      >
        <span class="puck-canvas-item__label">{{ label }}</span>
        <button
          v-if="canDuplicate"
          class="puck-action-btn"
          @click.stop="emit('duplicate', item.props?.id)"
          title="Duplicate"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </button>
        <button
          v-if="canDeleteItem"
          class="puck-action-btn puck-action-btn--danger"
          @click.stop="emit('remove', item.props?.id)"
          title="Delete"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </Teleport>

    <!-- Multi-zone layout (Columns / Grid): one drop zone per column -->
    <template v-if="layoutType === 'multi-zone'">
      <div :style="containerStyle" class="puck-canvas-layout">
        <div
          v-for="(colContent, colIdx) in zoneContentMap.columns"
          :key="colIdx"
          class="puck-canvas-column"
          :class="{ 'is-drag-over': zoneDragOver[getColumnZoneKey(colIdx)] }"
          @dragover.prevent.stop="onZoneDragOver($event, getColumnZoneKey(colIdx))"
          @dragleave.stop="onZoneDragLeave(getColumnZoneKey(colIdx))"
          @drop.prevent.stop="onZoneDrop($event, getColumnZoneKey(colIdx))"
        >
          <PuckCanvasItem
            v-for="child in colContent"
            :key="child.props?.id"
            :item="child"
            :config="config"
            :selected-id="selectedId"
            :hovered-id="hoveredId"
            :zone="getColumnZoneCompound(colIdx)"
            @select="emit('select', $event)"
            @hover="emit('hover', $event)"
            @deselect="emit('deselect')"
            @duplicate="emit('duplicate', $event)"
            @remove="emit('remove', $event)"
            @slot-drop="emit('slot-drop', $event)"
          />
          <div v-if="colContent.length === 0" class="puck-canvas-column__empty">
            <span>Column {{ colIdx + 1 }}</span>
          </div>
        </div>
      </div>
    </template>

    <!-- Single-zone layout (Flex / Container): one drop zone, multiple items -->
    <template v-else-if="layoutType === 'single-zone'">
      <div
        :style="containerStyle"
        class="puck-canvas-layout puck-canvas-single-zone"
        :class="{ 'is-drag-over': zoneDragOver[singleZoneKey] }"
        @dragover.prevent.stop="onZoneDragOver($event, singleZoneKey)"
        @dragleave.stop="onZoneDragLeave(singleZoneKey)"
        @drop.prevent.stop="onZoneDrop($event, singleZoneKey)"
      >
        <PuckCanvasItem
          v-for="child in (zoneContentMap.flex ?? [])"
          :key="child.props?.id"
          :item="child"
          :config="config"
          :selected-id="selectedId"
          :hovered-id="hoveredId"
          :zone="getSingleZoneCompound()"
          @select="emit('select', $event)"
          @hover="emit('hover', $event)"
          @deselect="emit('deselect')"
          @duplicate="emit('duplicate', $event)"
          @remove="emit('remove', $event)"
          @slot-drop="emit('slot-drop', $event)"
        />
        <div v-if="(zoneContentMap.flex ?? []).length === 0" class="puck-canvas-column__empty" style="width:100%">
          <span>Drop components here</span>
        </div>
      </div>
    </template>

    <!-- Regular component: use render function; pass canvasProps for in-canvas editable fields -->
    <template v-else>
      <component
        v-if="renderer"
        :is="renderer"
        v-bind="canvasProps"
      />
      <div v-else class="puck-canvas-item__placeholder">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M12 8v8M8 12h8" />
        </svg>
        <span>{{ item.type }}</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { usePuckStore } from '~~/stores/puck'
import PuckInlineTextEdit from '~~/components/puck/InlineTextEdit.vue'

const store = usePuckStore()

const props = defineProps<{
  item: any
  config: any
  selectedId: string | null
  hoveredId: string | null
  zone: string
}>()

const emit = defineEmits<{
  (e: 'select', id: string): void
  (e: 'hover', id: string | null): void
  (e: 'deselect'): void
  (e: 'duplicate', id: string): void
  (e: 'remove', id: string): void
  (e: 'slot-drop', payload: { componentType?: string; moveId?: string; zone: string; index: number }): void
}>()

const itemRef = ref<HTMLElement | null>(null)
const actionsPortalStyle = ref<{ top: string; left: string }>({ top: '0', left: '0' })

const isSelected = computed(() => props.selectedId === props.item.props?.id)
const isHovered = computed(() => props.hoveredId === props.item.props?.id)

const label = computed(() => props.config?.components?.[props.item.type]?.label || props.item.type)

function updateActionsPortalPosition() {
  const el = itemRef.value
  if (!el || !isSelected.value) return
  const rect = el.getBoundingClientRect()
  actionsPortalStyle.value = {
    top: `${rect.top - 40}px`,
    left: `${rect.left + rect.width / 2}px`,
  }
}
const renderer = computed(() => props.config?.components?.[props.item.type]?.render || null)

const canDuplicate = computed(() => store.getPermissions({ item: props.item })?.duplicate !== false)
const canDeleteItem = computed(() => store.getPermissions({ item: props.item })?.delete !== false)

const isDragging = ref(false)

const canDrag = computed(() => store.getPermissions({ item: props.item })?.drag !== false)

function onDragStart(e: DragEvent) {
  if (!canDrag.value) {
    e.preventDefault()
    return
  }
  
  setTimeout(() => {
    isDragging.value = true
  }, 0)
  
  e.dataTransfer?.setData('application/puck-move', itemId.value)
  e.dataTransfer!.effectAllowed = 'copyMove'
  if (typeof window !== 'undefined') (window as any).__puckDragId = itemId.value
}

function onDragEnd() {
  isDragging.value = false
  if (typeof window !== 'undefined') (window as any).__puckDragId = null
}

const isLayoutComponent = computed(() => layoutType.value !== 'none')

/** Komponen yang lebar mengikuti isi (tombol, dll) agar tidak meregang full width */
const isInlineComponent = computed(() =>
  ['Button'].includes(props.item.type)
)

const layoutType = computed<'multi-zone' | 'single-zone' | 'none'>(() => {
  const type = props.item.type
  if (type === 'Columns' || type === 'Grid') return 'multi-zone'
  if (type === 'Flex' || type === 'Container') return 'single-zone'
  return 'none'
})

const columnCount = computed(() => {
  const p = props.item.props || {}
  if (props.item.type === 'Columns') return parseInt(String(p.columns)) || 2
  if (props.item.type === 'Grid') return Math.min(12, Math.max(1, Number(p.numColumns) || 4))
  return 1
})

const itemId = computed(() => props.item.props?.id || '')

const flexZoneKey = computed(() => `flex-zone`)

/** Zone key for single-zone layouts: Flex uses flex-zone, Container uses default */
const singleZoneKey = computed(() => (props.item.type === 'Container' ? 'default' : 'flex-zone'))

function getColumnZoneKey(idx: number): string {
  return `column-${idx}`
}

function getColumnZoneCompound(idx: number): string {
  return `${itemId.value}:column-${idx}`
}

function getFlexZoneCompound(): string {
  return `${itemId.value}:flex-zone`
}

function getSingleZoneCompound(): string {
  return `${itemId.value}:${singleZoneKey.value}`
}

const containerStyle = computed(() => {
  const p = props.item.props || {}
  const type = props.item.type
  if (type === 'Grid') {
    const cols = Math.min(12, Math.max(1, Number(p.numColumns) || 4))
    const verticalPadding = p.layout?.verticalPadding ?? '0px'
    return {
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      gap: `${p.gap || 24}px`,
      justifyItems: p.justifyItems || 'stretch',
      alignItems: p.alignItems || 'stretch',
      justifyContent: p.justifyContent || 'start',
      alignContent: p.alignContent || 'start',
      paddingTop: verticalPadding,
      paddingBottom: verticalPadding,
      minHeight: '60px',
      overflowX: 'auto' as const,
    }
  }
  if (type === 'Columns') {
    const cols = parseInt(String(p.columns)) || 2
    const gap = parseInt(String(p.gap)) || 16
    return {
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      gap: `${gap}px`,
      padding: '8px',
      minHeight: '60px',
      overflowX: 'auto' as const,
    }
  }
  if (type === 'Flex') {
    const jc = p.justifyContent === 'start' ? 'flex-start' : p.justifyContent === 'end' ? 'flex-end' : (p.justifyContent || 'flex-start')
    const verticalPadding = p.layout?.verticalPadding ?? '0px'
    return {
      display: 'flex',
      flexDirection: p.direction || 'row',
      justifyContent: jc,
      alignItems: p.alignItems || 'stretch',
      alignContent: p.alignContent || 'stretch',
      gap: `${p.gap || 24}px`,
      flexWrap: p.wrap || 'wrap',
      paddingTop: verticalPadding,
      paddingBottom: verticalPadding,
      minHeight: '60px',
    }
  }
  if (type === 'Container') {
    return {
      maxWidth: p.maxWidth || '1200px',
      margin: '0 auto',
      padding: p.padding || '0 24px',
      minHeight: '60px',
    }
  }
  return {}
})

const itemProps = computed(() => {
  const p = { ...(props.item.props || {}) }
  const compConfig = props.config?.components?.[props.item.type]
  if (compConfig?.fields) {
    for (const [key, field] of Object.entries(compConfig.fields)) {
      if ((field as any).type === 'slot') delete p[key]
    }
  }
  return p
})

/** Recursively replace contentEditable text/textarea with InlineTextEdit VNodes (supports array paths like buttons[0].label). */
function transformPropsForCanvas(
  propsSource: Record<string, any>,
  fields: Record<string, any>,
  basePath: string,
  componentId: string,
  isReadOnly: boolean
): Record<string, any> {
  const out = { ...propsSource }
  for (const [key, field] of Object.entries(fields)) {
    if (!field || field.type === 'slot') continue
    const path = basePath ? `${basePath}.${key}` : key

    if (field.type === 'array' && field.arrayFields) {
      const arr = Array.isArray(out[key]) ? out[key] : []
      out[key] = arr.map((item: any, i: number) => {
        const row = item && typeof item === 'object' ? { ...item } : {}
        for (const [subKey, subField] of Object.entries(field.arrayFields as Record<string, any>)) {
          if (subField?.contentEditable && (subField.type === 'text' || subField.type === 'textarea' || subField.type === 'richtext')) {
            const fullPath = `${key}[${i}].${subKey}`
            row[subKey] = h(PuckInlineTextEdit, {
              value: String(row[subKey] ?? ''),
              propPath: fullPath,
              componentId,
              isReadOnly,
              disableLineBreaks: subField.type === 'text',
              rich: subField.type === 'richtext',
            })
          }
        }
        return row
      })
      continue
    }

    if (field.type === 'object' && field.objectFields) {
      out[key] = transformPropsForCanvas(
        out[key] && typeof out[key] === 'object' ? out[key] : {},
        field.objectFields,
        path,
        componentId,
        isReadOnly
      )
      continue
    }

    if (field?.contentEditable && (field.type === 'text' || field.type === 'textarea' || field.type === 'richtext')) {
      out[key] = h(PuckInlineTextEdit, {
        value: String(out[key] ?? ''),
        propPath: path,
        componentId,
        isReadOnly,
        disableLineBreaks: field.type === 'text',
        rich: field.type === 'richtext',
      })
    }
  }
  return out
}

/** Props with contentEditable fields replaced by InlineTextEdit VNodes for in-canvas editing. Always includes componentId so blocks can dispatch replace (e.g. DataTable row reorder). */
const canvasProps = computed(() => {
  const p = { ...itemProps.value }
  const compConfig = props.config?.components?.[props.item.type]
  const fields = compConfig?.fields as Record<string, { type?: string; contentEditable?: boolean }> | undefined
  const componentId = props.item.props?.id
  const base = !fields || !componentId ? p : transformPropsForCanvas(p, fields, '', componentId, store.getPermissions({ item: props.item })?.edit === false)
  return { ...base, componentId }
})

const zonesData = computed(() => store.state?.data?.zones || {})

function getZoneContent(zoneKey: string): any[] {
  const zoneCompound = `${itemId.value}:${zoneKey}`
  return zonesData.value[zoneCompound] || []
}

const zoneContentMap = computed(() => {
  const zones = zonesData.value
  if (layoutType.value === 'multi-zone') {
    const columns: any[][] = []
    for (let i = 0; i < columnCount.value; i++) {
      const key = getColumnZoneKey(i)
      columns.push(zones[`${itemId.value}:${key}`] || [])
    }
    return { columns }
  }
  if (layoutType.value === 'single-zone') {
    return { flex: zones[`${itemId.value}:${singleZoneKey.value}`] || [] }
  }
  return { columns: [] as any[], flex: [] as any[] }
})

onMounted(() => {
  registerLayoutZones()
})

watch(() => [props.item.type, props.item.props?.columns, props.item.props?.numColumns], () => {
  registerLayoutZones()
})

function registerLayoutZones() {
  if (layoutType.value === 'multi-zone') {
    for (let i = 0; i < columnCount.value; i++) {
      const zoneCompound = getColumnZoneCompound(i)
      if (!store.state.indexes?.zones?.[zoneCompound]) {
        store.dispatch({ type: 'registerZone', zone: zoneCompound })
      }
    }
  } else if (layoutType.value === 'single-zone') {
    const zoneCompound = getSingleZoneCompound()
    if (!store.state.indexes?.zones?.[zoneCompound]) {
      store.dispatch({ type: 'registerZone', zone: zoneCompound })
    }
  }
}

const zoneDragOver = ref<Record<string, boolean>>({})

function onZoneDragOver(e: DragEvent, zoneKey: string) {
  const isMove = e.dataTransfer?.types.includes('application/puck-move') || (typeof window !== 'undefined' && !!(window as any).__puckDragId)
  e.dataTransfer!.dropEffect = isMove ? 'move' : 'copy'
  
  if (zoneDragOver.value[zoneKey]) return
  zoneDragOver.value = { ...zoneDragOver.value, [zoneKey]: true }
}

function onZoneDragLeave(zoneKey: string) {
  if (!zoneDragOver.value[zoneKey]) return
  zoneDragOver.value = { ...zoneDragOver.value, [zoneKey]: false }
}

function getDropIndex(e: DragEvent, zoneKey: string): number {
  const target = e.currentTarget as HTMLElement
  if (!target) return getZoneContent(zoneKey).length
  
  // Only look at immediate children to avoid querying items in nested structures
  const items = Array.from(target.children).filter(el => el.classList.contains('puck-canvas-item'))
  const isVertical = layoutType.value === 'multi-zone' // columns stack items vertically
  
  for (let i = 0; i < items.length; i++) {
    const el = items[i]
    if (!el) continue
    const rect = el.getBoundingClientRect()
    if (isVertical) {
      if (e.clientY < rect.top + rect.height / 2) return i
    } else {
      if (e.clientX < rect.left + rect.width / 2) return i
    }
  }
  return getZoneContent(zoneKey).length
}

function onZoneDrop(e: DragEvent, zoneKey: string) {
  zoneDragOver.value = { ...zoneDragOver.value, [zoneKey]: false }

  const moveId = e.dataTransfer?.getData('application/puck-move') || (typeof window !== 'undefined' ? (window as any).__puckDragId : '')
  const componentType = e.dataTransfer?.getData('application/puck-component') || e.dataTransfer?.getData('text/plain')
  const zoneCompound = `${itemId.value}:${zoneKey}`
  const index = getDropIndex(e, zoneKey)

  if (moveId) {
    emit('slot-drop', { moveId, zone: zoneCompound, index })
  } else if (componentType) {
    emit('slot-drop', { componentType, zone: zoneCompound, index })
  }
}

watch(isSelected, (selected) => {
  if (selected) {
    nextTick(() => updateActionsPortalPosition())
    document.addEventListener('scroll', onScrollOrResize, true)
    window.addEventListener('resize', onScrollOrResize)
  } else {
    document.removeEventListener('scroll', onScrollOrResize, true)
    window.removeEventListener('resize', onScrollOrResize)
  }
}, { immediate: true })

let scrollResizeRaf: number | null = null
function onScrollOrResize() {
  if (scrollResizeRaf != null) return
  scrollResizeRaf = requestAnimationFrame(() => {
    scrollResizeRaf = null
    if (itemRef.value && isSelected.value) updateActionsPortalPosition()
  })
}

onBeforeUnmount(() => {
  if (scrollResizeRaf != null) cancelAnimationFrame(scrollResizeRaf)
  document.removeEventListener('scroll', onScrollOrResize, true)
  window.removeEventListener('resize', onScrollOrResize)
})
</script>

<style scoped>
.puck-canvas-item {
  position: relative;
  z-index: 0;
  background: #fff;
  border-radius: 6px;
  margin-bottom: 8px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, z-index 0s;
  min-width: 0;
  max-width: 100%;
}
.puck-canvas-item:hover,
.puck-canvas-item.is-hovered {
  border-color: #c7d2fe;
  z-index: 2;
}
.puck-canvas-item.is-selected {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  z-index: 3;
}
.puck-canvas-item.is-dragging {
  opacity: 0.5;
  z-index: 10;
  pointer-events: none;
}
.puck-canvas-item.is-inline {
  width: fit-content;
  align-self: flex-start;
}

/* Toolbar (top: -36px) jangan tertutup item di bawah: item yang persis di atas item terpilih naik z-index */
.puck-canvas-item:has(+ .puck-canvas-item.is-selected) {
  z-index: 4;
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
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  z-index: 20;
  white-space: nowrap;
}

/* Toolbar yang di-Teleport ke body: fixed agar tidak tertutup parent */
.puck-canvas-item__actions--portal {
  position: fixed;
  transform: translate(-50%, 0);
  z-index: 9999;
}
.puck-canvas-item__label { font-size: 11px; font-weight: 600; color: #fff; padding: 0 6px; }
.puck-action-btn {
  display: inline-flex; align-items: center; justify-content: center;
  width: 26px; height: 26px; border: none; background: transparent;
  border-radius: 4px; cursor: pointer; color: rgba(255,255,255,0.8);
  transition: all 0.1s ease;
}
.puck-action-btn:hover { background: rgba(255,255,255,0.2); color: #fff; }
.puck-action-btn--danger:hover { background: #ef4444; color: #fff; }

.puck-canvas-item__placeholder {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 24px; color: #9ca3af; border: 1px dashed #d1d5db;
  border-radius: 4px; margin: 4px;
}

.puck-canvas-layout {
  border-radius: 4px;
}

.puck-canvas-column {
  min-height: 60px;
  min-width: 0;
  border: 2px dashed #e5e7eb;
  border-radius: 8px;
  padding: 8px;
  transition: all 0.15s;
  background: #fafbfc;
  overflow: visible;
  position: relative;
  z-index: 0;
}
.puck-canvas-column:has(.puck-canvas-item.is-selected),
.puck-canvas-column:has(.puck-canvas-item.is-hovered) {
  z-index: 1;
}
.puck-canvas-column.is-drag-over {
  background: rgba(99, 102, 241, 0.05);
  border-color: #6366f1;
}
.puck-canvas-column__empty {
  display: flex; align-items: center; justify-content: center;
  min-height: 50px; color: #9ca3af; font-size: 11px;
  text-align: center; word-break: break-word; overflow: hidden;
}

.puck-canvas-flex-zone,
.puck-canvas-single-zone {
  border: 2px dashed #e5e7eb;
  border-radius: 8px;
  background: #fafbfc;
  padding: 8px;
  min-height: 60px;
  transition: all 0.15s;
  overflow: visible;
  position: relative;
  z-index: 0;
}
.puck-canvas-flex-zone:has(.puck-canvas-item.is-selected),
.puck-canvas-flex-zone:has(.puck-canvas-item.is-hovered),
.puck-canvas-single-zone:has(.puck-canvas-item.is-selected),
.puck-canvas-single-zone:has(.puck-canvas-item.is-hovered) {
  z-index: 1;
}
.puck-canvas-flex-zone.is-drag-over,
.puck-canvas-single-zone.is-drag-over {
  background: rgba(99, 102, 241, 0.05);
  border-color: #6366f1;
}
</style>
