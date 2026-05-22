import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/Event_Countdown_App/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        // HTMLナビゲーションはネットワーク優先で取得し、デプロイ直後でも
        // 必ず最新の index.html → 最新の JS ハッシュ を参照させる。
        // ネットワーク不通時のみキャッシュ（オフライン用フォールバック）。
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === "navigate",
            handler: "NetworkFirst",
            options: {
              cacheName: "html-pages",
              networkTimeoutSeconds: 3,
              expiration: { maxEntries: 10 },
            },
          },
        ],
      },
      manifest: {
        name: "Our Countdown",
        short_name: "Countdown",
        description: "二人のイベントカウントダウン",
        theme_color: "#e68ab6",
        background_color: "#fff0f5",
        display: "standalone",
        start_url: "/Event_Countdown_App/",
        icons: [
          { src: "/Event_Countdown_App/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/Event_Countdown_App/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
      },
    }),
  ],
});
