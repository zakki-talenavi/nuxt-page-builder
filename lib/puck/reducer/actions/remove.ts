import type { Data } from '@@/types/puck'
import type { RemoveAction } from '../actions'
import type { PuckStoreLike } from '@@/types/puck/store'
import type { PrivateAppState } from '@@/types/puck'
import { remove } from '../../data/remove'
import { getItem } from '../../data/get-item'
import { walkAppState } from '../../data/walk-app-state'

export const removeAction = <UserData extends Data>(
  state: PrivateAppState<UserData>,
  action: RemoveAction,
  appStore: PuckStoreLike
): PrivateAppState<UserData> => {
  const item = getItem({ index: action.index, zone: action.zone }, state)!
  const nodesToDelete = Object.entries(state.indexes.nodes).reduce<string[]>(
    (acc, [nodeId, nodeData]) => {
      const pathIds = nodeData.path.map((p) => p.split(':')[0])
      if (pathIds.includes(item.props.id)) return [...acc, nodeId]
      return acc
    },
    [item.props.id]
  )

  const newState = walkAppState<UserData>(
    state,
    appStore.config,
    (content, zoneCompound) => {
      if (zoneCompound === action.zone) {
        return remove(content, action.index)
      }
      return content
    }
  )

  Object.keys(newState.data.zones || {}).forEach((zoneCompound) => {
    const parentId = zoneCompound.split(':')[0]
    if (nodesToDelete.includes(parentId) && newState.data.zones) {
      delete (newState.data.zones as any)[zoneCompound]
    }
  })

  Object.keys(newState.indexes.zones).forEach((zoneCompound) => {
    const parentId = zoneCompound.split(':')[0]
    if (nodesToDelete.includes(parentId)) {
      delete (newState.indexes.zones as any)[zoneCompound]
    }
  })

  nodesToDelete.forEach((id) => {
    delete (newState.indexes.nodes as any)[id]
  })

  return newState
}
