import { usePuckStore } from '@@/stores/puck'

export function useBreadcrumbs() {
  const store = usePuckStore()

  const crumbs = computed(() => {
    const result: { id: string; label: string }[] = [
      { id: 'root', label: 'Page' },
    ]

    const selectedItem = store.selectedItem
    if (!selectedItem) return result

    const nodeIndex = (store.state as any).indexes?.nodes
    if (!nodeIndex) return result

    const node = nodeIndex[selectedItem.props.id]
    if (!node) {
      result.push({
        id: selectedItem.props.id,
        label: store.config.components?.[selectedItem.type]?.label || selectedItem.type,
      })
      return result
    }

    const path = node.path || []
    for (const zoneCompound of path) {
      const [parentId] = zoneCompound.split(':')
      if (parentId === 'root') continue
      const parentNode = nodeIndex[parentId]
      if (parentNode) {
        result.push({
          id: parentId,
          label: store.config.components?.[parentNode.data.type]?.label || parentNode.data.type,
        })
      }
    }

    result.push({
      id: selectedItem.props.id,
      label: store.config.components?.[selectedItem.type]?.label || selectedItem.type,
    })

    return result
  })

  return { crumbs }
}
