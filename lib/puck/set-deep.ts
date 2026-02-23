/**
 * Set a value at a dot/bracket path (e.g. "buttons[0].label", "items[0].title").
 * Returns a new object without mutating the original.
 */
export function setDeep<T extends Record<string, any>>(
  node: T,
  path: string,
  newVal: any
): T {
  const parts = path.split('.')
  if (parts.length === 0) return node
  const part = parts[0]
  const bracket = part.indexOf('[')
  const isLast = parts.length === 1

  if (bracket >= 0) {
    const prop = part.slice(0, bracket)
    const idxStr = part.slice(bracket + 1).replace(']', '')
    const idx = Number(idxStr)
    if (Number.isNaN(idx)) return node
    const arr = Array.isArray(node[prop]) ? [...node[prop]] : []
    if (isLast) {
      arr[idx] = newVal
      return { ...node, [prop]: arr } as T
    }
    const next = arr[idx] !== undefined && arr[idx] !== null ? { ...(arr[idx] as object) } : {}
    arr[idx] = setDeep(next as Record<string, any>, parts.slice(1).join('.'), newVal)
    return { ...node, [prop]: arr } as T
  }

  if (isLast) {
    return { ...node, [part]: newVal } as T
  }
  const nextNode = (node[part] !== undefined && node[part] !== null && typeof node[part] === 'object' && !Array.isArray(node[part]))
    ? { ...(node[part] as object) }
    : {}
  return { ...node, [part]: setDeep(nextNode as Record<string, any>, parts.slice(1).join('.'), newVal) } as T
}
