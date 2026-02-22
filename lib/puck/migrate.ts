import type { ComponentData, Config, Content, Data, UserGenerics, WithId } from '~~/types/puck'
import { defaultAppState } from './default-app-state'
import { walkAppState } from './data/walk-app-state'
import { walkTree } from './data/walk-tree'

type MigrationOptions<UserConfig extends Config> = {
  migrateDynamicZonesForComponent?: {
    [K in keyof UserConfig['components']]?: (
      props: WithId<UserGenerics<UserConfig>['UserProps'][K]>,
      zones: Record<string, Content>
    ) => any
  }
}

type Migration = (
  props: Data & Record<string, any>,
  config?: Config,
  migrationOptions?: MigrationOptions<Config>
) => Data

const migrations: Migration[] = [
  (data) => {
    const rootProps = data.root.props || data.root
    if (Object.keys(data.root).length > 0 && !data.root.props) {
      return { ...data, root: { props: { ...rootProps } } }
    }
    return data
  },

  (data, config, migrationOptions) => {
    if (!config) return data
    const appState = { ...defaultAppState, data }
    const { indexes } = walkAppState(appState as any, config)
    const updatedItems: Record<string, ComponentData> = {}
    const deletedCompounds: string[] = []

    walkAppState(appState as any, config, (content, zoneCompound, zoneType) => {
      if (zoneType === 'dropzone') {
        const [id, slotName] = zoneCompound.split(':')
        const nodeData = indexes.nodes[id].data
        const componentType = nodeData.type
        const configForComponent =
          id === 'root' ? config.root : config.components[componentType]
        if ((configForComponent as any)?.fields?.[slotName]?.type === 'slot') {
          updatedItems[id] = {
            ...nodeData,
            props: {
              ...nodeData.props,
              ...(updatedItems[id]?.props || {}),
              [slotName]: content,
            },
          }
          deletedCompounds.push(zoneCompound)
        }
        return content
      }
      return content
    })

    const updated = walkAppState(
      appState as any,
      config,
      (content) => content,
      (item) => updatedItems[item.props.id] ?? item
    )

    deletedCompounds.forEach((zoneCompound) => {
      delete (updated.data as any).zones?.[zoneCompound]
    })

    if (migrationOptions?.migrateDynamicZonesForComponent) {
      const unmigratedZonesGrouped: Record<string, Record<string, Content>> = {}
      Object.keys(updated.data.zones ?? {}).forEach((zoneCompound) => {
        const [componentId, propName] = zoneCompound.split(':')
        const content = (updated.data as any).zones?.[zoneCompound]
        if (!content) return
        if (!unmigratedZonesGrouped[componentId]) unmigratedZonesGrouped[componentId] = {}
        if (!unmigratedZonesGrouped[componentId][propName])
          unmigratedZonesGrouped[componentId][propName] = content
      })

      Object.keys(unmigratedZonesGrouped).forEach((componentId) => {
        updated.data = walkTree(updated.data, config, (content) =>
          content.map((child: ComponentData) => {
            if (child.props.id !== componentId) return child
            const migrateFn =
              migrationOptions.migrateDynamicZonesForComponent?.[child.type as keyof typeof migrationOptions.migrateDynamicZonesForComponent]
            if (!migrateFn) return child
            const zones = unmigratedZonesGrouped[componentId]
            const migratedProps = migrateFn(child.props, zones)
            Object.keys(zones).forEach((propName) => {
              delete (updated.data as any).zones?.[`${componentId}:${propName}`]
            })
            return { ...child, props: migratedProps }
          })
        ) as any
      })
    }

    Object.keys(updated.data.zones ?? {}).forEach((zoneCompound) => {
      throw new Error(
        `Could not migrate DropZone "${zoneCompound}" to slot field. No slot exists with that name.`
      )
    })

    delete (updated.data as any).zones
    return updated.data
  },
]

export function migrate<UserConfig extends Config = Config>(
  data: Data,
  config?: UserConfig,
  migrationOptions?: MigrationOptions<UserConfig>
): Data {
  return migrations.reduce(
    (acc, migration) => migration(acc, config, migrationOptions),
    data
  ) as Data
}
