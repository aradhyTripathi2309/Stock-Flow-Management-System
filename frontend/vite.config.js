import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // ✅ Vite (frontend) runs on 5173
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://localhost:5175", // ✅ Backend runs on 5175
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
