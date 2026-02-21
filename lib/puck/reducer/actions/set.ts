import type { Data } from '@@/types/puck'
import type { SetAction } from '../actions'
import type { PuckStoreLike } from '@@/types/puck/store'
import type { PrivateAppState } from '@@/types/puck'
import { walkAppState } from '../../data/walk-app-state'

export const setAction = <UserData extends Data>(
  state: PrivateAppState<UserData>,
  action: SetAction<UserData>,
  appStore: PuckStoreLike
): PrivateAppState<UserData> => {
  if (typeof action.state === 'object') {
    const newState = { ...state, ...action.state }
    if (action.state.indexes) return newState
    return walkAppState(newState, appStore.config)
  }
  return { ...state, ...action.state(state) }
}
