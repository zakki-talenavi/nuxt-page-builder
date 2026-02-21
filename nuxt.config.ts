// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primeuix/themes/aura'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __rootDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@primevue/nuxt-module'],

  css: [resolve(__rootDir, 'assets/css/puck.css')],

  alias: {
    '~/config': resolve(__rootDir, 'app/config'),
  },

  components: [
    { path: resolve(__rootDir, 'components') },
  ],

  imports: {
    dirs: [
      resolve(__rootDir, 'composables'),
      resolve(__rootDir, 'composables/**'),
    ],
  },

  dir: {
    layouts: '../layouts',
  },

  primevue: {
    options: {
      theme: {
        preset: Aura,
      },
      ripple: true,
    },
  },
})
