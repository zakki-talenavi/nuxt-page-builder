import type { Plugin } from '~~/types/puck'

/**
 * Example plugin: adds optional overrides (mirrors puck-main heading-analyzer idea).
 * Register via <Puck :plugins="[headingAnalyzerPlugin]" ... />
 */
export const headingAnalyzerPlugin: Plugin = {
  name: 'heading-analyzer',
  label: 'Heading outline',
  overrides: {
    // Can add e.g. outline panel overrides here when implemented
  },
}
