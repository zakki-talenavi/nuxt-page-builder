import type { AppState, Data } from '@@/types/puck'
import type { OnAction } from '@@/types/puck'
import type { PrivateAppState } from '@@/types/puck'
import type { PuckStoreLike } from '@@/types/puck/store'
import { makeStatePublic } from '../data/make-state-public'

export * from './actions'

import type { PuckAction } from './actions'
import { setAction } from './actions/set'
import { insertAction } from './actions/insert'
import { replaceAction } from './actions/replace'
import { replaceRootAction } from './actions/replace-root'
import { duplicateAction } from './actions/duplicate'
import { reorderAction } from './actions/reorder'
import { moveAction } from './actions/move'
import { removeAction } from './actions/remove'
import {
  registerZoneAction,
  unregisterZoneAction,
} from './actions/register-zone'
import { setDataAction } from './actions/set-data'
import { setUiAction } from './actions/set-ui'

export type ActionType = 'insert' | 'reorder'

export type StateReducer<UserData extends Data = Data> = (
  state: PrivateAppState<UserData>,
  action: PuckAction
) => PrivateAppState<UserData>

function storeInterceptor<UserData extends Data = Data>(
  reducer: StateReducer<UserData>,
  record?: (appState: AppState<UserData>) => void,
  onAction?: OnAction<UserData>
): StateReducer<UserData> {
  return (state: PrivateAppState<UserData>, action: PuckAction): PrivateAppState<UserData> => {
    const newAppState = reducer(state, action)
    const isValidType = ![
      'registerZone',
      'unregisterZone',
      'setData',
      'setUi',
      'set',
    ].includes(action.type)

    if (
      (typeof (action as any).recordHistory !== 'undefined'
        ? (action as any).recordHistory
        : isValidType) &&
      record
    ) {
      record(newAppState)
    }

    onAction?.(action, makeStatePublic(newAppState), makeStatePublic(state))
    return newAppState
  }
}

export function createReducer<UserData extends Data>({
  record,
  onAction,
  appStore,
}: {
  record?: (appState: AppState<UserData>) => void
  onAction?: OnAction<UserData>
  appStore: PuckStoreLike
}): StateReducer<UserData> {
  return storeInterceptor(
    (state, action) => {
      if (action.type === 'set') {
        return setAction(state, action as any, appStore) as PrivateAppState<UserData>
      }
      if (action.type === 'insert') return insertAction(state, action as any, appStore)
      if (action.type === 'replace') return replaceAction(state, action as any, appStore)
      if (action.type === 'replaceRoot') return replaceRootAction(state, action as any, appStore)
      if (action.type === 'duplicate') return duplicateAction(state, action as any, appStore)
      if (action.type === 'reorder') return reorderAction(state, action as any, appStore)
      if (action.type === 'move') return moveAction(state, action as any, appStore)
      if (action.type === 'remove') return removeAction(state, action as any, appStore)
      if (action.type === 'registerZone') return registerZoneAction(state, action as any)
      if (action.type === 'unregisterZone') return unregisterZoneAction(state, action as any)
      if (action.type === 'setData') return setDataAction(state, action as any, appStore)
      if (action.type === 'setUi') return setUiAction(state, action as any)
      return state
    },
    record,
    onAction
  )
}
