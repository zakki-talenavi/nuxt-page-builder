import type { ComponentData, ComponentDataOptionalId, Data } from '~~/types/puck'
import type { ReplaceAction } from '../actions'
import type { PuckStoreLike } from '~~/types/puck/store'
import type { PrivateAppState } from '~~/types/puck'
import { walkAppState } from '../../data/walk-app-state'
import { getIdsForParent } from '../../data/get-ids-for-parent'
import { walkTree } from '../../data/walk-tree'
import { generateId } from '../../generate-id'

export const replaceAction = <UserData extends Data>(
  state: PrivateAppState<UserData>,
  action: ReplaceAction<UserData>,
  appStore: PuckStoreLike
): PrivateAppState<UserData> => {
  const [parentId] = action.destinationZone.split(':')
  const idsInPath = getIdsForParent(action.destinationZone, state)
  const originalId = state.indexes.zones[action.destinationZone]?.contentIds?.[action.destinationIndex]

  if (originalId !== action.data.props.id) {
    throw new Error(
      'Cannot change the id during a replace action. Use "remove" and "insert" instead.'
    )
  }

  const newSlotIds: string[] = []
  const data = walkTree(action.data, appStore.config, (contents, opts) => {
    newSlotIds.push(`${opts.parentId}:${opts.propName}`)
    return contents.map((item: ComponentDataOptionalId) => {
      const itemId = generateId(item.type)
      return { ...item, props: { id: itemId, ...item.props } }
    })
  })

  const stateWithDeepSlotsRemoved = {
    ...state,
    ui: { ...state.ui, ...action.ui },
  }

  Object.keys(state.indexes.zones).forEach((zoneCompound) => {
    const id = zoneCompound.split(':')[0]
    if (id === originalId && !newSlotIds.includes(zoneCompound)) {
      delete (stateWithDeepSlotsRemoved.indexes.zones as any)[zoneCompound]
    }
  })

  return walkAppState<UserData>(
    stateWithDeepSlotsRemoved,
    appStore.config,
    (content, zoneCompound) => {
      const newContent = [...content]
      if (zoneCompound === action.destinationZone) {
        newContent[action.destinationIndex] = data
      }
      return newContent
    },
    (childItem, path) => {
      const pathIds = path.map((p) => p.split(':')[0])
      if (childItem.props.id === data.props.id) return data
      if (childItem.props.id === parentId) return childItem
      if (idsInPath.indexOf(childItem.props.id) > -1) return childItem
      if (pathIds.indexOf(data.props.id) > -1) return childItem
      return null
    }
  )
}
