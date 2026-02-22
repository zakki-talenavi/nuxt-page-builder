/**
 * Initial data per path when no saved data in localStorage (mirrors puck-main).
 * Key: path string (e.g. '/', '/about'). Use empty or default for '/'.
 */
import type { Data } from '~~/types/puck'

export const initialData: Record<string, Partial<Data>> = {
  '/': {
    root: { props: { title: 'My Page' } },
    content: [],
  },
  // Add more paths as needed, e.g. '/about': { root: { props: { title: 'About' } }, content: [] },
}

export function getInitialDataForPath(path: string): Partial<Data> {
  const normalized = path || '/'
  return initialData[normalized] ?? { root: { props: { title: 'My Page' } }, content: [] }
}
