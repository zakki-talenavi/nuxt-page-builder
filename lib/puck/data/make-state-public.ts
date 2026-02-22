import type { AppState, Data } from '~~/types/puck'
import type { PrivateAppState } from '~~/types/puck'

export const makeStatePublic = <UserData extends Data>(
  state: PrivateAppState<UserData>
): AppState<UserData> => {
  const { data, ui } = state
  return { data, ui }
}
