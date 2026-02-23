import { puckConfig, puckComponentKey } from '~/config'
import { getInitialDataForPath } from '~/config/initial-data'
import { resolveAllData } from '~~/lib/puck/resolve-all-data'
import type { Data } from '~~/types/puck'

export function getStorageKeyForPath(path: string): string {
  const segment = (path || '/').replace(/^\/+/, '') || 'index'
  if (segment === 'index') return 'puck-data-index'
  return `puck-data:${puckComponentKey}:${segment}`
}

export function useDemoData(options: {
  path: string
  isEdit: boolean
  metadata?: Record<string, unknown>
}) {
  const { path, isEdit, metadata = {} } = options
  const key = getStorageKeyForPath(path)

  const data = ref<Partial<Data> | null>(null)
  const resolvedData = ref<Partial<Data> | null>(null)

  function load() {
    if (import.meta.server) return
    try {
      const raw = localStorage.getItem(key)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed?.root != null) {
          data.value = parsed
          if (!isEdit) {
            resolveAllData(parsed, puckConfig, metadata).then((resolved) => {
              resolvedData.value = resolved
            })
          } else {
            resolvedData.value = parsed
          }
          return
        }
      }
    } catch (_) {}
    const fallback = getInitialDataForPath(path)
    data.value = fallback
    resolvedData.value = isEdit ? fallback : null
    if (!isEdit && fallback) {
      resolveAllData(fallback, puckConfig, metadata).then((resolved) => {
        resolvedData.value = resolved
      })
    }
  }

  function getDefaultData(): Partial<Data> {
    return getInitialDataForPath(path)
  }

  function save(payload: Data) {
    data.value = payload
    if (import.meta.client) {
      try {
        localStorage.setItem(key, JSON.stringify(payload))
      } catch (_) {}
    }
  }

  onMounted(load)
  watch([() => options.path, () => options.isEdit], load)

  return {
    data,
    resolvedData,
    key,
    getDefaultData,
    save,
    load,
  }
}
