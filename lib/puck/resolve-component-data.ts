import type {
  ComponentData,
  Config,
  Content,
  Metadata,
  ResolveDataTrigger,
  RootDataWithProps,
} from '~/types/puck'
import { mapFields } from './data/map-fields'
import { toComponent } from './data/to-component'
import { getChanged } from './get-changed'
import { deepEqual } from 'fast-equals'

export const cache: { lastChange: Record<string, any> } = { lastChange: {} }

export const resolveComponentData = async <T extends ComponentData | RootDataWithProps>(
  item: T,
  config: Config,
  metadata: Metadata = {},
  onResolveStart?: (item: T) => void,
  onResolveEnd?: (item: T) => void,
  trigger: ResolveDataTrigger = 'replace',
  parent: ComponentData | null = null
) => {
  const configForItem =
    'type' in item && item.type !== 'root' ? config.components[item.type] : config.root

  const resolvedItem: T = { ...item }

  const shouldRunResolver = configForItem?.resolveData && item.props
  const id = 'id' in item.props ? item.props.id : 'root'

  if (shouldRunResolver) {
    const { item: oldItem = null, resolved = {}, parentId: oldParentId = null } =
      cache.lastChange[id] || {}
    const isRootOrInserted = oldParentId === null
    const parentChanged = !isRootOrInserted && parent?.props.id !== oldParentId
    const dataChanged = item && !deepEqual(item, oldItem)

    const shouldSkip =
      (trigger === 'move' && !parentChanged) ||
      (trigger !== 'move' && trigger !== 'force' && !dataChanged)

    if (shouldSkip) {
      return { node: resolved as T, didChange: false }
    }

    const changed = getChanged(item, oldItem) as any

    if (onResolveStart) onResolveStart(item)

    const { props: resolvedProps, readOnly = {} } = await (configForItem as any).resolveData(
      item,
      {
        changed,
        lastData: oldItem,
        metadata: { ...metadata, ...(configForItem as any).metadata },
        trigger,
        parent,
      }
    )

    resolvedItem.props = { ...item.props, ...resolvedProps }
    if (Object.keys(readOnly).length) (resolvedItem as any).readOnly = readOnly
  }

  const itemAsComponentData: ComponentData = toComponent(resolvedItem)

  const itemWithResolvedChildren = await mapFields(
    resolvedItem,
    {
      slot: async ({ value }) => {
        const content = value as Content
        return Promise.all(
          content.map(async (childItem) =>
            (
              await resolveComponentData(
                childItem as T,
                config,
                metadata,
                onResolveStart,
                onResolveEnd,
                trigger,
                itemAsComponentData
              )
            ).node
          )
        )
      },
    },
    config
  )

  if (shouldRunResolver && onResolveEnd) onResolveEnd(resolvedItem)

  cache.lastChange[id] = {
    item,
    resolved: itemWithResolvedChildren,
    parentId: parent?.props.id,
  }

  return {
    node: itemWithResolvedChildren,
    didChange: !deepEqual(item, itemWithResolvedChildren),
  }
}
