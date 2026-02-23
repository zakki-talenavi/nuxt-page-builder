<template>
  <component
    :is="rich ? 'div' : 'span'"
    ref="elRef"
    class="puck-inline-text-edit"
    :class="{ 'puck-inline-text-edit--rich': rich }"
    :contenteditable="(isHovering || isFocused) && !isReadOnly ? (rich ? 'true' : 'plaintext-only') : 'false'"
    @click.prevent.stop
    @click.capture.prevent.stop="onClickCapture"
    @keydown.stop="onKeyDown"
    @keyup.stop.prevent="onKeyUp"
    @mouseover.capture="isHovering = true"
    @mouseout.capture="isHovering = false"
    @focus="isFocused = true"
    @blur="isFocused = false"
    @input="onInput"
  />
</template>

<script setup lang="ts">
import { usePuckStore } from '~~/stores/puck'
import { rootDroppableId } from '~~/lib/puck/root-droppable-id'
import { setDeep } from '~~/lib/puck/set-deep'

const store = usePuckStore()

const props = withDefaults(
  defineProps<{
    value: string
    propPath: string
    componentId: string
    isReadOnly?: boolean
    disableLineBreaks?: boolean
    /** When true, value is HTML (innerHTML); otherwise plain text (innerText). */
    rich?: boolean
  }>(),
  { isReadOnly: false, disableLineBreaks: false, rich: false }
)

const elRef = ref<HTMLElement | null>(null)
const isHovering = ref(false)
const isFocused = ref(false)

function getLocation(): { zone: string; index: number } | null {
  const state = store.state as any
  const nodeInfo = state?.indexes?.nodes?.[props.componentId]
  if (!nodeInfo) return null
  const parentId = nodeInfo.parentId
  const zoneName = nodeInfo.zone
  const zoneCompound = parentId && zoneName ? `${parentId}:${zoneName}` : rootDroppableId
  const zoneIndex = state?.indexes?.zones?.[zoneCompound]
  if (!zoneIndex) return null
  const index = zoneIndex.contentIds?.indexOf(props.componentId) ?? -1
  if (index < 0) return null
  return { zone: zoneCompound, index }
}

function onInput(e: Event) {
  if (props.isReadOnly) return
  const target = e.target as HTMLElement
  let value = props.rich ? (target.innerHTML ?? '') : (target.innerText ?? '')
  if (!props.rich && props.disableLineBreaks) value = value.replace(/\n/gm, '')
  const loc = getLocation()
  if (!loc) return
  const nodeData = (store.state as any).indexes?.nodes?.[props.componentId]?.data
  if (!nodeData) return
  const newProps = setDeep(nodeData.props || {}, props.propPath, value)
  store.dispatch({
    type: 'replace',
    data: { ...nodeData, props: newProps },
    destinationIndex: loc.index,
    destinationZone: loc.zone,
  })
}

function onClickCapture() {
  const state = store.state as any
  const nodeInfo = state?.indexes?.nodes?.[props.componentId]
  if (!nodeInfo) return
  const parentId = nodeInfo.parentId
  const zoneName = nodeInfo.zone
  const zoneCompound = parentId && zoneName ? `${parentId}:${zoneName}` : rootDroppableId
  const zoneIndex = state?.indexes?.zones?.[zoneCompound]
  const index = zoneIndex?.contentIds?.indexOf(props.componentId) ?? -1
  if (index >= 0) store.dispatch({ type: 'setUi', ui: { itemSelector: { index, zone: zoneCompound } } })
}

function onKeyDown(e: KeyboardEvent) {
  if ((props.disableLineBreaks && e.key === 'Enter') || props.isReadOnly) e.preventDefault()
}

function onKeyUp(e: KeyboardEvent) {
  e.preventDefault()
}

function setContent(val: string) {
  if (!elRef.value) return
  if (props.rich) {
    if (elRef.value.innerHTML !== (val ?? '')) elRef.value.innerHTML = val ?? ''
  } else {
    if (elRef.value.innerText !== (val ?? '')) elRef.value.replaceChildren(val ?? '')
  }
}

watch(
  () => props.value,
  (val) => setContent(val ?? ''),
  { immediate: true }
)

onMounted(() => setContent(props.value ?? ''))
</script>

<style scoped>
.puck-inline-text-edit {
  outline: none;
  min-width: 2ch;
}
.puck-inline-text-edit:empty::before {
  content: attr(data-placeholder);
  color: #9ca3af;
}
.puck-inline-text-edit--rich {
  display: block;
}
</style>
