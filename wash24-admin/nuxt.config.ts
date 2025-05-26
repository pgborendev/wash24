// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@unocss/nuxt',
    'shadcn-nuxt',
    '@vueuse/nuxt',
    '@nuxt/eslint',
    '@nuxt/icon',
    '@pinia/nuxt',
    '@nuxtjs/color-mode'
  ],
  icon: {
    customCollections: [
      {
        prefix: 'my-icons',
        dir: './assets/icons'
      },
    ],
  },

  css: [
    '@unocss/reset/tailwind.css',
  ],

  colorMode: {
    classSuffix: '',
  },

  features: {
    // For UnoCSS
    inlineStyles: false,
  },

  eslint: {
    config: {
      standalone: false,
    },
  },

  routeRules: {
    '/components': { redirect: '/components/accordion' },
    '/settings': { redirect: '/settings/profile' },
  },

  imports: {
    dirs: [
      './lib',
    ],
  },

  devServer: {
    port: 3000,
    host: 'localhost',
    https: {
      key: './certs/key.pem',
      cert: './certs/cert.pem',
    },
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'https://localhost:8080/api',
      appName: 'Wash24 Admin',
      appVersion: '1.0.0',
      appDescription: 'Admin panel for Wash24 application',
    },
    private: {
      apiSecret: process.env.API_SECRET,
      sslKey: process.env.SSL_KEY_PATH,
      sslCert: process.env.SSL_CERT_PATH
    }
  },
  
  compatibilityDate: '2024-12-14',
})
