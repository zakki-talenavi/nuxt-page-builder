import type { Data } from '@@/types/puck'
import type { ReplaceRootAction } from '../actions'
import type { PuckStoreLike } from '@@/types/puck/store'
import type { PrivateAppState } from '@@/types/puck'
import { walkAppState } from '../../data/walk-app-state'

export const replaceRootAction = <UserData extends Data>(
  state: PrivateAppState<UserData>,
  action: ReplaceRootAction<UserData>,
  appStore: PuckStoreLike
): PrivateAppState<UserData> => {
  return walkAppState<UserData>(
    state,
    appStore.config,
    (content) => content,
    (childItem) => {
      if (childItem.props.id === 'root') {
        return {
          ...childItem,
          props: { ...childItem.props, ...action.root.props },
          readOnly: action.root.readOnly,
        } as any
      }
      return childItem
    }
  )
}
