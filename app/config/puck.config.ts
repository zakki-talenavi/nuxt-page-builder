import { h, defineComponent } from 'vue'

const HeroBlock = defineComponent({
  name: 'HeroBlock',
  props: {
    title: { type: String, default: 'Welcome' },
    subtitle: { type: String, default: 'Edit this section' },
    align: { type: String, default: 'center' },
  },
  setup(props) {
    return () =>
      h(
        'section',
        {
          style: {
            padding: '48px 24px',
            textAlign: props.align,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            borderRadius: '4px',
          },
        },
        [
          h('h1', { style: { margin: '0 0 8px', fontSize: '2rem', fontWeight: '700' } }, props.title),
          h('p', { style: { margin: '0', fontSize: '1.1rem', opacity: '0.9' } }, props.subtitle),
        ]
      )
  },
})

const TextBlock = defineComponent({
  name: 'TextBlock',
  props: {
    text: { type: String, default: 'Hello world' },
  },
  setup(props) {
    return () =>
      h('div', { style: { padding: '16px 24px', color: '#374151', fontSize: '1rem', lineHeight: '1.7' } }, props.text)
  },
})

const HeadingBlock = defineComponent({
  name: 'HeadingBlock',
  props: {
    text: { type: String, default: 'Heading' },
    level: { type: String, default: 'h2' },
  },
  setup(props) {
    const tag = ['h1', 'h2', 'h3', 'h4'].includes(props.level) ? props.level : 'h2'
    const sizes: Record<string, string> = { h1: '2rem', h2: '1.5rem', h3: '1.25rem', h4: '1rem' }
    return () =>
      h(tag, { style: { padding: '16px 24px', margin: '0', color: '#1f2937', fontSize: sizes[tag] || '1.5rem' } }, props.text)
  },
})

const ButtonBlock = defineComponent({
  name: 'ButtonBlock',
  props: {
    label: { type: String, default: 'Click me' },
    href: { type: String, default: '#' },
    variant: { type: String, default: 'primary' },
  },
  setup(props) {
    const bg = props.variant === 'secondary' ? '#fff' : '#6366f1'
    const color = props.variant === 'secondary' ? '#6366f1' : '#fff'
    const border = props.variant === 'secondary' ? '2px solid #6366f1' : 'none'
    return () =>
      h('div', { style: { padding: '16px 24px' } }, [
        h(
          'a',
          {
            href: props.href,
            style: {
              display: 'inline-block',
              padding: '10px 24px',
              background: bg,
              color: color,
              border: border,
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
            },
          },
          props.label
        ),
      ])
  },
})

const ImageBlock = defineComponent({
  name: 'ImageBlock',
  props: {
    url: { type: String, default: 'https://placehold.co/800x400/e2e8f0/94a3b8?text=Image' },
    alt: { type: String, default: 'Image' },
  },
  setup(props) {
    return () =>
      h('div', { style: { padding: '16px 24px' } }, [
        h('img', {
          src: props.url,
          alt: props.alt,
          style: { width: '100%', borderRadius: '6px', display: 'block' },
        }),
      ])
  },
})

const SpacerBlock = defineComponent({
  name: 'SpacerBlock',
  props: {
    height: { type: String, default: '40' },
  },
  setup(props) {
    return () =>
      h('div', {
        style: {
          height: `${props.height}px`,
          background: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.03) 5px, rgba(0,0,0,0.03) 10px)',
          borderRadius: '4px',
          margin: '0 24px',
        },
      })
  },
})

const ColumnsBlock = defineComponent({
  name: 'ColumnsBlock',
  props: {
    columns: { type: String, default: '2' },
    gap: { type: String, default: '16' },
  },
  setup(props) {
    const cols = parseInt(props.columns) || 2
    return () =>
      h(
        'div',
        {
          style: {
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: `${props.gap}px`,
            padding: '16px 24px',
          },
        },
        Array.from({ length: cols }, (_, i) =>
          h('div', {
            key: i,
            style: {
              minHeight: '80px',
              background: '#f9fafb',
              border: '2px dashed #e5e7eb',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9ca3af',
              fontSize: '13px',
            },
          }, `Column ${i + 1}`)
        )
      )
  },
})

export const puckConfig = {
  components: {
    Hero: {
      label: 'Hero',
      defaultProps: {
        title: 'Welcome to Puck',
        subtitle: 'A visual editor for the web',
        align: 'center',
      },
      fields: {
        title: { type: 'text', label: 'Title' },
        subtitle: { type: 'text', label: 'Subtitle' },
        align: { type: 'text', label: 'Alignment (left/center/right)' },
      },
      render: HeroBlock,
    },
    Heading: {
      label: 'Heading',
      defaultProps: { text: 'Section Title', level: 'h2' },
      fields: {
        text: { type: 'text', label: 'Text' },
        level: { type: 'text', label: 'Level (h1/h2/h3/h4)' },
      },
      render: HeadingBlock,
    },
    Text: {
      label: 'Text',
      defaultProps: { text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
      fields: {
        text: { type: 'textarea', label: 'Content' },
      },
      render: TextBlock,
    },
    Button: {
      label: 'Button',
      defaultProps: { label: 'Get Started', href: '#', variant: 'primary' },
      fields: {
        label: { type: 'text', label: 'Label' },
        href: { type: 'text', label: 'URL' },
        variant: { type: 'text', label: 'Variant (primary/secondary)' },
      },
      render: ButtonBlock,
    },
    Image: {
      label: 'Image',
      defaultProps: { url: 'https://placehold.co/800x400/e2e8f0/94a3b8?text=Image', alt: 'Image' },
      fields: {
        url: { type: 'text', label: 'Image URL' },
        alt: { type: 'text', label: 'Alt Text' },
      },
      render: ImageBlock,
    },
    Columns: {
      label: 'Columns',
      defaultProps: { columns: '2', gap: '16' },
      fields: {
        columns: { type: 'text', label: 'Number of columns' },
        gap: { type: 'text', label: 'Gap (px)' },
      },
      render: ColumnsBlock,
    },
    Spacer: {
      label: 'Spacer',
      defaultProps: { height: '40' },
      fields: {
        height: { type: 'text', label: 'Height (px)' },
      },
      render: SpacerBlock,
    },
  },
  root: {
    label: 'Page',
    fields: {
      title: { type: 'text', label: 'Page Title' },
    },
  },
}
