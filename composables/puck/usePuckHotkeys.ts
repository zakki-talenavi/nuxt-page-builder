import { useMagicKeys } from '@vueuse/core'
import { usePuckStore } from '~~/stores/puck'
import { watch } from 'vue'

export function usePuckHotkeys() {
  const store = usePuckStore()

  const { Meta_Z, Meta_Shift_Z, Meta_Y, Control_Z, Control_Shift_Z, Control_Y } = useMagicKeys()

  watch(() => Meta_Z?.value, (v: boolean | undefined) => {
    if (v) store.historyBack()
  })
  watch(() => Control_Z?.value, (v: boolean | undefined) => {
    if (v) store.historyBack()
  })
  watch(() => Meta_Shift_Z?.value, (v: boolean | undefined) => {
    if (v) store.historyForward()
  })
  watch(() => Meta_Y?.value, (v: boolean | undefined) => {
    if (v) store.historyForward()
  })
  watch(() => Control_Shift_Z?.value, (v: boolean | undefined) => {
    if (v) store.historyForward()
  })
  watch(() => Control_Y?.value, (v: boolean | undefined) => {
    if (v) store.historyForward()
  })
}
