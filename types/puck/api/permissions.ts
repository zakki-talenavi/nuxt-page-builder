export type Permissions = {
  drag: boolean
  duplicate: boolean
  delete: boolean
  edit: boolean
  insert: boolean
} & Record<string, boolean>
