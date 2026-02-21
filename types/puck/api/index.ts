import type { PuckAction } from '../reducer-actions'
import type { WithDeepSlots } from '../internal'
import type { DefaultComponentProps } from '../props'
import type { AppState } from '../app-state'
import type { ComponentDataOptionalId, Content, Data } from '../data'
import type { Config, DefaultComponents } from '../config'
import type { FieldTransforms } from './field-transforms'
import type { Overrides } from './overrides'

export type { Permissions } from './permissions'
export type IframeConfig = {
  enabled?: boolean
  waitForStyles?: boolean
}

export type OnAction<UserData extends Data = Data> = (
  action: PuckAction,
  appState: AppState<UserData>,
  prevAppState: AppState<UserData>
) => void

export type Plugin<UserConfig extends Config = Config> = {
  name?: string
  label?: string
  icon?: unknown
  render?: () => unknown
  overrides?: Partial<Overrides<UserConfig>>
  fieldTransforms?: FieldTransforms<UserConfig>
  mobilePanelHeight?: 'toggle' | 'min-content'
}

export type History<D = any> = {
  state: D
  id?: string
}

type InitialHistoryAppend<AS = Partial<AppState>> = {
  histories: History<AS>[]
  index?: number
  appendData?: true
}

type InitialHistoryNoAppend<AS = Partial<AppState>> = {
  histories: [History<AS>, ...History<AS>[]]
  index?: number
  appendData?: false
}

export type InitialHistory<AS = Partial<AppState>> = InitialHistoryAppend<AS> | InitialHistoryNoAppend<AS>

export type Slot<
  Props extends Record<string, DefaultComponentProps> = Record<string, DefaultComponentProps>
> = {
  [K in keyof Props]: ComponentDataOptionalId<Props[K], K extends string ? K : never>
}[keyof Props][]

export type WithSlotProps<
  Target extends Record<string, any>,
  Components extends DefaultComponents = DefaultComponents,
  SlotType extends Content<Components> = Content<Components>
> = WithDeepSlots<Target, SlotType>

export type RichText = string | unknown

export * from './drop-zone'
export * from './viewports'
export * from './field-transforms'
export type { Overrides } from './overrides'
