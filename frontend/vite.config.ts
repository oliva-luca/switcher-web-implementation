import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/gamelist": {
        target: "http://127.0.0.1:8000/",
        changeOrigin: true,
        secure: false,
      },
      "/user": {
        target: "http://127.0.0.1:8000/",
        changeOrigin: true,
        secure: false,
      },
      "/tableros": {
        target: "http://127.0.0.1:8000/",
        changeOrigin: true,
        secure: false,
      },
      "/end_turn": {
        target: "http://127.0.0.1:8000/",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
