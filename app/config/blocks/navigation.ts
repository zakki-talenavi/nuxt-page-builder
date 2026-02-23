import { markRaw } from 'vue'
import BreadcrumbBlockVue from '~~/components/puck/blocks/BreadcrumbBlock.vue'

export const navigationComponents = {
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
} as const
