import type { Viewport } from './api/viewports'
import type { Data } from './data'

export type ItemSelector = { index: number; zone?: string }

export type ItemWithId = {
  _arrayId: string
  _originalIndex: number
  _currentIndex: number
}

export type ArrayState = { items: ItemWithId[]; openId: string }

export type UiState = {
  leftSideBarVisible: boolean
  rightSideBarVisible: boolean
  leftSideBarWidth?: number | null
  rightSideBarWidth?: number | null
  mobilePanelExpanded?: boolean
  itemSelector: ItemSelector | null
  arrayState: Record<string, ArrayState | undefined>
  previewMode: 'interactive' | 'edit'
  componentList: Record<
    string,
    {
      components?: string[]
      title?: string
      visible?: boolean
      expanded?: boolean
    }
  >
  isDragging: boolean
  viewports: {
    current: {
      width: number | '100%'
      height: number | 'auto'
    }
    controlsVisible: boolean
    options: Viewport[]
  }
  field: { focus?: string | null; metadata?: Record<string, any> }
  plugin: { current: string | null }
}

export type AppState<UserData extends Data = Data> = {
  data: UserData
  ui: UiState
}
