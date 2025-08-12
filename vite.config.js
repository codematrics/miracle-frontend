// vite.config.js
import react from "@vitejs/plugin-react"; // or vue, svelte, etc.
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  base: "./", // relative paths for assets (important for Vercel static hosting)
});
