import type { DefaultComponents } from './config'
import type { WithDeepSlots } from './internal'
import type { DefaultComponentProps, DefaultRootFieldProps } from './props'
import type { AsFieldProps, WithId } from './utils'

export type BaseData<Props extends Record<string, any> = Record<string, any>> = {
  readOnly?: Partial<Record<keyof Props, boolean>>
}

export type RootDataWithProps<
  Props extends DefaultComponentProps = DefaultRootFieldProps
> = BaseData<Props> & {
  props: Props
}

export type RootDataWithoutProps<
  Props extends DefaultComponentProps = DefaultRootFieldProps
> = Props

export type RootData<
  Props extends DefaultComponentProps = DefaultRootFieldProps
> = Partial<RootDataWithProps<AsFieldProps<Props>>> &
  Partial<RootDataWithoutProps<Props>>

export type ComponentData<
  Props extends DefaultComponentProps = DefaultComponentProps,
  Name = string,
  Components extends Record<string, DefaultComponentProps> = Record<string, DefaultComponentProps>
> = {
  type: Name
  props: WithDeepSlots<WithId<Props>, Content<Components>>
} & BaseData<Props>

export type ComponentDataOptionalId<
  Props extends DefaultComponentProps = DefaultComponentProps,
  Name = string
> = {
  type: Name
  props: Props & { id?: string }
} & BaseData<Props>

export type ComponentDataMap<
  Components extends DefaultComponents = DefaultComponents
> = {
  [K in keyof Components]: ComponentData<
    Components[K],
    K extends string ? K : never,
    Components
  >
}[keyof Components]

export type Content<
  PropsMap extends Record<string, DefaultComponentProps> = Record<string, DefaultComponentProps>
> = ComponentDataMap<PropsMap>[]

export type Data<
  Components extends DefaultComponents = DefaultComponents,
  RootProps extends DefaultComponentProps = DefaultRootFieldProps
> = {
  root: WithDeepSlots<RootData<RootProps>, Content<Components>>
  content: Content<Components>
  zones?: Record<string, Content<Components>>
}

export type Metadata = Record<string, any>

export interface ComponentMetadata extends Metadata {}

export interface FieldMetadata extends Metadata {}
