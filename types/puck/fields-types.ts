import type { DefaultComponentProps } from './props'
import type { UiState } from './app-state'

export type FieldOption = {
  label: string
  value: string | number | boolean | undefined | null | object
}

export type FieldOptions = Array<FieldOption> | ReadonlyArray<FieldOption>

export interface BaseField {
  label?: string
  labelIcon?: unknown
  metadata?: Record<string, any>
  visible?: boolean
}

export interface TextField extends BaseField {
  type: 'text'
  placeholder?: string
  contentEditable?: boolean
}

export interface NumberField extends BaseField {
  type: 'number'
  placeholder?: string
  min?: number
  max?: number
  step?: number
}

export interface TextareaField extends BaseField {
  type: 'textarea'
  placeholder?: string
  contentEditable?: boolean
}

export interface SelectField extends BaseField {
  type: 'select'
  options: FieldOptions
}

export interface RadioField extends BaseField {
  type: 'radio'
  options: FieldOptions
}

export interface RichtextField extends BaseField {
  type: 'richtext'
  contentEditable?: boolean
  initialHeight?: string | number
  options?: Record<string, any>
  renderMenu?: (props: { children: unknown; editor: any; editorState: any; readOnly: boolean }) => unknown
  renderInlineMenu?: (props: { children: unknown; editor: any; editorState: any; readOnly: boolean }) => unknown
  tiptap?: { selector?: any; extensions?: any[] }
}

export interface ArrayField<
  Props extends Record<string, any>[] = Record<string, any>[],
  UserField extends object = object
> extends BaseField {
  type: 'array'
  arrayFields: {
    [SubPropName in keyof Props[0]]: UserField extends { type: PropertyKey }
      ? Field<Props[0][SubPropName], UserField> | UserField
      : Field<Props[0][SubPropName], UserField>
  }
  defaultItemProps?: Props[0] | ((index: number) => Props[0])
  getItemSummary?: (item: Props[0], index?: number) => unknown
  max?: number
  min?: number
}

export interface ObjectField<
  Props extends any = Record<string, any>,
  UserField extends object = object
> extends BaseField {
  type: 'object'
  objectFields: {
    [SubPropName in keyof Props]: UserField extends { type: PropertyKey }
      ? Field<Props[SubPropName]> | UserField
      : Field<Props[SubPropName]>
  }
}

export interface ExternalField<Props extends any = Record<string, any>> extends BaseField {
  type: 'external'
  cache?: { enabled?: boolean }
  placeholder?: string
  fetchList: (params: { query: string; filters: Record<string, any> }) => Promise<any[] | null>
  mapProp?: (value: any) => Props
  mapRow?: (value: any) => Record<string, string | number | unknown>
  getItemSummary?: (item: any, index?: number) => unknown
  showSearch?: boolean
  renderFooter?: (props: { items: any[] }) => unknown
  initialQuery?: string
  filterFields?: Record<string, Field>
  initialFilters?: Record<string, any>
}

export interface SelectField extends BaseField {
  type: 'select'
  options: FieldOptions
  placeholder?: string
}

export interface RadioField extends BaseField {
  type: 'radio'
  options: FieldOptions
}

export interface CustomField<Value = any> extends BaseField {
  type: 'custom'
  render: (props: {
    field: CustomField<Value>
    name: string
    id: string
    value: Value
    onChange: (value: Value) => void
    readOnly?: boolean
  }) => unknown
  contentEditable?: boolean
  key?: string
}

export interface SlotField extends BaseField {
  type: 'slot'
  allow?: string[]
  disallow?: string[]
}

export type Field<ValueType = any, UserField extends object = object> =
  | TextField
  | RichtextField
  | NumberField
  | TextareaField
  | SelectField
  | RadioField
  | ArrayField<ValueType extends Record<string, any>[] ? ValueType : never, UserField>
  | ObjectField<ValueType, UserField>
  | ExternalField<ValueType>
  | CustomField<ValueType>
  | SlotField

export type Fields<
  ComponentProps extends DefaultComponentProps = DefaultComponentProps,
  UserField extends object = object
> = {
  [PropName in keyof Omit<ComponentProps, 'editMode'>]: UserField extends { type: PropertyKey }
    ? Field<ComponentProps[PropName], UserField> | UserField
    : Field<ComponentProps[PropName]>
}

export type FieldProps<F = Field<any>, ValueType = any> = {
  field: F
  value: ValueType
  id?: string
  onChange: (value: ValueType, uiState?: Partial<UiState>) => void
  readOnly?: boolean
}
