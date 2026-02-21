import type { ComponentData, RootData } from '~/types/puck'

export const toRoot = (item: ComponentData | RootData): RootData => {
  if ('type' in item && item.type !== 'root') {
    throw new Error('Converting non-root item to root.')
  }
  const { readOnly } = item
  if (item.props) {
    if ('id' in item.props) {
      const { id, ...props } = item.props as { id: string; [k: string]: any }
      return { props, readOnly }
    }
    return { props: item.props, readOnly }
  }
  return { props: {}, readOnly }
}
