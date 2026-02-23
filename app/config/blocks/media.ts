import { h, defineComponent, markRaw } from 'vue'
import { spacingOptions } from './constants'

const ImageBlock = defineComponent({
  name: 'ImageBlock',
  props: {
    url: { type: String, default: 'https://placehold.co/800x400/e2e8f0/94a3b8?text=Image' },
    alt: { type: String, default: 'Image' },
  },
  setup(props) {
    return () =>
      h('div', { style: { padding: '8px 0' } }, [
        h('img', {
          src: props.url, alt: props.alt,
          style: { width: '100%', borderRadius: '8px', display: 'block' },
        }),
      ])
  },
})

const DividerBlock = defineComponent({
  name: 'DividerBlock',
  props: {
    color: { type: String, default: '#e5e7eb' },
    thickness: { type: String, default: '1' },
    margin: { type: String, default: '24px' },
  },
  setup(props) {
    return () =>
      h('hr', {
        style: {
          border: 'none', borderTop: `${props.thickness}px solid ${props.color}`,
          margin: `${props.margin} 0`,
        },
      })
  },
})

const BlankBlock = defineComponent({
  name: 'BlankBlock',
  setup() {
    return () =>
      h('div', {
        style: {
          minHeight: '60px', border: '2px dashed #e5e7eb', borderRadius: '8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#9ca3af', fontSize: '13px',
        },
      }, 'Empty block')
  },
})

export const mediaComponents = {
  Image: {
    label: 'Image',
    defaultProps: { url: 'https://placehold.co/800x400/e2e8f0/94a3b8?text=Image', alt: 'Image' },
    fields: {
      url: { type: 'text', label: 'Image URL' },
      alt: { type: 'text', label: 'Alt Text' },
    },
    render: markRaw(ImageBlock),
  },
  Divider: {
    label: 'Divider',
    defaultProps: { color: '#e5e7eb', thickness: '1', margin: '24px' },
    fields: {
      color: { type: 'text', label: 'Color' },
      thickness: {
        type: 'select', label: 'Thickness',
        options: [{ label: '1px', value: '1' }, { label: '2px', value: '2' }, { label: '3px', value: '3' }],
      },
      margin: { type: 'select', label: 'Margin', options: spacingOptions },
    },
    render: markRaw(DividerBlock),
  },
  Blank: {
    label: 'Blank',
    defaultProps: {},
    fields: {},
    render: markRaw(BlankBlock),
  },
} as const
