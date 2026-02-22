import type { Overrides, Plugin } from '~~/types/puck'

export function useLoadedOverrides(
  plugins: Plugin[],
  baseOverrides: Partial<Overrides> = {}
): Partial<Overrides> {
  const merged = { ...baseOverrides }
  for (const plugin of plugins) {
    if (plugin.overrides) {
      for (const [key, value] of Object.entries(plugin.overrides)) {
        const k = key as keyof Overrides
        if (value) {
          const existing = merged[k]
          if (existing && typeof existing === 'function' && typeof value === 'function') {
            merged[k] = ((...args: any[]) => {
              const result = (value as Function)(...args)
              return result !== undefined ? result : (existing as Function)(...args)
            }) as any
          } else {
            ;(merged as any)[k] = value
          }
        }
      }
    }
  }
  return merged
}
