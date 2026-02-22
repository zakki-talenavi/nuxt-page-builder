import type {
  ComponentData,
  Config,
  Content,
  Field,
  Fields,
  RootData,
} from '~~/types/puck'
import { defaultSlots } from './default-slots'

export type MapFnParams<ThisField = Field> = {
  value: any
  parentId: string
  propName: string
  field: ThisField
  propPath: string
}

type MapFn<T = any> = (params: MapFnParams) => T

export type Mappers<T = MapFn<any>> = Partial<Record<Field['type'], T>>

type PromiseMapFn = MapFn<Promise<any>>

type WalkFieldOpts = {
  value: unknown
  fields: Fields
  mappers: Mappers
  propKey?: string
  propPath?: string
  id?: string
  config: Config
  recurseSlots?: boolean
}

type WalkObjectOpts = {
  value: Record<string, any>
  fields: Fields
  mappers: Mappers
  id: string
  getPropPath: (str: string) => string
  config: Config
  recurseSlots?: boolean
}

const isPromise = <T = unknown>(v: any): v is Promise<T> =>
  !!v && typeof v.then === 'function'

const flatten = (values: Record<string, any>[]) =>
  values.reduce((acc, item) => ({ ...acc, ...item }), {})

const containsPromise = (arr: any[]) => arr.some(isPromise)

export const walkField = ({
  value,
  fields,
  mappers,
  propKey = '',
  propPath = '',
  id = '',
  config,
  recurseSlots = false,
}: WalkFieldOpts): any => {
  const fieldType = (fields as any)[propKey as keyof typeof fields]?.type
  const map = mappers[fieldType as keyof Mappers]

  if (map && fieldType === 'slot') {
    const content = (value as Content) || []
    const mappedContent = recurseSlots
      ? content.map((el: any) => {
        const componentConfig = config.components[el.type]
        if (!componentConfig) throw new Error(`Could not find component config for ${el.type}`)
        const slotFields = componentConfig.fields ?? {}
        return walkField({
          value: { ...el, props: defaultSlots(el.props, slotFields) },
          fields: slotFields,
          mappers,
          id: el.props.id,
          config,
          recurseSlots,
        })
      })
      : content

    if (containsPromise(mappedContent)) return Promise.all(mappedContent)
    return map({
      value: mappedContent,
      parentId: id,
      propName: propPath,
      field: (fields as any)[propKey],
      propPath,
    })
  }

  if (map && (fields as any)[propKey]) {
    return map({
      value,
      parentId: id,
      propName: propKey,
      field: (fields as any)[propKey],
      propPath,
    })
  }

  if (value && typeof value === 'object') {
    if (Array.isArray(value)) {
      const arrayFields = (fields as any)[propKey]?.type === 'array' ? (fields as any)[propKey].arrayFields : null
      if (!arrayFields) return value
      const newValue = value.map((el, idx) =>
        walkField({
          value: el,
          fields: arrayFields,
          mappers,
          propKey,
          propPath: `${propPath}[${idx}]`,
          id,
          config,
          recurseSlots,
        })
      )
      if (containsPromise(newValue)) return Promise.all(newValue)
      return newValue
    }
    const objectFields =
      (fields as any)[propKey]?.type === 'object' ? (fields as any)[propKey].objectFields : fields
    return walkObject({
      value,
      fields: objectFields,
      mappers,
      id,
      getPropPath: (k) => `${propPath}.${k}`,
      config,
      recurseSlots,
    })
  }

  return value
}

const walkObject = ({
  value,
  fields,
  mappers,
  id,
  getPropPath,
  config,
  recurseSlots,
}: WalkObjectOpts): Record<string, any> | Promise<Record<string, any>> => {
  const newProps = Object.entries(value).map(([k, v]) => {
    const newValue = walkField({
      value: v,
      fields,
      mappers,
      propKey: k,
      propPath: getPropPath(k),
      id,
      config,
      recurseSlots,
    })
    if (isPromise(newValue)) {
      return newValue.then((resolvedValue: any) => ({ [k]: resolvedValue }))
    }
    return { [k]: newValue }
  })

  if (containsPromise(newProps)) {
    return Promise.all(newProps).then(flatten)
  }
  return flatten(newProps)
}

export function mapFields(
  item: any,
  mappers: Mappers,
  config: Config,
  recurseSlots = false,
  shouldDefaultSlots = true
): any {
  const itemType = 'type' in item ? item.type : 'root'
  const componentConfig = itemType === 'root' ? config.root : config.components?.[itemType]
  const newProps = walkObject({
    value: shouldDefaultSlots
      ? defaultSlots(item.props ?? {}, componentConfig?.fields ?? {})
      : item.props,
    fields: componentConfig?.fields ?? {},
    mappers,
    id: item.props?.id ?? 'root',
    getPropPath: (k) => k,
    config,
    recurseSlots,
  })

  if (isPromise(newProps)) {
    return newProps.then((resolvedProps: any) => ({ ...item, props: resolvedProps }))
  }
  return { ...item, props: newProps }
}
