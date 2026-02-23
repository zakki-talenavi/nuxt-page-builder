import { h, defineComponent, markRaw, isVNode } from 'vue'
import { spacingOptions, sizeOptions, sizeMap, headingSizeMap } from './constants'

const HeadingBlock = defineComponent({
  name: 'HeadingBlock',
  props: {
    text: { type: String, default: 'Heading' },
    size: { type: String, default: 'm' },
    level: { type: String, default: '' },
    align: { type: String, default: 'left' },
    layout: {
      type: Object as () => { padding?: string; verticalPadding?: string },
      default: () => ({ padding: '8px' }),
    },
  },
  setup(props) {
    return () => {
      const tag = props.level ? `h${props.level}` : 'span'
      const fontSize = headingSizeMap[props.size] || '1.5rem'
      const padding = props.layout?.padding ?? props.layout?.verticalPadding ?? '8px'
      return h(tag, {
        style: {
          display: 'block', paddingTop: padding, paddingBottom: padding, margin: '0', color: '#1f2937',
          fontSize, fontWeight: '700', textAlign: props.align, lineHeight: '1.2',
        },
      }, props.text)
    }
  },
})

const TextBlock = defineComponent({
  name: 'TextBlock',
  props: {
    text: { type: String, default: 'Text' },
    size: { type: String, default: 'm' },
    align: { type: String, default: 'left' },
    color: { type: String, default: 'default' },
    maxWidth: { type: String, default: '' },
    layout: {
      type: Object as () => { padding?: string; verticalPadding?: string },
      default: () => ({ padding: '0px' }),
    },
  },
  setup(props) {
    return () => {
      const padding = props.layout?.padding ?? props.layout?.verticalPadding ?? '0px'
      return h('p', {
        style: {
          paddingTop: padding, paddingBottom: padding, margin: '0', textAlign: props.align,
          fontSize: sizeMap[props.size] || '1rem', lineHeight: '1.7',
          color: props.color === 'muted' ? '#6b7280' : '#374151',
          maxWidth: props.maxWidth || 'none',
        },
      }, props.text)
    }
  },
})

const RichTextBlock = defineComponent({
  name: 'RichTextBlock',
  props: {
    richtext: { type: String, default: '<h2>Heading</h2><p>Body</p>' },
    layout: {
      type: Object as () => { padding?: string; verticalPadding?: string },
      default: () => ({ padding: '0px' }),
    },
  },
  setup(props) {
    return () => {
      const padding = props.layout?.padding ?? props.layout?.verticalPadding ?? '0px'
      return isVNode(props.richtext)
        ? h('div', { style: { paddingTop: padding, paddingBottom: padding, color: '#374151', lineHeight: '1.7' } }, [props.richtext])
        : h('div', {
            style: { paddingTop: padding, paddingBottom: padding, color: '#374151', lineHeight: '1.7' },
            innerHTML: props.richtext,
          })
    }
  },
})

export const typographyComponents = {
  Heading: {
    label: 'Heading',
    defaultProps: { text: 'Heading', size: 'm', level: '', align: 'left', layout: { padding: '8px' } },
    fields: {
      text: { type: 'textarea', label: 'Text', contentEditable: true },
      size: { type: 'select', label: 'Size', options: sizeOptions },
      level: {
        type: 'select', label: 'Semantic Level',
        options: [
          { label: 'None', value: '' },
          { label: '1', value: '1' }, { label: '2', value: '2' },
          { label: '3', value: '3' }, { label: '4', value: '4' },
          { label: '5', value: '5' }, { label: '6', value: '6' },
        ],
      },
      align: {
        type: 'radio', label: 'Alignment',
        options: [{ label: 'Left', value: 'left' }, { label: 'Center', value: 'center' }, { label: 'Right', value: 'right' }],
      },
      layout: {
        type: 'object',
        label: 'Layout',
        objectFields: {
          padding: { type: 'select', label: 'Vertical Padding', options: spacingOptions },
        },
      },
    },
    render: markRaw(HeadingBlock),
  },
  Text: {
    label: 'Text',
    defaultProps: { text: 'Text', size: 'm', align: 'left', color: 'default', maxWidth: '', layout: { padding: '0px' } },
    fields: {
      text: { type: 'textarea', label: 'Text', contentEditable: true },
      size: {
        type: 'select', label: 'Size',
        options: [{ label: 'S', value: 's' }, { label: 'M', value: 'm' }],
      },
      align: {
        type: 'radio', label: 'Alignment',
        options: [{ label: 'Left', value: 'left' }, { label: 'Center', value: 'center' }, { label: 'Right', value: 'right' }],
      },
      color: {
        type: 'radio', label: 'Color',
        options: [{ label: 'Default', value: 'default' }, { label: 'Muted', value: 'muted' }],
      },
      maxWidth: { type: 'text', label: 'Max Width' },
      layout: {
        type: 'object',
        label: 'Layout',
        objectFields: {
          padding: { type: 'select', label: 'Vertical Padding', options: spacingOptions },
        },
      },
    },
    render: markRaw(TextBlock),
  },
  RichText: {
    label: 'Rich Text',
    defaultProps: { richtext: '<h2>Heading</h2><p>Body</p>', layout: { padding: '0px' } },
    fields: {
      richtext: { type: 'richtext', label: 'Content', contentEditable: true },
      layout: {
        type: 'object',
        label: 'Layout',
        objectFields: {
          padding: { type: 'select', label: 'Vertical Padding', options: spacingOptions },
        },
      },
    },
    render: markRaw(RichTextBlock),
  },
} as const
