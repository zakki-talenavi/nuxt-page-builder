import type { Config, UiState } from '@@/types/puck'

export type ComponentListItem = {
  key: string
  label: string
}

export type ComponentGroup = {
  title?: string
  components: ComponentListItem[]
  visible: boolean
  expanded: boolean
}

export function useComponentList(config: Config, uiComponentList?: UiState['componentList']) {
  const allComponents = computed<ComponentListItem[]>(() =>
    Object.entries(config.components || {}).map(([key, cfg]) => ({
      key,
      label: (cfg as any)?.label || key,
    }))
  )

  const groups = computed<ComponentGroup[]>(() => {
    if (!uiComponentList || Object.keys(uiComponentList).length === 0) {
      return [{ components: allComponents.value, visible: true, expanded: true }]
    }

    return Object.entries(uiComponentList).map(([title, group]) => ({
      title,
      components: (group.components ?? [])
        .map((key) => allComponents.value.find((c) => c.key === key))
        .filter(Boolean) as ComponentListItem[],
      visible: group.visible ?? true,
      expanded: group.expanded ?? true,
    }))
  })

  return { allComponents, groups }
}
