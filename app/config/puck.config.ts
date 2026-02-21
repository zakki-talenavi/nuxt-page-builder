import { h, defineComponent } from 'vue'

const spacingOptions = [
  { label: '0px', value: '0px' },
  { label: '4px', value: '4px' },
  { label: '8px', value: '8px' },
  { label: '16px', value: '16px' },
  { label: '24px', value: '24px' },
  { label: '32px', value: '32px' },
  { label: '48px', value: '48px' },
  { label: '64px', value: '64px' },
]

const sizeOptions = [
  { label: 'XS', value: 'xs' },
  { label: 'S', value: 's' },
  { label: 'M', value: 'm' },
  { label: 'L', value: 'l' },
  { label: 'XL', value: 'xl' },
  { label: 'XXL', value: 'xxl' },
  { label: 'XXXL', value: 'xxxl' },
]

const sizeMap: Record<string, string> = {
  xs: '0.75rem', s: '0.875rem', m: '1rem', l: '1.25rem',
  xl: '1.5rem', xxl: '2rem', xxxl: '2.5rem',
}

const headingSizeMap: Record<string, string> = {
  xs: '1rem', s: '1.25rem', m: '1.5rem', l: '2rem',
  xl: '2.5rem', xxl: '3rem', xxxl: '4rem',
}

// ── Hero ──

const HeroBlock = defineComponent({
  name: 'HeroBlock',
  props: {
    title: { type: String, default: 'Hero' },
    description: { type: String, default: '<p>Description</p>' },
    align: { type: String, default: 'left' },
    padding: { type: String, default: '64px' },
    buttons: { type: Array, default: () => [{ label: 'Learn more', href: '#' }] },
  },
  setup(props) {
    return () =>
      h('section', {
        style: {
          padding: `${props.padding} 24px`,
          textAlign: props.align,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          borderRadius: '4px',
        },
      }, [
        h('h1', { style: { margin: '0 0 12px', fontSize: '2.5rem', fontWeight: '700' } }, props.title),
        h('div', { style: { margin: '0 0 24px', fontSize: '1.1rem', opacity: '0.9' }, innerHTML: props.description }),
        h('div', { style: { display: 'flex', gap: '12px', justifyContent: props.align === 'center' ? 'center' : 'flex-start' } },
          (props.buttons as any[]).map((btn: any, i: number) =>
            h('a', {
              key: i,
              href: btn.href || '#',
              style: {
                display: 'inline-block', padding: '12px 24px',
                background: btn.variant === 'secondary' ? 'transparent' : '#fff',
                color: btn.variant === 'secondary' ? '#fff' : '#6366f1',
                border: btn.variant === 'secondary' ? '2px solid rgba(255,255,255,0.5)' : 'none',
                borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '14px',
              },
            }, btn.label || 'Button')
          )
        ),
      ])
  },
})

// ── Heading ──

const HeadingBlock = defineComponent({
  name: 'HeadingBlock',
  props: {
    text: { type: String, default: 'Heading' },
    size: { type: String, default: 'm' },
    level: { type: String, default: '' },
    align: { type: String, default: 'left' },
    padding: { type: String, default: '8px' },
  },
  setup(props) {
    return () => {
      const tag = props.level ? `h${props.level}` : 'span'
      const fontSize = headingSizeMap[props.size] || '1.5rem'
      return h(tag, {
        style: {
          display: 'block', padding: props.padding, margin: '0', color: '#1f2937',
          fontSize, fontWeight: '700', textAlign: props.align, lineHeight: '1.2',
        },
      }, props.text)
    }
  },
})

// ── Text ──

const TextBlock = defineComponent({
  name: 'TextBlock',
  props: {
    text: { type: String, default: 'Text' },
    size: { type: String, default: 'm' },
    align: { type: String, default: 'left' },
    color: { type: String, default: 'default' },
    maxWidth: { type: String, default: '' },
    padding: { type: String, default: '8px' },
  },
  setup(props) {
    return () =>
      h('p', {
        style: {
          padding: props.padding, margin: '0', textAlign: props.align,
          fontSize: sizeMap[props.size] || '1rem', lineHeight: '1.7',
          color: props.color === 'muted' ? '#6b7280' : '#374151',
          maxWidth: props.maxWidth || 'none',
        },
      }, props.text)
  },
})

// ── RichText ──

const RichTextBlock = defineComponent({
  name: 'RichTextBlock',
  props: {
    richtext: { type: String, default: '<h2>Heading</h2><p>Body</p>' },
    padding: { type: String, default: '8px' },
  },
  setup(props) {
    return () =>
      h('div', {
        style: { padding: props.padding, color: '#374151', lineHeight: '1.7' },
        innerHTML: props.richtext,
      })
  },
})

// ── Button ──

const ButtonBlock = defineComponent({
  name: 'ButtonBlock',
  props: {
    label: { type: String, default: 'Button' },
    href: { type: String, default: '#' },
    variant: { type: String, default: 'primary' },
  },
  setup(props) {
    return () => {
      const isPrimary = props.variant !== 'secondary'
      return h('div', { style: { padding: '8px 0' } }, [
        h('a', {
          href: props.href,
          style: {
            display: 'inline-block', padding: '12px 24px',
            background: isPrimary ? '#6366f1' : '#fff',
            color: isPrimary ? '#fff' : '#6366f1',
            border: isPrimary ? 'none' : '2px solid #6366f1',
            borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '14px',
            cursor: 'pointer', transition: 'all 0.15s',
          },
        }, props.label),
      ])
    }
  },
})

// ── Card ──

const CardBlock = defineComponent({
  name: 'CardBlock',
  props: {
    title: { type: String, default: 'Title' },
    description: { type: String, default: 'Description' },
    icon: { type: String, default: '✦' },
    mode: { type: String, default: 'card' },
  },
  setup(props) {
    return () =>
      h('div', {
        style: {
          padding: '24px',
          background: props.mode === 'card' ? '#fff' : 'transparent',
          border: props.mode === 'card' ? '1px solid #e5e7eb' : 'none',
          borderRadius: props.mode === 'card' ? '12px' : '0',
          boxShadow: props.mode === 'card' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
        },
      }, [
        h('div', { style: { fontSize: '24px', marginBottom: '12px' } }, props.icon),
        h('h3', { style: { margin: '0 0 8px', fontSize: '1.1rem', fontWeight: '600', color: '#1f2937' } }, props.title),
        h('p', { style: { margin: '0', fontSize: '0.9rem', color: '#6b7280', lineHeight: '1.6' } }, props.description),
      ])
  },
})

// ── Image ──

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

// ── Grid ──

const GridBlock = defineComponent({
  name: 'GridBlock',
  props: {
    numColumns: { type: Number, default: 4 },
    gap: { type: Number, default: 24 },
  },
  setup(props) {
    return () =>
      h('div', {
        style: {
          display: 'grid',
          gridTemplateColumns: `repeat(${props.numColumns}, 1fr)`,
          gap: `${props.gap}px`,
          padding: '8px 0',
        },
      }, Array.from({ length: props.numColumns }, (_, i) =>
        h('div', {
          key: i,
          style: {
            minHeight: '80px', background: '#f9fafb', border: '2px dashed #e5e7eb',
            borderRadius: '8px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#9ca3af', fontSize: '13px',
          },
        }, `Column ${i + 1}`)
      ))
  },
})

// ── Columns ──

const ColumnsBlock = defineComponent({
  name: 'ColumnsBlock',
  props: {
    columns: { type: String, default: '2' },
    gap: { type: [String, Number], default: '16' },
  },
  setup(props) {
    return () => {
      const cols = parseInt(String(props.columns)) || 2
      const g = parseInt(String(props.gap)) || 16
      return h('div', {
        style: {
          display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: `${g}px`, padding: '8px 0',
        },
      }, Array.from({ length: cols }, (_, i) =>
        h('div', {
          key: i,
          style: {
            minHeight: '80px', background: '#f9fafb', border: '2px dashed #e5e7eb',
            borderRadius: '8px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#9ca3af', fontSize: '13px',
          },
        }, `Column ${i + 1}`)
      ))
    }
  },
})

// ── Flex ──

const FlexBlock = defineComponent({
  name: 'FlexBlock',
  props: {
    direction: { type: String, default: 'row' },
    justifyContent: { type: String, default: 'start' },
    gap: { type: Number, default: 24 },
    wrap: { type: String, default: 'wrap' },
  },
  setup(props) {
    return () =>
      h('div', {
        style: {
          display: 'flex',
          flexDirection: props.direction,
          justifyContent: props.justifyContent === 'start' ? 'flex-start' : props.justifyContent === 'end' ? 'flex-end' : props.justifyContent,
          gap: `${props.gap}px`,
          flexWrap: props.wrap,
          padding: '8px 0',
          minHeight: '60px',
          border: '2px dashed #e5e7eb',
          borderRadius: '8px',
        },
      }, [
        h('div', { style: { color: '#9ca3af', fontSize: '13px', padding: '16px', textAlign: 'center', width: '100%' } }, 'Flex container — drop items here'),
      ])
  },
})

// ── Space ──

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

// ── Logos ──

const LogosBlock = defineComponent({
  name: 'LogosBlock',
  props: {
    logos: { type: Array, default: () => [
      { alt: 'Logo 1', imageUrl: 'https://placehold.co/120x40/e2e8f0/94a3b8?text=Logo+1' },
      { alt: 'Logo 2', imageUrl: 'https://placehold.co/120x40/e2e8f0/94a3b8?text=Logo+2' },
      { alt: 'Logo 3', imageUrl: 'https://placehold.co/120x40/e2e8f0/94a3b8?text=Logo+3' },
      { alt: 'Logo 4', imageUrl: 'https://placehold.co/120x40/e2e8f0/94a3b8?text=Logo+4' },
    ]},
  },
  setup(props) {
    return () =>
      h('div', {
        style: {
          display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center',
          gap: '32px', padding: '24px',
        },
      }, (props.logos as any[]).map((logo: any, i: number) =>
        h('img', {
          key: i, src: logo.imageUrl, alt: logo.alt,
          style: { height: '40px', objectFit: 'contain', opacity: '0.6', transition: 'opacity 0.2s' },
        })
      ))
  },
})

// ── Stats ──

const StatsBlock = defineComponent({
  name: 'StatsBlock',
  props: {
    items: { type: Array, default: () => [
      { title: 'Users', description: '10,000+' },
      { title: 'Revenue', description: '$1.2M' },
      { title: 'Growth', description: '150%' },
    ]},
  },
  setup(props) {
    return () =>
      h('div', {
        style: {
          display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
          gap: '32px', padding: '32px 24px', textAlign: 'center',
        },
      }, (props.items as any[]).map((item: any, i: number) =>
        h('div', { key: i, style: { flex: '1', minWidth: '120px' } }, [
          h('div', { style: { fontSize: '2rem', fontWeight: '700', color: '#6366f1', marginBottom: '4px' } }, item.description),
          h('div', { style: { fontSize: '0.9rem', color: '#6b7280', fontWeight: '500' } }, item.title),
        ])
      ))
  },
})

// ── Divider ──

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

// ── Blank ──

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

// ── Config ──

export const puckConfig = {
  categories: {
    layout: { title: 'Layout', components: ['Grid', 'Flex', 'Columns', 'Space'] },
    typography: { title: 'Typography', components: ['Heading', 'Text', 'RichText'] },
    actions: { title: 'Actions', components: ['Button'] },
    sections: { title: 'Sections', components: ['Hero', 'Card', 'Stats', 'Logos'] },
    media: { title: 'Media', components: ['Image', 'Divider', 'Blank'] },
  },
  components: {
    Hero: {
      label: 'Hero',
      defaultProps: {
        title: 'Welcome to Puck',
        description: '<p>A visual editor for the web</p>',
        align: 'left',
        padding: '64px',
        buttons: [{ label: 'Learn more', href: '#', variant: 'primary' }],
      },
      fields: {
        title: { type: 'text', label: 'Title' },
        description: { type: 'richtext', label: 'Description' },
        align: {
          type: 'radio', label: 'Alignment',
          options: [{ label: 'Left', value: 'left' }, { label: 'Center', value: 'center' }],
        },
        padding: { type: 'select', label: 'Padding', options: spacingOptions },
        buttons: {
          type: 'array', label: 'Buttons',
          arrayFields: {
            label: { type: 'text', label: 'Label' },
            href: { type: 'text', label: 'URL' },
            variant: {
              type: 'radio', label: 'Variant',
              options: [{ label: 'Primary', value: 'primary' }, { label: 'Secondary', value: 'secondary' }],
            },
          },
        },
      },
      render: HeroBlock,
    },
    Heading: {
      label: 'Heading',
      defaultProps: { text: 'Heading', size: 'm', level: '', align: 'left', padding: '8px' },
      fields: {
        text: { type: 'textarea', label: 'Text' },
        size: { type: 'select', label: 'Size', options: sizeOptions },
        level: {
          type: 'select', label: 'Semantic Level',
          options: [
            { label: 'None', value: '' },
            { label: 'H1', value: '1' }, { label: 'H2', value: '2' },
            { label: 'H3', value: '3' }, { label: 'H4', value: '4' },
            { label: 'H5', value: '5' }, { label: 'H6', value: '6' },
          ],
        },
        align: {
          type: 'radio', label: 'Alignment',
          options: [{ label: 'Left', value: 'left' }, { label: 'Center', value: 'center' }, { label: 'Right', value: 'right' }],
        },
        padding: { type: 'select', label: 'Padding', options: spacingOptions },
      },
      render: HeadingBlock,
    },
    Text: {
      label: 'Text',
      defaultProps: { text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', size: 'm', align: 'left', color: 'default', maxWidth: '', padding: '8px' },
      fields: {
        text: { type: 'textarea', label: 'Content' },
        size: {
          type: 'select', label: 'Size',
          options: [{ label: 'Small', value: 's' }, { label: 'Medium', value: 'm' }],
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
        padding: { type: 'select', label: 'Padding', options: spacingOptions },
      },
      render: TextBlock,
    },
    RichText: {
      label: 'Rich Text',
      defaultProps: { richtext: '<h2>Heading</h2><p>Body text goes here.</p>', padding: '8px' },
      fields: {
        richtext: { type: 'richtext', label: 'Content' },
        padding: { type: 'select', label: 'Padding', options: spacingOptions },
      },
      render: RichTextBlock,
    },
    Button: {
      label: 'Button',
      defaultProps: { label: 'Button', href: '#', variant: 'primary' },
      fields: {
        label: { type: 'text', label: 'Label' },
        href: { type: 'text', label: 'URL' },
        variant: {
          type: 'radio', label: 'Variant',
          options: [{ label: 'Primary', value: 'primary' }, { label: 'Secondary', value: 'secondary' }],
        },
      },
      render: ButtonBlock,
    },
    Card: {
      label: 'Card',
      defaultProps: { title: 'Title', description: 'Description', icon: '✦', mode: 'card' },
      fields: {
        title: { type: 'text', label: 'Title' },
        description: { type: 'textarea', label: 'Description' },
        icon: {
          type: 'select', label: 'Icon',
          options: [
            { label: '✦ Star', value: '✦' }, { label: '⚡ Lightning', value: '⚡' },
            { label: '🎯 Target', value: '🎯' }, { label: '🚀 Rocket', value: '🚀' },
            { label: '💡 Idea', value: '💡' }, { label: '🔒 Lock', value: '🔒' },
            { label: '📊 Chart', value: '📊' }, { label: '🎨 Palette', value: '🎨' },
          ],
        },
        mode: {
          type: 'radio', label: 'Mode',
          options: [{ label: 'Card', value: 'card' }, { label: 'Flat', value: 'flat' }],
        },
      },
      render: CardBlock,
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
    Grid: {
      label: 'Grid',
      defaultProps: { numColumns: 4, gap: 24 },
      fields: {
        numColumns: { type: 'number', label: 'Columns', min: 1, max: 12 },
        gap: { type: 'number', label: 'Gap (px)', min: 0 },
      },
      render: GridBlock,
    },
    Flex: {
      label: 'Flex',
      defaultProps: { direction: 'row', justifyContent: 'start', gap: 24, wrap: 'wrap' },
      fields: {
        direction: {
          type: 'radio', label: 'Direction',
          options: [{ label: 'Row', value: 'row' }, { label: 'Column', value: 'column' }],
        },
        justifyContent: {
          type: 'radio', label: 'Justify',
          options: [{ label: 'Start', value: 'start' }, { label: 'Center', value: 'center' }, { label: 'End', value: 'end' }],
        },
        gap: { type: 'number', label: 'Gap (px)', min: 0 },
        wrap: {
          type: 'radio', label: 'Wrap',
          options: [{ label: 'Wrap', value: 'wrap' }, { label: 'No wrap', value: 'nowrap' }],
        },
      },
      render: FlexBlock,
    },
    Columns: {
      label: 'Columns',
      defaultProps: { columns: '2', gap: '16' },
      fields: {
        columns: {
          type: 'select', label: 'Columns',
          options: [{ label: '2', value: '2' }, { label: '3', value: '3' }, { label: '4', value: '4' }, { label: '5', value: '5' }, { label: '6', value: '6' }],
        },
        gap: { type: 'number', label: 'Gap (px)' },
      },
      render: ColumnsBlock,
    },
    Space: {
      label: 'Space',
      defaultProps: { size: '24px', direction: '' },
      fields: {
        size: { type: 'select', label: 'Size', options: spacingOptions },
        direction: {
          type: 'radio', label: 'Direction',
          options: [{ label: 'Both', value: '' }, { label: 'Vertical', value: 'vertical' }, { label: 'Horizontal', value: 'horizontal' }],
        },
      },
      render: SpaceBlock,
    },
    Logos: {
      label: 'Logos',
      defaultProps: {
        logos: [
          { alt: 'Logo 1', imageUrl: 'https://placehold.co/120x40/e2e8f0/94a3b8?text=Logo+1' },
          { alt: 'Logo 2', imageUrl: 'https://placehold.co/120x40/e2e8f0/94a3b8?text=Logo+2' },
          { alt: 'Logo 3', imageUrl: 'https://placehold.co/120x40/e2e8f0/94a3b8?text=Logo+3' },
          { alt: 'Logo 4', imageUrl: 'https://placehold.co/120x40/e2e8f0/94a3b8?text=Logo+4' },
        ],
      },
      fields: {
        logos: {
          type: 'array', label: 'Logos',
          arrayFields: {
            alt: { type: 'text', label: 'Alt text' },
            imageUrl: { type: 'text', label: 'Image URL' },
          },
        },
      },
      render: LogosBlock,
    },
    Stats: {
      label: 'Stats',
      defaultProps: {
        items: [
          { title: 'Users', description: '10,000+' },
          { title: 'Revenue', description: '$1.2M' },
          { title: 'Growth', description: '150%' },
        ],
      },
      fields: {
        items: {
          type: 'array', label: 'Stats',
          arrayFields: {
            title: { type: 'text', label: 'Label' },
            description: { type: 'text', label: 'Value' },
          },
        },
      },
      render: StatsBlock,
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
      render: DividerBlock,
    },
    Blank: {
      label: 'Blank',
      defaultProps: {},
      fields: {},
      render: BlankBlock,
    },
  },
  root: {
    label: 'Page',
    fields: {
      title: { type: 'text', label: 'Page Title' },
    },
  },
}
