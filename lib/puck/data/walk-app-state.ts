import { forRelatedZones } from './for-related-zones'
import { rootDroppableId } from '../root-droppable-id'
import type {
  ComponentData,
  Config,
  Content,
  Data,
  RootDataWithProps,
} from '~~/types/puck'
import type { NodeIndex, PrivateAppState, ZoneIndex, ZoneType } from '~~/types/puck'
import { mapFields } from './map-fields'
import { flattenNode } from './flatten-node'

export function walkAppState<UserData extends Data = Data>(
  state: PrivateAppState<UserData>,
  config: Config,
  mapContent: (
    content: Content,
    zoneCompound: string,
    zoneType: ZoneType
  ) => Content | void = (content) => content,
  mapNodeOrSkip: (
    item: ComponentData,
    path: string[],
    index: number
  ) => ComponentData | null = (item) => item
): PrivateAppState<UserData> {
  const newZoneIndex: ZoneIndex = {}
  const newNodeIndex: NodeIndex = {}
  let newZones: Record<string, Content> = {}

  const processContent = (
    path: string[],
    zoneCompound: string,
    content: Content,
    zoneType: ZoneType,
    newId?: string
  ): [string, Content] => {
    const [parentId] = zoneCompound.split(':')
    const mappedContent = (mapContent(content, zoneCompound, zoneType) ?? content) || []
    const [, zone] = zoneCompound.split(':')
    const newZoneCompound = `${newId || parentId}:${zone}`

    const newContent = mappedContent.map((zoneChild: any, index: number) =>
      processItem(zoneChild, [...path, newZoneCompound], index)
    )

    newZoneIndex[newZoneCompound] = {
      contentIds: newContent.map((item: any) => item.props.id),
      type: zoneType,
    }

    return [newZoneCompound, newContent]
  }

  const processRelatedZones = (
    item: ComponentData,
    newId: string,
    initialPath: string[]
  ) => {
    forRelatedZones(item, state.data, (relatedPath, relatedZoneCompound, relatedContent) => {
      const [, newContent] = processContent(
        relatedPath,
        relatedZoneCompound,
        relatedContent,
        'dropzone',
        newId
      )
      newZones[relatedZoneCompound] = newContent
    }, initialPath)
  }

  const processItem = (
    item: ComponentData,
    path: string[],
    index: number
  ): ComponentData => {
    const mappedItem = mapNodeOrSkip(item, path, index)
    if (!mappedItem) return item

    const id = mappedItem.props.id
    const newProps = {
      ...mapFields(
        mappedItem,
        {
          slot: ({ value, parentId, propPath }) => {
            const content = value as Content
            const zoneCompound = `${parentId}:${propPath}`
            const [, newContent] = processContent(
              path,
              zoneCompound,
              content,
              'slot',
              parentId
            )
            return newContent
          },
        },
        config
      ).props,
      id,
    }

    processRelatedZones(item, id, path)

    const newItem = { ...item, props: newProps }
    const thisZoneCompound = path[path.length - 1]
    const [parentId, zone] = thisZoneCompound ? thisZoneCompound.split(':') : [null, '']

    newNodeIndex[id] = {
      data: newItem,
      flatData: flattenNode(newItem, config) as ComponentData,
      path,
      parentId,
      zone,
    }

    const finalData: any = { ...newItem, props: { ...newItem.props } }
    if (newProps.id === 'root') {
      delete finalData.type
      delete finalData.props.id
    }
    return finalData
  }

  const zones = state.data.zones || {}
  const [, newContent] = processContent([], rootDroppableId, state.data.content, 'root')
  const processedContent = newContent

  const zonesAlreadyProcessed = Object.keys(newZones)
  Object.keys(zones || {}).forEach((zoneCompound) => {
    const [parentId] = zoneCompound.split(':')
    if (zonesAlreadyProcessed.includes(zoneCompound)) return
    const [, zoneContent] = processContent(
      [rootDroppableId],
      zoneCompound,
      zones[zoneCompound] || [],
      'dropzone',
      parentId
    )
    newZones[zoneCompound] = zoneContent
  })

  const processedRoot = processItem(
    {
      type: 'root',
      props: { ...(state.data.root.props ?? state.data.root), id: 'root' },
    } as ComponentData,
    [],
    -1
  )

  const root: RootDataWithProps = {
    ...state.data.root,
    props: processedRoot.props as any,
  }

  return {
    ...state,
    data: {
      root,
      content: processedContent,
      zones: { ...state.data.zones, ...newZones },
    } as UserData,
    indexes: {
      nodes: { ...state.indexes.nodes, ...newNodeIndex },
      zones: { ...state.indexes.zones, ...newZoneIndex },
    },
  }
}
