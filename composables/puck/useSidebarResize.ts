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

    let rafId: number | null = null
    let lastEv: MouseEvent | null = null
    const onMouseMove = (ev: MouseEvent) => {
      lastEv = ev
      if (rafId != null) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        const e = lastEv
        lastEv = null
        if (!e) return
        const delta = side === 'left' ? e.clientX - startX : startX - e.clientX
        width.value = Math.max(minWidth, Math.min(maxWidth, startWidth + delta))
      })
    }

    const onMouseUp = () => {
      if (rafId != null) cancelAnimationFrame(rafId)
      lastEv = null
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
