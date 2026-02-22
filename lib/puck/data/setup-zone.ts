import type { Data } from '~~/types/puck'
import { rootDroppableId } from '../root-droppable-id'

type WithZones<T extends Data> = T & { zones: NonNullable<T['zones']> }

export const setupZone = <UserData extends Data>(
  data: UserData,
  zoneKey: string
): Required<WithZones<UserData>> => {
  if (zoneKey === rootDroppableId) return data as Required<WithZones<UserData>>
  const newData = {
    ...data,
    zones: data.zones ? { ...data.zones } : {},
  }
  ;(newData.zones as any)[zoneKey] = (newData.zones as any)[zoneKey] || []
  return newData as Required<WithZones<UserData>>
}
