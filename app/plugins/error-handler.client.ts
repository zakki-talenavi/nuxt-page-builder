export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = (error: any, _instance, info) => {
    console.error('[Vue Error]', info, error)
  }
})
