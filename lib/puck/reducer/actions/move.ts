import type { Content, Data } from '~/types/puck'
import type { MoveAction } from '../actions'
import type { PuckStoreLike } from '~/types/puck/store'
import type { PrivateAppState } from '~/types/puck'
import { insert } from '../../data/insert'
import { remove } from '../../data/remove'
import { getItem } from '../../data/get-item'
import { walkAppState } from '../../data/walk-app-state'
import { getIdsForParent } from '../../data/get-ids-for-parent'

export const zoneCache: Record<string, Content> = {}

export const addToZoneCache = (key: string, data: Content) => {
  zoneCache[key] = data
}

export const moveAction = <UserData extends Data>(
  state: PrivateAppState<UserData>,
  action: MoveAction,
  appStore: PuckStoreLike
): PrivateAppState<UserData> => {
  if (
    action.sourceZone === action.destinationZone &&
    action.sourceIndex === action.destinationIndex
  ) {
    return state
  }

  const item = getItem(
    { zone: action.sourceZone, index: action.sourceIndex },
    state
  )

  if (!item) return state

  const idsInSourcePath = getIdsForParent(action.sourceZone, state)
  const idsInDestinationPath = getIdsForParent(action.destinationZone, state)

  return walkAppState<UserData>(
    state,
    appStore.config,
    (content, zoneCompound) => {
      if (
        zoneCompound === action.sourceZone &&
        zoneCompound === action.destinationZone
      ) {
        return insert(
          remove(content, action.sourceIndex),
          action.destinationIndex,
          item
        )
      }
      if (zoneCompound === action.sourceZone) {
        return remove(content, action.sourceIndex)
      }
      if (zoneCompound === action.destinationZone) {
        return insert(content, action.destinationIndex, item)
      }
      return content
    },
    (childItem, path) => {
      const [sourceZoneParent] = action.sourceZone.split(':')
      const [destinationZoneParent] = action.destinationZone.split(':')
      const childId = childItem.props.id
      if (
        sourceZoneParent === childId ||
        destinationZoneParent === childId ||
        item.props.id === childId ||
        idsInSourcePath.indexOf(childId) > -1 ||
        idsInDestinationPath.indexOf(childId) > -1 ||
        path.includes(action.destinationZone)
      ) {
        return childItem
      }
      return null
    }
  )
}
