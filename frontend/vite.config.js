import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import sirv from 'sirv'
import { resolve } from 'path'

// Vite rejects requests whose Host header it doesn't recognise, which makes a
// Cloudflare tunnel return 403 until its hostname is listed here.
// A leading dot matches every subdomain of that domain.
const allowedHosts = [
  ".trycloudflare.com",
  "localhost",
  "172.16.220.105",
];

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 5173,
    allowedHosts,
    proxy: {
      //"/api": "https://bitwebapp-24.onrender.com",
      "/api": "http://localhost:8000",
      // socket.io lives at /socket.io, not /api, and needs ws upgrades
      // forwarded or same-origin chat connections 404.
      "/socket.io": { target: "http://localhost:8000", ws: true },
    },
  },
  plugins: [react(),
    {
      name: 'serve-live-public-in-preview',
      configurePreviewServer(server) {
        // This serves the LIVE 'public' folder at the root level
        server.middlewares.use(
          sirv(resolve(__dirname, 'public'), {
            dev: true,
            etag: false,
            extensions: [] 
          })
        )
      }
    }],
  preview: {
    host: true,
    port: 3000,
    allowedHosts,
    proxy: {
      //"/api": "https://bitwebapp-24.onrender.com",
      "/api": "http://localhost:8000",
      // socket.io lives at /socket.io, not /api, and needs ws upgrades
      // forwarded or same-origin chat connections 404.
      "/socket.io": { target: "http://localhost:8000", ws: true },
    },
  },
});

