import { h, defineComponent, markRaw } from 'vue'
import { spacingOptions, gridAlignOptions, gridContentOptions, flexJustifyOptions, flexAlignOptions, flexAlignContentOptions } from './constants'

const GridBlock = defineComponent({
  name: 'GridBlock',
  props: {
    numColumns: { type: Number, default: 4 },
    gap: { type: Number, default: 24 },
    layout: {
      type: Object as () => { verticalPadding?: string },
      default: () => ({ verticalPadding: '0px' }),
    },
    justifyItems: { type: String, default: 'stretch' },
    alignItems: { type: String, default: 'stretch' },
    justifyContent: { type: String, default: 'start' },
    alignContent: { type: String, default: 'start' },
  },
  setup(props, { slots }) {
    return () => {
      const cols = Math.min(12, Math.max(1, Number(props.numColumns) || 4))
      const verticalPadding = props.layout?.verticalPadding ?? '0px'
      return h('div', {
        style: {
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: `${props.gap}px`,
          justifyItems: props.justifyItems || 'stretch',
          alignItems: props.alignItems || 'stretch',
          justifyContent: props.justifyContent || 'start',
          alignContent: props.alignContent || 'start',
          paddingTop: verticalPadding,
          paddingBottom: verticalPadding,
          minHeight: '60px',
        },
      }, slots.default?.() || [])
    }
  },
})

const ColumnsBlock = defineComponent({
  name: 'ColumnsBlock',
  props: {
    columns: { type: String, default: '2' },
    gap: { type: [String, Number], default: '16' },
  },
  setup(props, { slots }) {
    return () => {
      const cols = parseInt(String(props.columns)) || 2
      const g = parseInt(String(props.gap)) || 16
      return h('div', {
        style: {
          display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: `${g}px`, padding: '8px 0', minHeight: '60px',
        },
      }, slots.default?.() || [])
    }
  },
})

const FlexBlock = defineComponent({
  name: 'FlexBlock',
  props: {
    direction: { type: String, default: 'row' },
    justifyContent: { type: String, default: 'flex-start' },
    alignItems: { type: String, default: 'stretch' },
    alignContent: { type: String, default: 'stretch' },
    gap: { type: Number, default: 24 },
    wrap: { type: String, default: 'wrap' },
    layout: {
      type: Object as () => { verticalPadding?: string },
      default: () => ({ verticalPadding: '0px' }),
    },
  },
  setup(props, { slots }) {
    return () => {
      const verticalPadding = props.layout?.verticalPadding ?? '0px'
      return h('div', {
        style: {
          display: 'flex',
          flexDirection: props.direction,
          justifyContent: props.justifyContent === 'start' ? 'flex-start' : props.justifyContent === 'end' ? 'flex-end' : (props.justifyContent || 'flex-start'),
          alignItems: props.alignItems || 'stretch',
          alignContent: props.alignContent || 'stretch',
          gap: `${props.gap}px`,
          flexWrap: props.wrap,
          paddingTop: verticalPadding,
          paddingBottom: verticalPadding,
          minHeight: '60px',
        },
      }, slots.default?.() || [])
    }
  },
})

const ContainerBlock = defineComponent({
  name: 'ContainerBlock',
  props: {
    maxWidth: { type: String, default: '1200px' },
    padding: { type: String, default: '0 24px' },
  },
  setup(props, { slots }) {
    return () =>
      h('div', {
        style: {
          maxWidth: props.maxWidth,
          margin: '0 auto',
          padding: props.padding,
          minHeight: '60px',
        },
      }, slots.default?.() || [])
  },
})

const SpaceBlock = defineComponent({
  name: 'SpaceBlock',
  props: {
    size: { type: String, default: '24px' },
    direction: { type: String, default: '' },
  },
  setup(props) {
    return () => {
      const px = parseInt(props.size) || 24
      const isH = props.direction === 'horizontal'
      const isV = props.direction === 'vertical' || props.direction === ''
      return h('div', {
        style: {
          height: isV ? `${px}px` : '0',
          width: isH ? `${px}px` : '100%',
          background: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(99,102,241,0.05) 5px, rgba(99,102,241,0.05) 10px)',
          borderRadius: '4px',
          display: isH ? 'inline-block' : 'block',
        },
      })
    }
  },
})

export const layoutComponents = {
  Grid: {
    label: 'Grid',
    defaultProps: {
      numColumns: 4,
      gap: 24,
      layout: { verticalPadding: '0px' },
      justifyItems: 'stretch',
      alignItems: 'stretch',
      justifyContent: 'start',
      alignContent: 'start',
    },
    fields: {
      numColumns: { type: 'number', label: 'Number of columns', min: 1, max: 12 },
      gap: { type: 'number', label: 'Gap', min: 0 },
      justifyItems: { type: 'select', label: 'Justify items', options: gridAlignOptions },
      alignItems: { type: 'select', label: 'Align items', options: gridAlignOptions },
      justifyContent: { type: 'select', label: 'Justify content', options: gridContentOptions },
      alignContent: { type: 'select', label: 'Align content', options: gridContentOptions },
      layout: {
        type: 'object',
        label: 'Layout',
        objectFields: {
          verticalPadding: { type: 'select', label: 'Vertical Padding', options: spacingOptions },
        },
      },
    },
    render: markRaw(GridBlock),
  },
  Flex: {
    label: 'Flex',
    defaultProps: {
      direction: 'row',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      alignContent: 'stretch',
      gap: 24,
      wrap: 'wrap',
      layout: { verticalPadding: '0px' },
    },
    fields: {
      direction: {
        type: 'radio',
        label: 'Direction',
        options: [{ label: 'Row', value: 'row' }, { label: 'Column', value: 'column' }],
      },
      justifyContent: { type: 'select', label: 'Justify content', options: flexJustifyOptions },
      alignItems: { type: 'select', label: 'Align items', options: flexAlignOptions },
      alignContent: { type: 'select', label: 'Align content (wrap only)', options: flexAlignContentOptions },
      gap: { type: 'number', label: 'Gap', min: 0 },
      wrap: {
        type: 'radio',
        label: 'Wrap',
        options: [{ label: 'true', value: 'wrap' }, { label: 'false', value: 'nowrap' }],
      },
      layout: {
        type: 'object',
        label: 'Layout',
        objectFields: {
          verticalPadding: { type: 'select', label: 'Vertical Padding', options: spacingOptions },
        },
      },
    },
    render: markRaw(FlexBlock),
  },
  Container: {
    label: 'Container',
    defaultProps: { maxWidth: '1200px', padding: '0 24px' },
    fields: {
      maxWidth: { type: 'text', label: 'Max width' },
      padding: { type: 'text', label: 'Padding' },
    },
    render: markRaw(ContainerBlock),
  },
  Columns: {
    label: 'Columns',
    defaultProps: { columns: '2', gap: '16' },
    fields: {
      columns: {
        type: 'select', label: 'Columns',
        options: [
          { label: '1', value: '1' }, { label: '2', value: '2' }, { label: '3', value: '3' },
          { label: '4', value: '4' }, { label: '5', value: '5' }, { label: '6', value: '6' },
          { label: '7', value: '7' }, { label: '8', value: '8' }, { label: '9', value: '9' },
          { label: '10', value: '10' }, { label: '11', value: '11' }, { label: '12', value: '12' },
        ],
      },
      gap: { type: 'number', label: 'Gap (px)' },
    },
    render: markRaw(ColumnsBlock),
  },
  Space: {
    label: 'Space',
    defaultProps: { direction: '', size: '24px' },
    fields: {
      size: { type: 'select', label: 'Size', options: spacingOptions },
      direction: {
        type: 'radio', label: 'Direction',
        options: [
          { label: 'Vertical', value: 'vertical' },
          { label: 'Horizontal', value: 'horizontal' },
          { label: 'Both', value: '' },
        ],
      },
    },
    render: markRaw(SpaceBlock),
  },
} as const
