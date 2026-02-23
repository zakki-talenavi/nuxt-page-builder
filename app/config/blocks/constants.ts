/**
 * Shared option arrays and maps for block configs.
 * Single module so they're created once (performance) and reused across blocks.
 */
export const spacingOptions = [
  { label: '0px', value: '0px' },
  { label: '4px', value: '4px' },
  { label: '8px', value: '8px' },
  { label: '16px', value: '16px' },
  { label: '24px', value: '24px' },
  { label: '32px', value: '32px' },
  { label: '40px', value: '40px' },
  { label: '48px', value: '48px' },
  { label: '56px', value: '56px' },
  { label: '64px', value: '64px' },
  { label: '72px', value: '72px' },
  { label: '80px', value: '80px' },
  { label: '88px', value: '88px' },
  { label: '96px', value: '96px' },
  { label: '104px', value: '104px' },
  { label: '112px', value: '112px' },
  { label: '120px', value: '120px' },
  { label: '128px', value: '128px' },
  { label: '136px', value: '136px' },
  { label: '144px', value: '144px' },
  { label: '152px', value: '152px' },
  { label: '160px', value: '160px' },
] as const

export const sizeOptions = [
  { label: 'XXXL', value: 'xxxl' },
  { label: 'XXL', value: 'xxl' },
  { label: 'XL', value: 'xl' },
  { label: 'L', value: 'l' },
  { label: 'M', value: 'm' },
  { label: 'S', value: 's' },
  { label: 'XS', value: 'xs' },
] as const

export const sizeMap: Record<string, string> = {
  xs: '0.75rem', s: '0.875rem', m: '1rem', l: '1.25rem',
  xl: '1.5rem', xxl: '2rem', xxxl: '2.5rem',
}

export const headingSizeMap: Record<string, string> = {
  xs: '1rem', s: '1.25rem', m: '1.5rem', l: '2rem',
  xl: '2.5rem', xxl: '3rem', xxxl: '4rem',
}

export const gridAlignOptions = [
  { label: 'Start', value: 'start' },
  { label: 'Center', value: 'center' },
  { label: 'End', value: 'end' },
  { label: 'Stretch', value: 'stretch' },
]

export const gridContentOptions = [
  ...gridAlignOptions,
  { label: 'Space between', value: 'space-between' },
  { label: 'Space around', value: 'space-around' },
  { label: 'Space evenly', value: 'space-evenly' },
]

export const flexJustifyOptions = [
  { label: 'Flex start', value: 'flex-start' },
  { label: 'Center', value: 'center' },
  { label: 'Flex end', value: 'flex-end' },
  { label: 'Space between', value: 'space-between' },
  { label: 'Space around', value: 'space-around' },
  { label: 'Space evenly', value: 'space-evenly' },
]

export const flexAlignOptions = [
  { label: 'Stretch', value: 'stretch' },
  { label: 'Center', value: 'center' },
  { label: 'Flex start', value: 'flex-start' },
  { label: 'Flex end', value: 'flex-end' },
]

export const flexAlignContentOptions = [
  ...flexAlignOptions,
  { label: 'Space between', value: 'space-between' },
  { label: 'Space around', value: 'space-around' },
  { label: 'Space evenly', value: 'space-evenly' },
]
