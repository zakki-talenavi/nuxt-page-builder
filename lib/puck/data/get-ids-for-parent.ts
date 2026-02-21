import type { PrivateAppState } from '~/types/puck'

export const getIdsForParent = (zoneCompound: string, state: PrivateAppState): string[] => {
  const [parentId] = zoneCompound.split(':')
  const node = state.indexes.nodes[parentId]
  return (node?.path || []).map((p) => p.split(':')[0])
}
