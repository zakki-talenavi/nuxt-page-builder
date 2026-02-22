import type { ComponentData, RootData } from '~~/types/puck'

export const toComponent = (item: ComponentData | RootData): ComponentData => {
  return 'type' in item
    ? (item as ComponentData)
    : {
        ...item,
        props: { ...(item as any).props, id: 'root' },
        type: 'root',
      }
}
