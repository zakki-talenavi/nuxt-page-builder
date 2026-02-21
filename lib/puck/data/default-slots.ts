import type { Fields } from '@@/types/puck'

export const defaultSlots = (value: object, fields: Fields) =>
  Object.keys(fields).reduce(
    (acc, fieldName) =>
      (fields as any)[fieldName].type === 'slot' ? { [fieldName]: [], ...acc } : acc,
    value as Record<string, any>
  )
