// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    runtimeConfig: {
        public: {
            apiBase:'http://localhost:8087/api/'
        }
    },
    compatibilityDate: '2024-04-03',
    devtools: { enabled: true }
});
