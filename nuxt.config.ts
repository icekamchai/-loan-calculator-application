// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["~/assets/main.css"],
  routeRules: {
    "/**": {
      headers: {
        "Cache-Control": "s-maxage=1, stale-while-revalidate",
        "X-Content-Type-Options": "nosniff",
      },
    },
  },
  compatibilityDate: "2025-08-03",
  app: {
    pageTransition: {
      name: "page",
      mode: "out-in",
    },
  },
  modules: [
    "@pinia/nuxt",
    "@nuxt/image",
    "vuetify-nuxt-module",
    // รวมการตั้งค่า pwa ไว้ใน modules array โดยตรง
    [
      "@vite-pwa/nuxt",
      {
        manifest: {
          name: "Loan Calculator",
          short_name: "LoanCalc",
          description: "แอปพลิเคชันคำนวณสินเชื่อและวางแผนการเงิน",
          theme_color: "#ffffff",
          icons: [
            {
              src: "/pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        },
        workbox: {
          mode: "generateSW",
          globPatterns: ["**/*.{js,css,html,png,svg,ico,json}"],
          navigateFallback: "/",
          runtimeCaching: [
            {
              urlPattern: "/api/.*",
              handler: "StaleWhileRevalidate" as const,
              options: {
                cacheName: "api-cache",
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 7,
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: "module" as const,
        },
      },
    ],
  ],
  vuetify: {
    vuetifyOptions: {
      theme: {
        defaultTheme: "light",
        themes: {
          light: {
            dark: false,
            colors: {
              primary: "#77BEF0",
              secondary: "#FF894F",
              accent: "#FFCB61",
              error: "#EA5B6F",
              info: "#2196F3",
              success: "#4CAF50",
              warning: "#FB8C00",
              surface: "#FFFFFF",
            },
          },
          dark: {
            dark: true,
            colors: {
              primary: "#77BEF0",
              secondary: "#FF894F",
              accent: "#FFCB61",
              error: "#EA5B6F",
              info: "#2196F3",
              success: "#4CAF50",
              warning: "#FB8C00",
              surface: "#212121",
            },
          },
        },
      },
    },
  },
});
