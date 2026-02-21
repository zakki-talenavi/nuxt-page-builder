import type { Data } from '~/types/puck'
import type { ReorderAction } from '../actions'
import type { PuckStoreLike } from '~/types/puck/store'
import type { PrivateAppState } from '~/types/puck'
import { moveAction } from './move'

export const reorderAction = <UserData extends Data>(
  state: PrivateAppState<UserData>,
  action: ReorderAction,
  appStore: PuckStoreLike
): PrivateAppState<UserData> => {
  return moveAction(state, {
    type: 'move',
    sourceIndex: action.sourceIndex,
    sourceZone: action.destinationZone,
    destinationIndex: action.destinationIndex,
    destinationZone: action.destinationZone,
  }, appStore)
}
