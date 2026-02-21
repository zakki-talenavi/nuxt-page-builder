import type { Content, Data } from '@@/types/puck'
import type { RegisterZoneAction, UnregisterZoneAction } from '../actions'
import type { PrivateAppState } from '@@/types/puck'
import { setupZone } from '../../data/setup-zone'

export const zoneCache: Record<string, Content> = {}

export const addToZoneCache = (key: string, data: Content) => {
  zoneCache[key] = data
}

export function registerZoneAction<UserData extends Data>(
  state: PrivateAppState<UserData>,
  action: RegisterZoneAction
): PrivateAppState<UserData> {
  if (zoneCache[action.zone]) {
    return {
      ...state,
      data: {
        ...state.data,
        zones: {
          ...(state.data.zones || {}),
          [action.zone]: zoneCache[action.zone],
        },
      },
      indexes: {
        ...state.indexes,
        zones: {
          ...state.indexes.zones,
          [action.zone]: {
            ...(state.indexes.zones[action.zone] || {}),
            contentIds: zoneCache[action.zone].map((item) => item.props.id),
            type: 'dropzone',
          },
        },
      },
    } as PrivateAppState<UserData>
  }
  return { ...state, data: setupZone(state.data, action.zone) } as PrivateAppState<UserData>
}

export function unregisterZoneAction<UserData extends Data>(
  state: PrivateAppState<UserData>,
  action: UnregisterZoneAction
): PrivateAppState<UserData> {
  const _zones = { ...(state.data.zones || {}) }
  const zoneIndex = { ...(state.indexes.zones || {}) }

  if (_zones[action.zone]) {
    zoneCache[action.zone] = _zones[action.zone]
    delete (_zones as any)[action.zone]
  }

  delete (zoneIndex as any)[action.zone]

  return {
    ...state,
    data: { ...state.data, zones: _zones },
    indexes: { ...state.indexes, zones: zoneIndex },
  }
}
