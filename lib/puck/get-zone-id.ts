import { rootDroppableId } from './root-droppable-id'

export const getZoneId = (zoneCompound?: string): string[] => {
  if (!zoneCompound) return []
  if (zoneCompound.indexOf(':') > -1) return zoneCompound.split(':')
  return [rootDroppableId, zoneCompound]
}
