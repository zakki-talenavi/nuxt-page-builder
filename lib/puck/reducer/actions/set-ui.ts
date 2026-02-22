import type { Data } from '~~/types/puck'
import type { SetUiAction } from '../actions'
import type { PrivateAppState } from '~~/types/puck'

export const setUiAction = <UserData extends Data>(
  state: PrivateAppState<UserData>,
  action: SetUiAction
): PrivateAppState<UserData> => {
  if (typeof action.ui === 'object') {
    return {
      ...state,
      ui: { ...state.ui, ...action.ui },
    }
  }
  return {
    ...state,
    ui: { ...state.ui, ...action.ui(state.ui) },
  }
}
