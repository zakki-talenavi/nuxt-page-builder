<template>
  <div
    class="puck-datatable-block"
    :style="tableColorVars"
  >
    <div v-if="apiError" class="puck-datatable-block__error">
      {{ apiError }}
    </div>
    <template v-else>
      <DataTable
        :value="displayedData"
        data-key="_id"
        :show-gridlines="showGridlines"
        :striped-rows="stripedRows"
        :size="size"
        :scrollable="scrollable"
        :scroll-height="scrollHeight"
        :loading="apiLoading"
        class="puck-datatable-block__table"
        @row-reorder="onRowReorder"
      >
        <Column v-if="!apiUrl" row-reorder header-style="width: 3rem" :reorderable-column="false" class="puck-dt-reorder" />
        <Column v-if="showRowNumbers" header="No" style="width: 4rem; text-align: center">
          <template #body="slotProps">
            {{ rowNumber(slotProps) }}
          </template>
        </Column>
      <Column v-if="showActionColumn" header="Aksi" style="width: 8rem" class="puck-dt-actions">
        <template #body="slotProps">
          <div class="puck-dt-actions__wrap">
            <template v-for="(btn, i) in effectiveActionButtons" :key="i">
              <button
                v-if="btn.type === 'edit'"
                type="button"
                class="puck-dt-btn puck-dt-btn--edit"
                :title="btn.label || 'Edit'"
                @click.stop="onEditRow(slotProps.data)"
              >
                <span class="puck-dt-btn__icon" aria-hidden="true">{{ btn.icon || '✎' }}</span>
              </button>
              <button
                v-else-if="btn.type === 'delete' && !apiUrl"
                type="button"
                class="puck-dt-btn puck-dt-btn--delete"
                :title="btn.label || 'Hapus'"
                @click.stop="onDeleteRow(slotProps.data)"
              >
                <span class="puck-dt-btn__icon" aria-hidden="true">{{ btn.icon || '🗑' }}</span>
              </button>
              <a
                v-else-if="btn.type === 'link' && btn.url"
                :href="resolveLinkUrl(btn.url, slotProps.data)"
                class="puck-dt-btn puck-dt-btn--link"
                :title="btn.label || 'Link'"
                @click.stop
              >
                <span class="puck-dt-btn__icon" aria-hidden="true">{{ btn.icon || '↗' }}</span>
              </a>
            </template>
          </div>
        </template>
      </Column>
      <Column
        v-for="col in columns"
        :key="col.field"
        :field="col.field"
        :header="col.header || col.field"
      >
        <template #body="{ data }">
          {{ formatCell(data, col.field) }}
        </template>
      </Column>
      </DataTable>

      <!-- Paginator kustom: selalu terlihat, client & server -->
      <div v-if="paginator" class="puck-dt-paginator">
        <span class="puck-dt-paginator__report">
          {{ paginatorReport }}
        </span>
        <div class="puck-dt-paginator__nav">
          <button
            type="button"
            class="puck-dt-paginator__btn"
            :disabled="currentPage <= 1"
            title="Halaman pertama"
            @click="goToPage(1)"
          >
            ««
          </button>
          <button
            type="button"
            class="puck-dt-paginator__btn"
            :disabled="currentPage <= 1"
            title="Sebelumnya"
            @click="goToPage(currentPage - 1)"
          >
            ‹
          </button>
          <span class="puck-dt-paginator__page">
            {{ currentPage }} / {{ totalPages || 1 }}
          </span>
          <button
            type="button"
            class="puck-dt-paginator__btn"
            :disabled="currentPage >= totalPages"
            title="Berikutnya"
            @click="goToPage(currentPage + 1)"
          >
            ›
          </button>
          <button
            type="button"
            class="puck-dt-paginator__btn"
            :disabled="currentPage >= totalPages"
            title="Halaman terakhir"
            @click="goToPage(totalPages)"
          >
            »»
          </button>
        </div>
        <div class="puck-dt-paginator__size">
          <label for="puck-dt-rows">Baris:</label>
          <select
            id="puck-dt-rows"
            v-model.number="localRows"
            class="puck-dt-paginator__select"
            @change="onRowsChange"
          >
            <option v-for="opt in rowsPerPageOptions" :key="opt" :value="opt">
              {{ opt }}
            </option>
          </select>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { usePuckStore } from '~~/stores/puck'
import { rootDroppableId } from '~~/lib/puck/root-droppable-id'

const store = usePuckStore()

const props = withDefaults(
  defineProps<{
    columns?: { field: string; header: string }[]
    data?: Record<string, unknown>[]
    componentId?: string
    apiUrl?: string
    apiDataPath?: string
    apiPageParam?: string
    apiLimitParam?: string
    apiTotalPath?: string
    paginationMode?: 'client' | 'server'
    paginator?: boolean
    rows?: number
    rowsPerPageOptions?: number[]
    showGridlines?: boolean
    stripedRows?: boolean
    size?: 'small' | 'normal' | 'large'
    scrollable?: boolean
    scrollHeight?: string
    dataKey?: string
    showRowNumbers?: boolean
    showActionColumn?: boolean
    actionButtons?: { type: 'edit' | 'delete' | 'link'; label?: string; icon?: string; url?: string }[]
    headerBgColor?: string
    headerTextColor?: string
    bodyBgColor?: string
    bodyZebraColor?: string
    bodyTextColor?: string
    borderColor?: string
    rowHoverColor?: string
  }>(),
  {
    columns: () => [],
    data: () => [],
    apiUrl: '',
    apiDataPath: '',
    apiPageParam: 'page',
    apiLimitParam: 'limit',
    apiTotalPath: 'total',
    paginationMode: 'client',
    paginator: true,
    rows: 10,
    rowsPerPageOptions: () => [5, 10, 20, 50],
    showGridlines: false,
    stripedRows: true,
    size: 'normal',
    scrollable: false,
    scrollHeight: '400px',
    dataKey: '_id',
    showRowNumbers: true,
    showActionColumn: true,
    actionButtons: () => [{ type: 'edit', label: 'Edit', icon: '✎' }, { type: 'delete', label: 'Hapus', icon: '🗑' }],
    headerBgColor: '',
    headerTextColor: '',
    bodyBgColor: '',
    bodyZebraColor: '',
    bodyTextColor: '',
    borderColor: '',
    rowHoverColor: '',
  }
)

const tableColorVars = computed(() => {
  const vars: Record<string, string> = {}
  if (props.headerBgColor?.trim()) vars['--puck-dt-header-bg'] = props.headerBgColor.trim()
  if (props.headerTextColor?.trim()) vars['--puck-dt-header-text'] = props.headerTextColor.trim()
  if (props.bodyBgColor?.trim()) vars['--puck-dt-body-bg'] = props.bodyBgColor.trim()
  if (props.bodyZebraColor?.trim()) vars['--puck-dt-zebra'] = props.bodyZebraColor.trim()
  if (props.bodyTextColor?.trim()) vars['--puck-dt-body-text'] = props.bodyTextColor.trim()
  if (props.borderColor?.trim()) vars['--puck-dt-border'] = props.borderColor.trim()
  if (props.rowHoverColor?.trim()) vars['--puck-dt-hover'] = props.rowHoverColor.trim()
  return vars
})

const apiData = ref<Record<string, unknown>[]>([])
const apiLoading = ref(false)
const apiError = ref<string | null>(null)
const serverTotal = ref(0)
const firstRow = ref(0)
const localRows = ref(props.rows)

watch(() => props.rows, (v) => { localRows.value = v }, { immediate: true })

/** Data to show: from API when apiUrl set, else manual props.data. */
const sourceData = computed(() => {
  if ((props.apiUrl || '').trim()) return apiData.value
  return props.data || []
})

/** Normalize rows with stable _id for PrimeVue row reorder. */
const tableData = computed(() =>
  sourceData.value.map((row, i) => ({
    ...row,
    _id: (row._id as string) || (row.id as string) || `row-${i}`,
  }))
)

const isServerMode = computed(() => (props.apiUrl || '').trim() && props.paginationMode === 'server')
const effectiveRows = computed(() => Math.max(1, localRows.value))

const totalRecords = computed(() => {
  if (isServerMode.value) return serverTotal.value
  return tableData.value.length
})

const totalPages = computed(() => Math.max(1, Math.ceil(totalRecords.value / effectiveRows.value)))
const currentPage = computed(() => Math.min(totalPages.value, Math.floor(firstRow.value / effectiveRows.value) + 1))

watch(currentPage, (p) => {
  const wantFirst = (p - 1) * effectiveRows.value
  if (firstRow.value !== wantFirst) firstRow.value = wantFirst
}, { immediate: true })

const displayedData = computed(() => {
  if (isServerMode.value) return apiData.value
  const start = firstRow.value
  const end = start + effectiveRows.value
  return tableData.value.slice(start, end)
})

const paginatorReport = computed(() => {
  const total = totalRecords.value
  if (total === 0) return '0–0 dari 0'
  const first = firstRow.value + 1
  const last = Math.min(firstRow.value + effectiveRows.value, total)
  return `${first}–${last} dari ${total}`
})

const defaultActionButtons = [{ type: 'edit' as const, label: 'Edit', icon: '✎' }, { type: 'delete' as const, label: 'Hapus', icon: '🗑' }]
const effectiveActionButtons = computed(() => (props.actionButtons && props.actionButtons.length > 0 ? props.actionButtons : defaultActionButtons))

function goToPage(page: number) {
  const p = Math.max(1, Math.min(totalPages.value, page))
  firstRow.value = (p - 1) * effectiveRows.value
  if (isServerMode.value) fetchApi()
}

function onRowsChange() {
  firstRow.value = 0
  if (isServerMode.value) fetchApi()
}

function getNested(obj: unknown, path: string): unknown {
  if (!path.trim()) return obj
  return path.split('.').reduce((acc: any, key) => acc?.[key], obj)
}

/**
 * Parse field expression: path1 + " literal " + path2.
 * Segmen dalam tanda kutip ganda = teks literal; lainnya = path data.
 */
function parseFieldParts(raw: string): { type: 'path' | 'literal'; value: string }[] {
  const out: { type: 'path' | 'literal'; value: string }[] = []
  let s = raw.trim()
  while (s.length) {
    const plusIdx = s.indexOf('+')
    if (plusIdx === -1) {
      const segment = s.trim()
      if (segment.startsWith('"') && segment.endsWith('"') && segment.length >= 2) {
        out.push({ type: 'literal', value: segment.slice(1, -1) })
      } else if (segment) {
        out.push({ type: 'path', value: segment })
      }
      break
    }
    const segment = s.slice(0, plusIdx).trim()
    if (segment.startsWith('"') && segment.endsWith('"') && segment.length >= 2) {
      out.push({ type: 'literal', value: segment.slice(1, -1) })
    } else if (segment) {
      out.push({ type: 'path', value: segment })
    }
    s = s.slice(plusIdx + 1).trim()
  }
  return out
}

/** Resolve field: path(s) and optional literals, e.g. address.zipcode + " kodenya " + address.city */
function formatCell(row: Record<string, unknown>, field: string): string {
  const raw = (field || '').trim()
  if (!raw) return ''

  const parts = parseFieldParts(raw)
  const values = parts.map((p) => {
    if (p.type === 'literal') return p.value
    const v = getNested(row, p.value)
    if (v == null) return ''
    if (typeof v === 'object') return JSON.stringify(v)
    return String(v)
  })
  return values.join('')
}

async function fetchApi() {
  const url = (props.apiUrl || '').trim()
  if (!url) {
    apiData.value = []
    serverTotal.value = 0
    apiError.value = null
    return
  }
  apiLoading.value = true
  apiError.value = null
  try {
    const page = Math.floor(firstRow.value / effectiveRows.value) + 1
    const params: Record<string, string | number> = {}
    if (isServerMode.value) {
      params[props.apiPageParam || 'page'] = page
      params[props.apiLimitParam || 'limit'] = effectiveRows.value
    }
    const fullUrl = params && Object.keys(params).length
      ? `${url}${url.includes('?') ? '&' : '?'}${new URLSearchParams(params as any).toString()}`
      : url
    const response = await $fetch<unknown>(fullUrl)
    const raw = getNested(response, props.apiDataPath || '') as unknown
    const list = Array.isArray(raw) ? raw : []
    if (isServerMode.value) {
      const totalVal = getNested(response, props.apiTotalPath || 'total')
      serverTotal.value = typeof totalVal === 'number' ? totalVal : list.length
    } else {
      serverTotal.value = 0
    }
    apiData.value = list.map((row: any, i: number) => ({
      ...(typeof row === 'object' && row !== null ? row : { value: row }),
      _id: (row?._id != null ? row._id : row?.id != null ? row.id : undefined) ?? `row-${i}`,
    }))
  } catch (e: any) {
    apiError.value = e?.message || String(e) || 'Failed to load data'
    apiData.value = []
    serverTotal.value = 0
  } finally {
    apiLoading.value = false
  }
}

watch(
  () => [props.apiUrl, props.apiDataPath],
  () => {
    firstRow.value = 0
    fetchApi()
  },
  { immediate: true }
)

function getLocation(): { zone: string; index: number } | null {
  const state = store.state as any
  const id = props.componentId
  if (!id) return null
  const nodeInfo = state?.indexes?.nodes?.[id]
  if (!nodeInfo) return null
  const parentId = nodeInfo.parentId
  const zoneName = nodeInfo.zone
  const zoneCompound = parentId && zoneName ? `${parentId}:${zoneName}` : rootDroppableId
  const zoneIndex = state?.indexes?.zones?.[zoneCompound]
  if (!zoneIndex) return null
  const index = zoneIndex.contentIds?.indexOf(id) ?? -1
  if (index < 0) return null
  return { zone: zoneCompound, index }
}

function onRowReorder(event: { value?: Record<string, unknown>[]; dragIndex?: number; dropIndex?: number }) {
  if (!props.componentId || (props.apiUrl || '').trim()) return
  const loc = getLocation()
  if (!loc) return
  const nodeData = (store.state as any).indexes?.nodes?.[props.componentId]?.data
  if (!nodeData) return

  const current = props.data || []
  let newData: Record<string, unknown>[]

  if (event.value && Array.isArray(event.value)) {
    newData = event.value.map((row, i) => ({
      ...row,
      _id: (row._id as string) || `row-${i}`,
    }))
  } else if (typeof event.dragIndex === 'number' && typeof event.dropIndex === 'number') {
    const copy = [...current]
    const [removed] = copy.splice(event.dragIndex, 1)
    if (removed === undefined) return
    copy.splice(event.dropIndex, 0, removed)
    newData = copy.map((row, i) => ({
      ...row,
      _id: (row._id as string) || `row-${i}`,
    }))
  } else {
    return
  }

  store.dispatch({
    type: 'replace',
    data: { ...nodeData!, props: { ...(nodeData!.props ?? {}), data: newData } } as any,
    destinationIndex: loc.index,
    destinationZone: loc.zone,
  })
}

/** Nomor baris: index dari slot bisa berupa index atau rowIndex (PrimeVue). */
function rowNumber(slotProps: { index?: number; rowIndex?: number; data?: unknown }) {
  const idx = slotProps?.index ?? slotProps?.rowIndex ?? 0
  const i = typeof idx === 'number' ? idx : 0
  return props.paginator ? (currentPage.value - 1) * effectiveRows.value + i + 1 : i + 1
}

/** URL dari template: {{field}} atau {{path.nested}} diganti dari data baris. */
function resolveLinkUrl(template: string, row: Record<string, unknown>): string {
  if (!template) return '#'
  return template.replace(/\{\{([^}]+)\}\}/g, (_, path) => {
    const v = getNested(row, path.trim())
    return v != null ? String(v) : ''
  })
}

function onEditRow(_data: Record<string, unknown>) {
  // Di editor Puck, edit bisa lewat panel; tombol untuk konfirmasi aksi di runtime
}

function onDeleteRow(data: Record<string, unknown>) {
  if (!props.componentId) return
  const loc = getLocation()
  if (!loc) return
  const nodeData = (store.state as any).indexes?.nodes?.[props.componentId]?.data
  if (!nodeData) return
  const id = data._id ?? data.id
  if (id == null) return
  const current = props.data || []
  const newData = current.filter((r) => (r._id ?? r.id) !== id)
  store.dispatch({
    type: 'replace',
    data: { ...nodeData!, props: { ...(nodeData!.props ?? {}), data: newData } } as any,
    destinationIndex: loc.index,
    destinationZone: loc.zone,
  })
}
</script>

<style scoped>
.puck-datatable-block {
  --puck-dt-header-bg: #4f46e5;
  --puck-dt-header-text: #fff;
  --puck-dt-body-bg: #fff;
  --puck-dt-body-text: #1f2937;
  --puck-dt-border: #e5e7eb;
  --puck-dt-zebra: #f9fafb;
  --puck-dt-hover: #f3f4f6;
  --puck-dt-edit-bg: #4f46e5;
  --puck-dt-delete-bg: #dc2626;
  padding: 0;
  color: var(--puck-dt-body-text);
  background: var(--puck-dt-body-bg);
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.puck-datatable-block__table {
  border-radius: 12px;
}

:deep(.p-datatable),
:deep(.p-datatable-wrapper) {
  background: var(--puck-dt-body-bg) !important;
  border-radius: 12px;
}

:deep(.p-datatable-table) {
  border-collapse: separate;
  border-spacing: 0;
  background: var(--puck-dt-body-bg) !important;
  color: var(--puck-dt-body-text) !important;
}

:deep(.p-datatable-tbody > tr) {
  background: var(--puck-dt-body-bg) !important;
  color: var(--puck-dt-body-text) !important;
}

:deep(.p-datatable-thead > tr > th) {
  background: var(--puck-dt-header-bg) !important;
  color: var(--puck-dt-header-text) !important;
  border: none !important;
  font-weight: 600;
  font-size: 0.8125rem;
  padding: 14px 16px;
  text-align: left;
}

:deep(.p-datatable-thead > tr > th:first-child) {
  border-radius: 12px 0 0 0;
}

:deep(.p-datatable-tbody > tr > td) {
  border-bottom: 1px solid var(--puck-dt-border) !important;
  padding: 12px 16px;
  font-size: 0.875rem;
  vertical-align: middle;
}

:deep(.p-datatable-tbody > tr:last-child > td) {
  border-bottom: none !important;
}

:deep(.p-datatable-tbody > tr:nth-child(even)) {
  background: var(--puck-dt-zebra) !important;
}

:deep(.p-datatable-tbody > tr:hover) {
  background: var(--puck-dt-hover) !important;
}

:deep(.p-datatable-tbody > tr:nth-child(even):hover) {
  background: var(--puck-dt-hover) !important;
}

/* Paginator kustom (client + server) */
.puck-dt-paginator {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 12px 16px;
  border-top: 1px solid var(--puck-dt-border);
  background: #fff;
  font-size: 0.8125rem;
  color: var(--puck-color-text, #374151);
}

.puck-dt-paginator__report {
  font-weight: 500;
}

.puck-dt-paginator__nav {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.puck-dt-paginator__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  border: 1px solid var(--puck-dt-border);
  border-radius: 8px;
  background: #fff;
  color: var(--puck-color-text, #374151);
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.15s, border-color 0.15s;
}

.puck-dt-paginator__btn:hover:not(:disabled) {
  background: var(--puck-dt-hover);
  border-color: var(--puck-dt-header-bg);
}

.puck-dt-paginator__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.puck-dt-paginator__page {
  min-width: 4rem;
  text-align: center;
  font-weight: 500;
}

.puck-dt-paginator__size {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.puck-dt-paginator__size label {
  white-space: nowrap;
}

.puck-dt-paginator__select {
  padding: 6px 10px;
  border: 1px solid var(--puck-dt-border);
  border-radius: 8px;
  background: #fff;
  font-size: 0.8125rem;
  color: var(--puck-color-text, #374151);
  cursor: pointer;
}

/* Action buttons */
.puck-dt-actions__wrap {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.puck-dt-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
}

.puck-dt-btn:hover {
  opacity: 0.9;
  transform: scale(1.05);
}

.puck-dt-btn--edit {
  background: var(--puck-dt-edit-bg);
  color: #fff;
}

.puck-dt-btn--delete {
  background: var(--puck-dt-delete-bg);
  color: #fff;
}

.puck-dt-btn--link {
  background: #6b7280;
  color: #fff;
  text-decoration: none;
}

.puck-dt-btn__icon {
  font-size: 0.875rem;
  line-height: 1;
}

.puck-datatable-block__error {
  padding: 12px 16px;
  color: #dc2626;
  background: #fef2f2;
  border-radius: 12px;
  font-size: 0.875rem;
}
</style>
