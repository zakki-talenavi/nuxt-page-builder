import type { ComponentData, Config, UserGenerics } from '~/types/puck'
import type { PrivateAppState } from '~/types/puck'
import { walkAppState } from './walk-app-state'

export const flattenData = <
  UserConfig extends Config = Config,
  G extends UserGenerics<UserConfig> = UserGenerics<UserConfig>
>(
  state: PrivateAppState,
  config: UserConfig
): ComponentData[] => {
  const data: ComponentData[] = []
  walkAppState(
    state,
    config,
    (content) => content,
    (item) => {
      data.push(item)
      return item
    }
  )
  return data
}
