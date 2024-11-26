// plugins/vue3-google-login.client.ts
import vue3GoogleLogin from 'vue3-google-login'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(vue3GoogleLogin, {
    clientId: '71173702956-kte7iifq4k4pol20g4s3bvt9uc9qieu3.apps.googleusercontent.com'
  })
});
