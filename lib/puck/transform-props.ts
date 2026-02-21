import { walkTree } from './data/walk-tree'
import type {
  Config,
  Data,
  DefaultComponentProps,
  DefaultComponents,
  DefaultRootFieldProps,
} from '~/types/puck'
import { defaultData } from './data/default-data'

type PropTransform<
  Components extends DefaultComponents = DefaultComponents,
  RootProps extends DefaultComponentProps = DefaultRootFieldProps
> = Partial<{
  [K in keyof Components]: (props: Components[K] & Record<string, any>) => Components[K]
} & { root: (props: RootProps & Record<string, any>) => RootProps }>

export function transformProps<
  Components extends DefaultComponents = DefaultComponents,
  RootProps extends DefaultComponentProps = DefaultRootFieldProps
>(
  data: Partial<Data>,
  propTransforms: PropTransform<Components, RootProps>,
  config: Config = { components: {} }
): Data {
  const mapItem = (item: any) => {
    if (propTransforms[item.type]) {
      return {
        ...item,
        props: {
          id: item.props.id,
          ...(propTransforms as any)[item.type](item.props),
        },
      }
    }
    return item
  }

  const defaultedData = defaultData(data)
  const rootProps = defaultedData.root.props || defaultedData.root
  let newRoot = { ...defaultedData.root }
  if (propTransforms.root) {
    newRoot.props = propTransforms.root(rootProps as any)
  }

  const dataWithUpdatedRoot = { ...defaultedData, root: newRoot }
  const updatedData = walkTree(dataWithUpdatedRoot, config, (content) =>
    content.map(mapItem)
  )

  if (!defaultedData.root.props) {
    ;(updatedData as any).root = (updatedData as any).root.props
  }

  return updatedData as Data
}
