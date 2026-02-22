/**
 * Resolve puck path from route segments (mirrors puck-main).
 * Last segment "edit" = edit mode; path is the URL path being edited/viewed.
 */
export function resolvePuckPath(puckPath: string[] = []) {
  const hasPath = puckPath.length > 0
  const isEdit = hasPath ? puckPath[puckPath.length - 1] === 'edit' : false
  const path = `/${(isEdit ? [...puckPath].slice(0, puckPath.length - 1) : [...puckPath]).join('/')}`
  return { isEdit, path }
}
