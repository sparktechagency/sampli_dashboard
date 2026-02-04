import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    host: "45.55.251.203",
    port: 3001,
  },
});
