import type { Data } from '@@/types/puck'

export const defaultData = (data: Partial<Data>): Data => ({
  ...data,
  root: data.root || {},
  content: data.content || [],
})
