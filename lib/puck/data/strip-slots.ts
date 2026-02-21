import type { ComponentData, Config, RootData } from '@@/types/puck'
import { mapFields } from './map-fields'

export const stripSlots = (
  data: ComponentData | RootData,
  config: Config
): ComponentData | RootData => {
  return mapFields(data, { slot: () => null }, config) as ComponentData | RootData
}
