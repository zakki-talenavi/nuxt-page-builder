export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = (error: any, _instance, info) => {
    console.error('[Vue Error]', info, error)
  }

  // Suppress known warning from Vue DevTools overlay (VueElement + style on teleport/fragment root)
  const originalWarn = nuxtApp.vueApp.config.warnHandler
  nuxtApp.vueApp.config.warnHandler = (msg, instance, trace) => {
    if (
      typeof msg === 'string' &&
      msg.includes('Extraneous non-props attributes') &&
      msg.includes('could not be automatically inherited') &&
      (msg.includes('fragment') || msg.includes('teleport'))
    ) {
      return
    }
    originalWarn?.(msg, instance, trace)
  }
})
