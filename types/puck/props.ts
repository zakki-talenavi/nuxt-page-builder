import type { Metadata } from './data'

export type DropZoneProps = {
  zone: string
  allow?: string[]
  disallow?: string[]
  style?: Record<string, string | number>
  minEmptyHeight?: string | number
  className?: string
  collisionAxis?: 'dynamic' | 'y' | 'x'
  as?: string
}

export type PuckContext = {
  renderDropZone: (props: DropZoneProps) => unknown
  metadata: Metadata
  isEditing: boolean
  dragRef: ((element: Element | null) => void) | null
}

export type DefaultRootFieldProps = {
  title?: string
}

export type DefaultComponentProps = Record<string, any>
