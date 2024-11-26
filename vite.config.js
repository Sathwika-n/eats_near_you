import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/", // For root directory deployment
  define: {
    "process.env": process.env, // Optional, depending on your setup
  },
});
