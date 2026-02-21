import type { AppState } from './app-state'
import type { DefaultComponents } from './config'
import type { ComponentData, Data } from './data'
import type { DefaultComponentProps } from './props'

export type ZoneType = 'root' | 'dropzone' | 'slot'

export type PuckNodeData = {
  data: ComponentData
  flatData: ComponentData
  parentId: string | null
  zone: string
  path: string[]
}

export type PuckZoneData = {
  contentIds: string[]
  type: ZoneType
}

export type NodeIndex = Record<string, PuckNodeData>
export type ZoneIndex = Record<string, PuckZoneData>

export type PrivateAppState<UserData extends Data = Data> = AppState<UserData> & {
  indexes: {
    nodes: NodeIndex
    zones: ZoneIndex
  }
}

type BuiltinTypes =
  | Date
  | RegExp
  | Error
  | Function
  | symbol
  | null
  | undefined

export type WithDeepSlots<T, SlotType = T> = T extends (infer U)[]
  ? Array<WithDeepSlots<U, SlotType>>
  : T extends BuiltinTypes
    ? T
    : T extends object
      ? { [K in keyof T]: WithDeepSlots<T[K], SlotType> }
      : T

export type ConfigParams<
  Components extends DefaultComponents = DefaultComponents,
  RootProps extends DefaultComponentProps = any,
  CategoryNames extends string[] = string[],
  UserFields extends FieldsExtension = FieldsExtension
> = {
  components?: Components
  root?: RootProps
  categories?: CategoryNames
  fields?: AssertHasValue<UserFields>
}

export type FieldsExtension = { [Type in string]: { type: Type } }

export type ComponentConfigParams<
  Props extends DefaultComponentProps = DefaultComponentProps,
  UserFields extends FieldsExtension = never
> = {
  props: Props
  fields?: AssertHasValue<UserFields>
}

export type Exact<T, Target> = Record<Exclude<keyof T, keyof Target>, never>

export type LeftOrExactRight<Union, Left, Right> =
  | (Left & Union extends Right ? Exact<Union, Right> : Left)
  | (Right & Exact<Union, Right>)

export type AssertHasValue<T, True = T, False = never> = [keyof T] extends [never] ? False : True

export type RenderFunc<Props extends Record<string, any> = Record<string, any>> = (props: Props) => unknown

export type PluginInternal = {
  name?: string
  label?: string
  icon?: unknown
  render?: () => unknown
  overrides?: any
  fieldTransforms?: any
  mobilePanelHeight?: 'toggle' | 'min-content'
  mobileOnly?: boolean
  desktopOnly?: boolean
}
