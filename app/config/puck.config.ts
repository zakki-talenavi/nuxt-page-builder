import { h, defineComponent, markRaw, isVNode } from 'vue'
import DataTableBlockVue from '~~/components/puck/blocks/DataTableBlock.vue'

// Aligned with puck-main options (8px–160px) plus 0px and 4px for flexibility
const spacingOptions = [
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
]

// Order matches puck-main: xxxl → xs
const sizeOptions = [
  { label: 'XXXL', value: 'xxxl' },
  { label: 'XXL', value: 'xxl' },
  { label: 'XL', value: 'xl' },
  { label: 'L', value: 'l' },
  { label: 'M', value: 'm' },
  { label: 'S', value: 's' },
  { label: 'XS', value: 'xs' },
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
    layout: {
      type: Object as () => { padding?: string },
      default: () => ({ padding: '0px' }),
    },
  },
  setup(props) {
    return () => {
      const verticalPadding = props.layout?.padding ?? '0px'
      return h('section', {
        style: {
          paddingTop: verticalPadding,
          paddingBottom: verticalPadding,
          paddingLeft: '24px',
          paddingRight: '24px',
          textAlign: props.align,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          borderRadius: '4px',
        },
      }, [
        h('h1', { style: { margin: '0 0 12px', fontSize: '2.5rem', fontWeight: '700' } }, props.title),
        isVNode(props.description)
          ? h('div', { style: { margin: '0 0 24px', fontSize: '1.1rem', opacity: '0.9' } }, [props.description])
          : h('div', { style: { margin: '0 0 24px', fontSize: '1.1rem', opacity: '0.9' }, innerHTML: props.description }),
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
    }
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

// ── Text ──

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

// ── RichText ──

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

// ── Button (Vue SFC: link + custom modal) ──
import ButtonBlockVue from '~~/components/puck/blocks/ButtonBlock.vue'
// ── Breadcrumb (PrimeVue: icon + URL per item) ──
import BreadcrumbBlockVue from '~~/components/puck/blocks/BreadcrumbBlock.vue'

// ── Card ──

const CardBlock = defineComponent({
  name: 'CardBlock',
  props: {
    title: { type: String, default: 'Title' },
    description: { type: String, default: 'Description' },
    icon: { type: String, default: '✦' },
    mode: { type: String, default: 'flat' },
    layout: {
      type: Object as () => { padding?: string; verticalPadding?: string },
      default: () => ({ padding: '0px' }),
    },
  },
  setup(props) {
    return () => {
      const padding = props.layout?.padding ?? props.layout?.verticalPadding ?? '0px'
      return h('div', {
        style: {
          paddingTop: padding, paddingBottom: padding, paddingLeft: '24px', paddingRight: '24px',
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
    }
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

const gridAlignOptions = [
  { label: 'Start', value: 'start' },
  { label: 'Center', value: 'center' },
  { label: 'End', value: 'end' },
  { label: 'Stretch', value: 'stretch' },
]
const gridContentOptions = [
  ...gridAlignOptions,
  { label: 'Space between', value: 'space-between' },
  { label: 'Space around', value: 'space-around' },
  { label: 'Space evenly', value: 'space-evenly' },
]

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

// ── Columns ──

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

// ── Flex ──

const flexJustifyOptions = [
  { label: 'Flex start', value: 'flex-start' },
  { label: 'Center', value: 'center' },
  { label: 'Flex end', value: 'flex-end' },
  { label: 'Space between', value: 'space-between' },
  { label: 'Space around', value: 'space-around' },
  { label: 'Space evenly', value: 'space-evenly' },
]
const flexAlignOptions = [
  { label: 'Stretch', value: 'stretch' },
  { label: 'Center', value: 'center' },
  { label: 'Flex start', value: 'flex-start' },
  { label: 'Flex end', value: 'flex-end' },
]
const flexAlignContentOptions = [
  ...flexAlignOptions,
  { label: 'Space between', value: 'space-between' },
  { label: 'Space around', value: 'space-around' },
  { label: 'Space evenly', value: 'space-evenly' },
]

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

/** Used for localStorage key (per-path data). Change when config shape changes. */
export const puckComponentKey = 'puck-nuxt-v1'

export const puckConfig = {
  categories: {
    layout: { title: 'Layout', components: ['Grid', 'Flex', 'Columns', 'Space'] },
    typography: { title: 'Typography', components: ['Heading', 'Text', 'RichText'] },
    navigation: { title: 'Navigation', components: ['Breadcrumb'] },
    actions: { title: 'Actions', components: ['Button'] },
    sections: { title: 'Sections', components: ['Hero', 'Card', 'Stats', 'Logos'] },
    data: { title: 'Data', components: ['DataTable'] },
    media: { title: 'Media', components: ['Image', 'Divider', 'Blank'] },
  },
  components: {
    Hero: {
      label: 'Hero',
      defaultProps: {
        title: 'Hero',
        description: '<p>Description</p>',
        align: 'left',
        padding: '64px',
        buttons: [{ label: 'Learn more', href: '#' }],
        layout: { padding: '0px' },
      },
      fields: {
        title: { type: 'text', label: 'Title', contentEditable: true },
        description: { type: 'richtext', label: 'Description', contentEditable: true },
        align: {
          type: 'radio', label: 'Alignment',
          options: [{ label: 'left', value: 'left' }, { label: 'center', value: 'center' }],
        },
        padding: { type: 'select', label: 'Padding', options: spacingOptions },
        buttons: {
          type: 'array', label: 'Buttons',
          min: 1,
          max: 4,
          arrayFields: {
            label: { type: 'text', label: 'Label', contentEditable: true },
            href: { type: 'text', label: 'URL' },
            variant: {
              type: 'select', label: 'Variant',
              options: [{ label: 'primary', value: 'primary' }, { label: 'secondary', value: 'secondary' }],
            },
          },
          defaultItemProps: { label: 'Button', href: '#' },
        },
        layout: {
          type: 'object',
          label: 'Layout',
          objectFields: {
            padding: {
              type: 'select',
              label: 'Vertical Padding',
              options: spacingOptions,
            },
          },
        },
      },
      render: markRaw(HeroBlock),
    },
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
            padding: {
              type: 'select',
              label: 'Vertical Padding',
              options: spacingOptions,
            },
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
            padding: {
              type: 'select',
              label: 'Vertical Padding',
              options: spacingOptions,
            },
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
            padding: {
              type: 'select',
              label: 'Vertical Padding',
              options: spacingOptions,
            },
          },
        },
      },
      render: markRaw(RichTextBlock),
    },
    Breadcrumb: {
      label: 'Breadcrumb',
      defaultProps: {
        showHome: true,
        homeIcon: 'pi pi-home',
        homeLabel: 'Home',
        homeUrl: '/',
        items: [
          { label: 'Category', url: '/category', icon: 'pi pi-folder' },
          { label: 'Product', url: '/category/product', icon: '' },
        ],
      },
      fields: {
        showHome: {
          type: 'radio',
          label: 'Tampilkan item Home',
          options: [
            { label: 'Ya', value: true },
            { label: 'Tidak', value: false },
          ],
        },
        homeIcon: { type: 'text', label: 'Icon Home (class CSS, contoh: pi pi-home)' },
        homeLabel: { type: 'text', label: 'Label Home' },
        homeUrl: { type: 'text', label: 'URL Home' },
        items: {
          type: 'array',
          label: 'Item breadcrumb',
          arrayFields: {
            label: { type: 'text', label: 'Label' },
            url: { type: 'text', label: 'URL' },
            icon: { type: 'text', label: 'Icon (class CSS, contoh: pi pi-folder)' },
          },
        },
      },
      render: markRaw(BreadcrumbBlockVue),
    },
    Button: {
      label: 'Button',
      defaultProps: {
        label: 'Button',
        href: '#',
        severity: 'primary',
        variant: 'filled',
        actionType: 'button',
        buttonType: 'button',
        icon: '',
        iconPos: 'left',
        size: 'normal',
        raised: false,
        rounded: false,
        disabled: false,
        loading: false,
        badge: '',
        badgeSeverity: 'danger',
        ariaLabel: '',
        modalTitle: '',
        modalContentType: 'richtext',
        modalContent: '',
        formId: '',
      },
      fields: {
        label: { type: 'text', label: 'Label', placeholder: 'Lorem ipsum...', contentEditable: true },
        href: { type: 'text', label: 'URL' },
        actionType: {
          type: 'radio',
          label: 'Tipe',
          options: [
            { label: 'Link', value: 'link' },
            { label: 'Button', value: 'button' },
            { label: 'Modal', value: 'modal' },
          ],
        },
        buttonType: {
          type: 'radio',
          label: 'Type (HTML)',
          options: [
            { label: 'button – tombol biasa', value: 'button' },
            { label: 'submit – kirim form', value: 'submit' },
            { label: 'reset – reset form', value: 'reset' },
          ],
        },
        severity: {
          type: 'select',
          label: 'Severity',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
            { label: 'Success', value: 'success' },
            { label: 'Info', value: 'info' },
            { label: 'Warn', value: 'warn' },
            { label: 'Help', value: 'help' },
            { label: 'Danger', value: 'danger' },
            { label: 'Contrast', value: 'contrast' },
          ],
        },
        variant: {
          type: 'select',
          label: 'Variant',
          options: [
            { label: 'Filled', value: 'filled' },
            { label: 'Text', value: 'text' },
            { label: 'Outlined', value: 'outlined' },
            { label: 'Link', value: 'link' },
          ],
        },
        icon: {
          type: 'select',
          label: 'Icon',
          options: [
            { label: 'Tidak ada', value: '' },
            { label: '✓ Check', value: 'pi pi-check' },
            { label: '✕ Times', value: 'pi pi-times' },
            { label: '🔍 Search', value: 'pi pi-search' },
            { label: '🏠 Home', value: 'pi pi-home' },
            { label: '👤 User', value: 'pi pi-user' },
            { label: '⚙ Cog', value: 'pi pi-cog' },
            { label: '📤 Send', value: 'pi pi-send' },
            { label: '🔄 Refresh', value: 'pi pi-refresh' },
            { label: '⬇ Download', value: 'pi pi-download' },
            { label: '⬆ Upload', value: 'pi pi-upload' },
            { label: '+ Plus', value: 'pi pi-plus' },
            { label: '− Minus', value: 'pi pi-minus' },
            { label: '✎ Pencil', value: 'pi pi-pencil' },
            { label: '🗑 Trash', value: 'pi pi-trash' },
            { label: '♥ Heart', value: 'pi pi-heart' },
            { label: '★ Star', value: 'pi pi-star' },
            { label: '🔖 Bookmark', value: 'pi pi-bookmark' },
            { label: '📅 Calendar', value: 'pi pi-calendar' },
            { label: '✉ Envelope', value: 'pi pi-envelope' },
            { label: '📞 Phone', value: 'pi pi-phone' },
            { label: '🔒 Lock', value: 'pi pi-lock' },
            { label: '🔓 Unlock', value: 'pi pi-lock-open' },
            { label: '▶ Play', value: 'pi pi-play' },
            { label: '⏹ Stop', value: 'pi pi-stop' },
            { label: '📋 Copy', value: 'pi pi-copy' },
            { label: '🔗 Link', value: 'pi pi-link' },
            { label: '⋯ Ellipsis', value: 'pi pi-ellipsis-v' },
            { label: '▼ Chevron down', value: 'pi pi-chevron-down' },
            { label: '▲ Chevron up', value: 'pi pi-chevron-up' },
            { label: '◀ Chevron left', value: 'pi pi-chevron-left' },
            { label: '▶ Chevron right', value: 'pi pi-chevron-right' },
          ],
        },
        iconPos: {
          type: 'radio',
          label: 'Posisi Icon',
          options: [
            { label: 'Kiri', value: 'left' },
            { label: 'Kanan', value: 'right' },
            { label: 'Atas', value: 'top' },
            { label: 'Bawah', value: 'bottom' },
          ],
        },
        size: {
          type: 'radio',
          label: 'Ukuran',
          options: [
            { label: 'Small', value: 'small' },
            { label: 'Normal', value: 'normal' },
            { label: 'Large', value: 'large' },
          ],
        },
        raised: { type: 'radio', label: 'Raised', options: [{ label: 'Ya', value: true }, { label: 'Tidak', value: false }] },
        rounded: { type: 'radio', label: 'Rounded', options: [{ label: 'Ya', value: true }, { label: 'Tidak', value: false }] },
        disabled: { type: 'radio', label: 'Disabled', options: [{ label: 'Ya', value: true }, { label: 'Tidak', value: false }] },
        loading: { type: 'radio', label: 'Loading', options: [{ label: 'Ya', value: true }, { label: 'Tidak', value: false }] },
        badge: { type: 'text', label: 'Badge (teks, kosongkan jika tidak pakai)' },
        badgeSeverity: {
          type: 'select',
          label: 'Badge Severity',
          options: [
            { label: 'Danger', value: 'danger' },
            { label: 'Contrast', value: 'contrast' },
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
          ],
        },
        ariaLabel: { type: 'text', label: 'Aria Label (a11y)' },
        modalTitle: { type: 'text', label: 'Judul Modal' },
        modalContentType: {
          type: 'radio',
          label: 'Konten Modal',
          options: [
            { label: 'Rich Text', value: 'richtext' },
            { label: 'Form', value: 'form' },
          ],
        },
        modalContent: { type: 'richtext', label: 'Konten Modal (Rich Text)' },
        formId: { type: 'text', label: 'ID Form (jika tipe Form)' },
      },
      render: markRaw(ButtonBlockVue),
    },
    Card: {
      label: 'Card',
      defaultProps: { title: 'Title', description: 'Description', icon: '✦', mode: 'flat', layout: { padding: '0px' } },
      fields: {
        title: { type: 'text', label: 'Title', contentEditable: true },
        description: { type: 'textarea', label: 'Description', contentEditable: true },
        icon: {
          type: 'select',
          label: 'Icon',
          options: [
            { label: '✦ Star', value: '✦' }, { label: '⚡ Lightning', value: '⚡' },
            { label: '🎯 Target', value: '🎯' }, { label: '🚀 Rocket', value: '🚀' },
            { label: '💡 Idea', value: '💡' }, { label: '🔒 Lock', value: '🔒' },
            { label: '📊 Chart', value: '📊' }, { label: '🎨 Palette', value: '🎨' },
          ],
        },
        mode: {
          type: 'radio',
          label: 'Mode',
          options: [{ label: 'card', value: 'card' }, { label: 'flat', value: 'flat' }],
        },
        layout: {
          type: 'object',
          label: 'Layout',
          objectFields: {
            padding: {
              type: 'select',
              label: 'Vertical Padding',
              options: spacingOptions,
            },
          },
        },
      },
      render: markRaw(CardBlock),
    },
    Image: {
      label: 'Image',
      defaultProps: { url: 'https://placehold.co/800x400/e2e8f0/94a3b8?text=Image', alt: 'Image' },
      fields: {
        url: { type: 'text', label: 'Image URL' },
        alt: { type: 'text', label: 'Alt Text' },
      },
      render: markRaw(ImageBlock),
    },
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
        justifyItems: {
          type: 'select',
          label: 'Justify items',
          options: gridAlignOptions,
        },
        alignItems: {
          type: 'select',
          label: 'Align items',
          options: gridAlignOptions,
        },
        justifyContent: {
          type: 'select',
          label: 'Justify content',
          options: gridContentOptions,
        },
        alignContent: {
          type: 'select',
          label: 'Align content',
          options: gridContentOptions,
        },
        layout: {
          type: 'object',
          label: 'Layout',
          objectFields: {
            verticalPadding: {
              type: 'select',
              label: 'Vertical Padding',
              options: spacingOptions,
            },
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
        justifyContent: {
          type: 'select',
          label: 'Justify content',
          options: flexJustifyOptions,
        },
        alignItems: {
          type: 'select',
          label: 'Align items',
          options: flexAlignOptions,
        },
        alignContent: {
          type: 'select',
          label: 'Align content (wrap only)',
          options: flexAlignContentOptions,
        },
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
            verticalPadding: {
              type: 'select',
              label: 'Vertical Padding',
              options: spacingOptions,
            },
          },
        },
      },
      render: markRaw(FlexBlock),
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
    Logos: {
      label: 'Logos',
      defaultProps: {
        logos: [
          { alt: '', imageUrl: 'https://logolook.net/wp-content/uploads/2021/06/Google-Logo.png' },
          { alt: '', imageUrl: 'https://logolook.net/wp-content/uploads/2021/06/Google-Logo.png' },
          { alt: '', imageUrl: 'https://logolook.net/wp-content/uploads/2021/06/Google-Logo.png' },
          { alt: '', imageUrl: 'https://logolook.net/wp-content/uploads/2021/06/Google-Logo.png' },
          { alt: '', imageUrl: 'https://logolook.net/wp-content/uploads/2021/06/Google-Logo.png' },
        ],
      },
      fields: {
        logos: {
          type: 'array',
          label: 'Logos',
          arrayFields: {
            alt: { type: 'text', label: 'Alt' },
            imageUrl: { type: 'text', label: 'Image URL' },
          },
          defaultItemProps: { alt: '', imageUrl: '' },
        },
      },
      render: markRaw(LogosBlock),
    },
    Stats: {
      label: 'Stats',
      defaultProps: {
        items: [{ title: 'Stat', description: '1,000' }],
      },
      fields: {
        items: {
          type: 'array',
          label: 'Stats',
          arrayFields: {
            title: { type: 'text', label: 'Title', contentEditable: true },
            description: { type: 'text', label: 'Description', contentEditable: true },
          },
          defaultItemProps: { title: 'Stat', description: '1,000' },
        },
      },
      render: markRaw(StatsBlock),
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
    DataTable: {
      label: 'DataTable',
      defaultProps: {
        columns: [
          { field: 'id', header: 'ID' },
          { field: 'name', header: 'Name' },
          { field: 'email', header: 'Email' },
          { field: 'address.city', header: 'City' },
          { field: 'company.name', header: 'Company' },
        ],
        data: [
          { col1: 'A1', col2: 'B1', _id: 'row-0' },
          { col1: 'A2', col2: 'B2', _id: 'row-1' },
        ],
        apiUrl: '',
        apiDataPath: '',
        apiPageParam: 'page',
        apiLimitParam: 'limit',
        apiTotalPath: 'total',
        paginationMode: 'client',
        paginator: true,
        rows: 10,
        rowsPerPageOptions: [5, 10, 20, 50],
        showGridlines: false,
        stripedRows: true,
        size: 'normal',
        scrollable: false,
        scrollHeight: '400px',
        showRowNumbers: true,
        showActionColumn: true,
        actionButtons: [
          { type: 'edit', label: 'Edit', icon: '✎' },
          { type: 'delete', label: 'Hapus', icon: '🗑' },
        ],
        headerBgColor: '',
        headerTextColor: '',
        bodyBgColor: '',
        bodyZebraColor: '',
        bodyTextColor: '',
        borderColor: '',
        rowHoverColor: '',
      },
      fields: {
        apiUrl: { type: 'text', label: 'API URL (optional)', description: 'Leave empty for manual data. Example: https://api.example.com/users' },
        apiDataPath: { type: 'text', label: 'API data path', description: 'Path to array in response, e.g. data or results. Leave empty if response is the array.' },
        paginationMode: {
          type: 'radio',
          label: 'Pagination',
          options: [
            { label: 'Client (semua data di-load, potong di UI)', value: 'client' },
            { label: 'Server (fetch per halaman)', value: 'server' },
          ],
        },
        apiPageParam: { type: 'text', label: 'Nama param halaman (server)', description: 'Nama parameter di URL, bukan angkanya. Contoh: page → ?page=1' },
        apiLimitParam: { type: 'text', label: 'Nama param limit (server)', description: 'Nama parameter di URL. Nilai diambil dari "Rows per page". Contoh: limit → ?limit=10' },
        apiTotalPath: { type: 'text', label: 'Path total di response (server)', description: 'Mis. total atau meta.total' },
        columns: {
          type: 'array',
          label: 'Kolom',
          arrayFields: {
            field: {
              type: 'text',
              label: 'Field (key atau path)',
              description: 'Path, atau gabung dengan + . Teks tambahan pakai tanda kutip: address.zipcode + " kodenya " + address.city',
            },
            header: { type: 'text', label: 'Header' },
          },
          defaultItemProps: { field: 'name', header: 'Name' },
        },
        data: {
          type: 'array',
          label: 'Data (manual)',
          arrayFields: {
            col1: { type: 'text', label: 'Kolom 1 (manual)' },
            col2: { type: 'text', label: 'Kolom 2 (manual)' },
            col3: { type: 'text', label: 'Kolom 3 (manual)' },
            col4: { type: 'text', label: 'Kolom 4 (manual)' },
            col5: { type: 'text', label: 'Kolom 5 (manual)' },
          },
          defaultItemProps: { col1: '', col2: '', col3: '', col4: '', col5: '', _id: '' },
        },
        paginator: {
          type: 'radio',
          label: 'Paginator',
          options: [{ label: 'Off', value: false }, { label: 'On', value: true }],
        },
        rows: { type: 'number', label: 'Rows per page', min: 1 },
        showGridlines: {
          type: 'radio',
          label: 'Grid lines',
          options: [{ label: 'Off', value: false }, { label: 'On', value: true }],
        },
        stripedRows: {
          type: 'radio',
          label: 'Striped rows',
          options: [{ label: 'Off', value: false }, { label: 'On', value: true }],
        },
        size: {
          type: 'select',
          label: 'Size',
          options: [
            { label: 'Small', value: 'small' },
            { label: 'Normal', value: 'normal' },
            { label: 'Large', value: 'large' },
          ],
        },
        scrollable: {
          type: 'radio',
          label: 'Scrollable',
          options: [{ label: 'Off', value: false }, { label: 'On', value: true }],
        },
        scrollHeight: { type: 'text', label: 'Scroll height' },
        showRowNumbers: {
          type: 'radio',
          label: 'Kolom No',
          options: [{ label: 'Ya', value: true }, { label: 'Tidak', value: false }],
        },
        headerBgColor: { type: 'color', label: 'Warna header (background)' },
        headerTextColor: { type: 'color', label: 'Warna teks header' },
        bodyBgColor: { type: 'color', label: 'Warna body (background)' },
        bodyZebraColor: { type: 'color', label: 'Warna baris genap (striped)' },
        bodyTextColor: { type: 'color', label: 'Warna teks body' },
        borderColor: { type: 'color', label: 'Warna border' },
        rowHoverColor: { type: 'color', label: 'Warna hover baris' },
        showActionColumn: {
          type: 'radio',
          label: 'Kolom Aksi',
          options: [{ label: 'Ya', value: true }, { label: 'Tidak', value: false }],
        },
        actionButtons: {
          type: 'array',
          label: 'Tombol aksi (custom)',
          arrayFields: {
            type: {
              type: 'select',
              label: 'Tipe',
              options: [
                { label: 'Edit', value: 'edit' },
                { label: 'Hapus', value: 'delete' },
                { label: 'Link', value: 'link' },
              ],
            },
            label: { type: 'text', label: 'Label (tooltip)' },
            icon: { type: 'text', label: 'Icon (emoji/teks)' },
            url: {
              type: 'text',
              label: 'URL (hanya untuk Link)',
              description: 'Gunakan {{id}} atau {{field}} untuk nilai dari baris. Contoh: /user/{{id}}',
            },
          },
          defaultItemProps: { type: 'edit', label: 'Edit', icon: '✎', url: '' },
        },
      },
      render: markRaw(DataTableBlockVue),
    },
  },
  root: {
    label: 'Page',
    defaultProps: { title: 'My Page' },
    fields: {
      title: { type: 'text', label: 'Title' },
    },
  },
}
