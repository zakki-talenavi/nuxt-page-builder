import type { Data } from '~~/types/puck'
import type { SetDataAction } from '../actions'
import type { PuckStoreLike } from '~~/types/puck/store'
import type { PrivateAppState } from '~~/types/puck'
import { walkAppState } from '../../data/walk-app-state'

export const setDataAction = <UserData extends Data>(
  state: PrivateAppState<UserData>,
  action: SetDataAction,
  appStore: PuckStoreLike
): PrivateAppState<UserData> => {
  if (typeof action.data === 'object') {
    return walkAppState(
      {
        ...state,
        data: { ...state.data, ...action.data },
      },
      appStore.config
    )
  }
  return walkAppState(
    {
      ...state,
      data: { ...state.data, ...action.data(state.data) },
    },
    appStore.config
  )
}
