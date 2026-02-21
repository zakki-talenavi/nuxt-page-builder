import type { Field, FieldProps } from '../fields'
import type { ItemSelector } from '../app-state'
import type { Config } from '../config'
import type { ExtractField, UserGenerics } from '../utils'

export const overrideKeys = [
  'header',
  'headerActions',
  'fields',
  'fieldLabel',
  'drawer',
  'drawerItem',
  'componentOverlay',
  'outline',
  'puck',
  'preview',
] as const

export type OverrideKey = (typeof overrideKeys)[number]

type OverridesGeneric<Shape extends { [key in OverrideKey]: any }> = Shape

export type Overrides<UserConfig extends Config = Config> = OverridesGeneric<{
  fieldTypes: Partial<FieldRenderFunctions<UserConfig>>
  header: (props: { actions: unknown; children: unknown }) => unknown
  actionBar: (props: { label?: string; children: unknown; parentAction: unknown }) => unknown
  headerActions: (props: { children: unknown }) => unknown
  preview: (props?: any) => unknown
  fields: (props: { children: unknown; isLoading: boolean; itemSelector?: ItemSelector | null }) => unknown
  fieldLabel: (props: {
    children?: unknown
    icon?: unknown
    label: string
    el?: 'label' | 'div'
    readOnly?: boolean
    className?: string
  }) => unknown
  components: (props?: any) => unknown
  componentItem: (props: { children: unknown; name: string }) => unknown
  drawer: (props?: any) => unknown
  drawerItem: (props: { children: unknown; name: string }) => unknown
  iframe: (props: { children: unknown; document?: Document }) => unknown
  outline: (props?: any) => unknown
  componentOverlay: (props: {
    children: unknown
    hover: boolean
    isSelected: boolean
    componentId: string
    componentType: string
  }) => unknown
  puck: (props?: any) => unknown
}>

export type FieldRenderFunctions<
  UserConfig extends Config = Config,
  G extends UserGenerics<UserConfig> = UserGenerics<UserConfig>,
  UserField extends { type: string } = Field | G['UserField']
> = Omit<
  {
    [Type in UserField['type']]: (props: FieldProps<ExtractField<UserField, Type>, any> & { children: unknown; name: string }) => unknown
  },
  'custom'
>
