export function useSidebarResize(
  initialWidth = 256,
  minWidth = 180,
  maxWidth = 420
) {
  const width = ref(initialWidth)
  const isResizing = ref(false)

  let startX = 0
  let startWidth = 0

  function onMouseDown(e: MouseEvent, side: 'left' | 'right') {
    isResizing.value = true
    startX = e.clientX
    startWidth = width.value

    const onMouseMove = (ev: MouseEvent) => {
      const delta = side === 'left'
        ? ev.clientX - startX
        : startX - ev.clientX
      width.value = Math.max(minWidth, Math.min(maxWidth, startWidth + delta))
    }

    const onMouseUp = () => {
      isResizing.value = false
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  return { width, isResizing, onMouseDown }
}
