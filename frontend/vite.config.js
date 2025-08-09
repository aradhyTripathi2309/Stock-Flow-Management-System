import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const API_BASE_URL = env.VITE_API_URL || 'http://localhost:5175';
  
  return {
    plugins: [react()],
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        "/api": {
          target: API_BASE_URL.replace('/api', ''), // Remove /api suffix for proxy target
          changeOrigin: true,
          secure: true,
        },
      },
    },
  };
});
