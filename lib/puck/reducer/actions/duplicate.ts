import type { Data } from '~/types/puck'
import type { DuplicateAction } from '../actions'
import type { PuckStoreLike } from '~/types/puck/store'
import type { PrivateAppState } from '~/types/puck'
import { generateId } from '../../generate-id'
import { walkAppState } from '../../data/walk-app-state'
import { getIdsForParent } from '../../data/get-ids-for-parent'
import { getItem } from '../../data/get-item'
import { insert } from '../../data/insert'

export function duplicateAction<UserData extends Data>(
  state: PrivateAppState<UserData>,
  action: DuplicateAction,
  appStore: PuckStoreLike
): PrivateAppState<UserData> {
  const item = getItem(
    { index: action.sourceIndex, zone: action.sourceZone },
    state
  )!

  const idsInPath = getIdsForParent(action.sourceZone, state)

  const newItem = {
    ...item,
    props: { ...item.props, id: generateId(item.type) },
  }

  const modified = walkAppState<UserData>(
    state,
    appStore.config,
    (content, zoneCompound) => {
      if (zoneCompound === action.sourceZone) {
        return insert(content, action.sourceIndex + 1, item)
      }
      return content
    },
    (childItem, path, index) => {
      const zoneCompound = path[path.length - 1]
      const parents = path.map((p) => p.split(':')[0])

      if (parents.indexOf(newItem.props.id) > -1) {
        return {
          ...childItem,
          props: { ...childItem.props, id: generateId(childItem.type) },
        }
      }

      if (
        zoneCompound === action.sourceZone &&
        index === action.sourceIndex + 1
      ) {
        return newItem
      }

      const [sourceZoneParent] = action.sourceZone.split(':')
      if (
        sourceZoneParent === childItem.props.id ||
        idsInPath.indexOf(childItem.props.id) > -1
      ) {
        return childItem
      }
      return null
    }
  )

  return {
    ...modified,
    ui: {
      ...modified.ui,
      itemSelector: {
        index: action.sourceIndex + 1,
        zone: action.sourceZone,
      },
    },
  }
}
