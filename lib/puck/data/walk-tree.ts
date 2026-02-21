import type {
  ComponentData,
  Config,
  Content,
  RootData,
  UserGenerics,
} from '@@/types/puck'
import { mapFields } from './map-fields'

type WalkTreeOptions = { parentId: string; propName: string }

export function walkTree<
  T extends ComponentData | RootData | any,
  UserConfig extends Config = Config,
  G extends UserGenerics<UserConfig> = UserGenerics<UserConfig>
>(
  data: T,
  config: UserConfig,
  callbackFn: (data: Content, options: WalkTreeOptions) => Content | null | void
): T {
  const walkItem = (item: any): any => {
    return mapFields(
      item,
      {
        slot: ({ value, parentId, propName }) => {
          const content = value as Content
          return callbackFn(content, { parentId, propName }) ?? content
        },
      },
      config,
      true
    )
  }

  if ('props' in data && data.props) {
    return walkItem(data) as T
  }

  const _data = data as G['UserData']
  const zones = _data.zones ?? {}
  const mappedContent = _data.content.map(walkItem)

  return {
    root: walkItem(_data.root),
    content:
      callbackFn(mappedContent, { parentId: 'root', propName: 'default-zone' }) ?? mappedContent,
    zones: Object.keys(zones).reduce(
      (acc, zoneCompound) => ({
        ...acc,
        [zoneCompound]: (zones[zoneCompound] as any[]).map(walkItem),
      }),
      {}
    ),
  } as T
}
