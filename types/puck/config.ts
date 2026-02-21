import type { BaseField, Field, Fields } from './fields'
import type { ComponentData, ComponentMetadata, RootData } from './data'
import type { AsFieldProps, WithChildren, WithId, WithPuckProps } from './utils'
import type { AppState } from './app-state'
import type { DefaultComponentProps, DefaultRootFieldProps } from './props'
import type { Permissions } from './api/permissions'
import type {
  AssertHasValue,
  FieldsExtension,
  LeftOrExactRight,
  WithDeepSlots,
  ConfigParams,
  ComponentConfigParams,
} from './internal'

export type ResolveDataTrigger = 'insert' | 'replace' | 'load' | 'force' | 'move'

type WithPartialProps<T, Props extends DefaultComponentProps> = Omit<T, 'props'> & { props?: Partial<Props> }

export interface ComponentConfigExtensions {}

type ComponentConfigInternal<
  RenderProps extends DefaultComponentProps,
  FieldProps extends DefaultComponentProps,
  DataShape = Omit<ComponentData<FieldProps>, 'type'>,
  UserField extends BaseField = BaseField
> = {
  render: (props: WithId<WithPuckProps<{ [K in keyof RenderProps]: WithDeepSlots<RenderProps[K], (props?: any) => unknown> }>>) => unknown
  label?: string
  defaultProps?: FieldProps
  fields?: Fields<FieldProps, UserField>
  permissions?: Partial<Permissions>
  inline?: boolean
  resolveFields?: (
    data: DataShape,
    params: {
      changed: Partial<Record<keyof FieldProps, boolean> & { id: string }>
      fields: Fields<FieldProps>
      lastFields: Fields<FieldProps>
      lastData: DataShape | null
      metadata: ComponentMetadata
      appState: AppState
      parent: ComponentData | null
    }
  ) => Promise<Fields<FieldProps>> | Fields<FieldProps>
  resolveData?: (
    data: DataShape,
    params: {
      changed: Partial<Record<keyof FieldProps, boolean> & { id: string }>
      lastData: DataShape | null
      metadata: ComponentMetadata
      trigger: ResolveDataTrigger
      parent: ComponentData | null
    }
  ) => Promise<WithPartialProps<DataShape, FieldProps>> | WithPartialProps<DataShape, FieldProps>
  resolvePermissions?: (
    data: DataShape,
    params: {
      changed: Partial<Record<keyof FieldProps, boolean> & { id: string }>
      lastPermissions: Partial<Permissions>
      permissions: Partial<Permissions>
      appState: AppState
      lastData: DataShape | null
      parent: ComponentData | null
    }
  ) => Promise<Partial<Permissions>> | Partial<Permissions>
  metadata?: ComponentMetadata
} & ComponentConfigExtensions

export type ComponentConfig<
  RenderPropsOrParams extends LeftOrExactRight<RenderPropsOrParams, DefaultComponentProps, ComponentConfigParams> = DefaultComponentProps,
  FieldProps extends DefaultComponentProps = RenderPropsOrParams extends { props: any } ? RenderPropsOrParams['props'] : RenderPropsOrParams,
  DataShape = Omit<ComponentData<FieldProps>, 'type'>
> = RenderPropsOrParams extends ComponentConfigParams<infer ParamsRenderProps, never>
  ? ComponentConfigInternal<ParamsRenderProps, FieldProps, DataShape, {}>
  : RenderPropsOrParams extends ComponentConfigParams<infer ParamsRenderProps, infer ParamsFields>
    ? ComponentConfigInternal<ParamsRenderProps, FieldProps, DataShape, ParamsFields[keyof ParamsFields] & BaseField>
    : ComponentConfigInternal<RenderPropsOrParams, FieldProps, DataShape>

type RootConfigInternal<
  RootProps extends DefaultComponentProps = DefaultComponentProps,
  UserField extends BaseField = BaseField
> = Partial<
  ComponentConfigInternal<
    WithChildren<RootProps>,
    AsFieldProps<RootProps>,
    RootData<AsFieldProps<RootProps>>,
    UserField
  >
>

export type RootConfig<
  RootPropsOrParams extends LeftOrExactRight<RootPropsOrParams, DefaultComponentProps, ComponentConfigParams> = DefaultComponentProps
> = RootPropsOrParams extends ComponentConfigParams<infer Props, never>
  ? Partial<RootConfigInternal<WithChildren<Props>, {}>>
  : RootPropsOrParams extends ComponentConfigParams<infer Props, infer UserFields>
    ? Partial<RootConfigInternal<WithChildren<Props>, UserFields[keyof UserFields] & BaseField>>
    : Partial<RootConfigInternal<WithChildren<RootPropsOrParams>>>

type Category<ComponentName> = {
  components?: ComponentName[]
  title?: string
  visible?: boolean
  defaultExpanded?: boolean
}

export type ConfigInternal<
  Props extends DefaultComponents = DefaultComponents,
  RootProps extends DefaultComponentProps = DefaultComponentProps,
  CategoryName extends string = string,
  UserField extends object = object
> = {
  categories?: Record<CategoryName, Category<keyof Props>> & { other?: Category<keyof Props> }
  components: {
    [ComponentName in keyof Props]: Omit<
      ComponentConfigInternal<
        Props[ComponentName],
        Props[ComponentName],
        Omit<ComponentData<Props[ComponentName]>, 'type'>,
        UserField
      >,
      'type'
    >
  }
  root?: RootConfigInternal<RootProps, UserField>
}

export type DefaultComponents = Record<string, any>

export type Config<
  PropsOrParams extends LeftOrExactRight<PropsOrParams, DefaultComponents, ConfigParams> = DefaultComponents,
  RootProps extends DefaultComponentProps = any,
  CategoryName extends string = string
> = PropsOrParams extends ConfigParams<infer ParamComponents, infer ParamRoot, infer ParamCategoryName, never>
  ? ConfigInternal<ParamComponents, ParamRoot, ParamCategoryName[number]>
  : PropsOrParams extends ConfigParams<infer ParamComponents, infer ParamRoot, infer ParamCategoryName, infer ParamFields>
    ? ConfigInternal<ParamComponents, ParamRoot, ParamCategoryName[number], ParamFields[keyof ParamFields] & BaseField>
    : PropsOrParams extends ConfigParams<infer ParamComponents, infer ParamRoot, infer ParamCategoryName, any>
      ? ConfigInternal<ParamComponents, ParamRoot, ParamCategoryName[number], {}>
      : ConfigInternal<PropsOrParams, RootProps, CategoryName>

export type ExtractConfigParams<UserConfig extends ConfigInternal> =
  UserConfig extends ConfigInternal<infer PropsOrParams, infer RootProps, infer CategoryName, infer UserField>
    ? {
        props: PropsOrParams
        rootProps: RootProps & DefaultRootFieldProps
        categoryNames: CategoryName
        field: UserField extends { type: string } ? UserField : Field
      }
    : never
