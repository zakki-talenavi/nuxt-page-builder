import type { Data } from '~~/types/puck'
import type { InsertAction } from '../actions'
import type { PuckStoreLike } from '~~/types/puck/store'
import type { PrivateAppState } from '~~/types/puck'
import { insert } from '../../data/insert'
import { generateId } from '../../generate-id'
import { walkAppState } from '../../data/walk-app-state'
import { getIdsForParent } from '../../data/get-ids-for-parent'
import { populateIds } from '../../data/populate-ids'

export function insertAction<UserData extends Data>(
  state: PrivateAppState<UserData>,
  action: InsertAction,
  appStore: PuckStoreLike
): PrivateAppState<UserData> {
  const id = action.id || generateId(action.componentType)
  const compConfig = appStore.config.components[action.componentType]
  const emptyComponentData = populateIds(
    {
      type: action.componentType,
      props: {
        ...(compConfig?.defaultProps || {}),
        id,
      },
    },
    appStore.config
  )

  const idsInPath = getIdsForParent(action.destinationZone, state)

  return walkAppState<UserData>(
    state,
    appStore.config,
    (content, zoneCompound) => {
      if (zoneCompound === action.destinationZone) {
        return insert(content || [], action.destinationIndex, emptyComponentData)
      }
      return content
    },
    (childItem, path) => {
      if (childItem.props.id === id || childItem.props.id === action.destinationZone.split(':')[0])
        return childItem
      if (idsInPath.includes(childItem.props.id)) return childItem
      if (path.includes(action.destinationZone)) return childItem
      return null
    }
  )
}
