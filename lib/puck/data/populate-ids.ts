import type { ComponentData, ComponentDataOptionalId, Config } from '@@/types/puck'
import { generateId } from '../generate-id'
import { walkTree } from './walk-tree'

export const populateIds = (
  data: ComponentData,
  config: Config,
  override = false
): ComponentData => {
  const id = generateId(data.type)
  return walkTree(
    {
      ...data,
      props: override ? { ...data.props, id } : { ...data.props },
    },
    config,
    (contents) =>
      contents.map((item: ComponentDataOptionalId) => {
        const itemId = generateId(item.type)
        return {
          ...item,
          props: override ? { ...item.props, id: itemId } : { id: itemId, ...item.props },
        }
      })
  )
}
