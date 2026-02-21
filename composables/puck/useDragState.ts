export type DragItem = {
  componentType: string
  sourceZone?: string
  sourceIndex?: number
}

const isDragging = ref(false)
const dragItem = ref<DragItem | null>(null)
const targetZone = ref<string | null>(null)
const previewIndex = ref(-1)

export function useDragState() {
  function startDrag(item: DragItem) {
    isDragging.value = true
    dragItem.value = item
  }

  function endDrag() {
    isDragging.value = false
    dragItem.value = null
    targetZone.value = null
    previewIndex.value = -1
  }

  function setTarget(zone: string | null, index = -1) {
    targetZone.value = zone
    previewIndex.value = index
  }

  return {
    isDragging: readonly(isDragging),
    dragItem: readonly(dragItem),
    targetZone: readonly(targetZone),
    previewIndex: readonly(previewIndex),
    startDrag,
    endDrag,
    setTarget,
  }
}
