import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/Event_Countdown_App/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
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
