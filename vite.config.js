import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "icons/icon.svg",
        "icons/icon-192.png",
        "icons/icon-512.png",
        "icons/apple-touch-icon.png",
        "icons/apple-touch-icon.svg",
      ],
      manifest: {
        name: "Her Study Space",
        short_name: "Her Space",
        description: "Seu jardim pessoal de estudos — organização, metas, anotações e foco.",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait-primary",
        background_color: "#FBF7F2",
        theme_color: "#C58FA3",
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],
        navigateFallback: "/index.html",
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith("/icons/"),
            handler: "CacheFirst",
            options: { cacheName: "her-space-icons" },
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith("/assets/"),
            handler: "CacheFirst",
            options: { cacheName: "her-space-assets" },
          },
          {
            urlPattern: ({ url }) => url.pathname === "/",
            handler: "NetworkFirst",
            options: { cacheName: "her-space-pages" },
          },
        ],
      },
    }),
  ],
});
