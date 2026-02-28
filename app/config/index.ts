/**
 * Puck config: merged once at module load (single object reference for performance).
 * All block configs are in blocks/*.ts; we merge and export here so consumers
 * still get one stable puckConfig (no reactive overhead, no re-merge on access).
 */
import { layoutComponents } from './blocks/layout'
import { typographyComponents } from './blocks/typography'
import { navigationComponents } from './blocks/navigation'
import { actionsComponents } from './blocks/actions'
import { sectionsComponents } from './blocks/sections'
import { dataComponents } from './blocks/data'
import { chartComponents } from './blocks/chart'
import { mediaComponents } from './blocks/media'

/** Used for localStorage key (per-path data). Change when config shape changes. */
export const puckComponentKey = 'puck-nuxt-v1'

/** Categories for sidebar; component names must match keys in merged components. */
const categories = {
  layout: { title: 'Layout', components: ['Grid', 'Flex', 'Container', 'Columns', 'Space'] },
  typography: { title: 'Typography', components: ['Heading', 'Text', 'RichText'] },
  navigation: { title: 'Navigation', components: ['Breadcrumb'] },
  actions: { title: 'Actions', components: ['Button'] },
  sections: { title: 'Sections', components: ['Hero', 'Card', 'Stats', 'Logos'] },
  data: { title: 'Data', components: ['DataTable', 'Chart'] },
  media: { title: 'Media', components: ['Image', 'Divider', 'Blank'] },
}

/** Single merge at load: one object, stable reference, no reactive proxy. */
const components = Object.assign(
  {},
  layoutComponents,
  typographyComponents,
  navigationComponents,
  actionsComponents,
  sectionsComponents,
  dataComponents,
  chartComponents,
  mediaComponents,
)

const root = {
  label: 'Page',
  defaultProps: { title: 'My Page' },
  fields: {
    title: { type: 'text', label: 'Title' },
  },
}

export const puckConfig = {
  categories,
  components,
  root,
}
