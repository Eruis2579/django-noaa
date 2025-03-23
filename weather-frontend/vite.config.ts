import { defineConfig } from 'vite';
import path from "path";
import react from '@vitejs/plugin-react';

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Binds to all interfaces, allowing access from other devices
    port: 5177, // Default port, can be changed if needed
  },
});
