/** Default series colors (engine-agnostic). */
export const DEFAULT_CHART_COLORS = [
  'rgba(99, 102, 241, 0.8)',
  'rgba(34, 197, 94, 0.8)',
  'rgba(234, 179, 8, 0.8)',
  'rgba(239, 68, 68, 0.8)',
  'rgba(168, 85, 247, 0.8)',
  'rgba(6, 182, 212, 0.8)',
]

export function getColorAt(index: number, override?: string): string {
  return override || DEFAULT_CHART_COLORS[index % DEFAULT_CHART_COLORS.length]
}
