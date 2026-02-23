import { h, defineComponent, markRaw, isVNode } from 'vue'
import { spacingOptions } from './constants'

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

export const sectionsComponents = {
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
          padding: { type: 'select', label: 'Vertical Padding', options: spacingOptions },
        },
      },
    },
    render: markRaw(HeroBlock),
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
          padding: { type: 'select', label: 'Vertical Padding', options: spacingOptions },
        },
      },
    },
    render: markRaw(CardBlock),
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
    defaultProps: { items: [{ title: 'Stat', description: '1,000' }] },
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
} as const
