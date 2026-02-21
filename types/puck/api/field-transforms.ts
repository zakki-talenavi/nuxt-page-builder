import type { Config } from '../config'
import type { Field } from '../fields'
import type { UserGenerics } from '../utils'

export type FieldTransformFnParams<T> = {
  value: any
  propName: string
  field: any
  propPath: string
  isReadOnly: boolean
  componentId: string
}

export type FieldTransformFn<T> = (params: FieldTransformFnParams<T>) => any

export type FieldTransforms<
  UserConfig extends Config = Config<{ fields: {} }>,
  G extends UserGenerics<UserConfig> = UserGenerics<UserConfig>,
  UserField extends { type: string } = Field | G['UserField']
> = Partial<{
  [Type in UserField['type']]: FieldTransformFn<Extract<UserField, { type: Type }>>
}>
