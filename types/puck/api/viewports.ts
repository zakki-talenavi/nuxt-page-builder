export type ViewportIconType = 'Smartphone' | 'Monitor' | 'Tablet'

export type Viewport = {
  width: number | '100%'
  height?: number | 'auto'
  label?: string
  icon?: ViewportIconType | unknown
}

export type Viewports = Viewport[]
