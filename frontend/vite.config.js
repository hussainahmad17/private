import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/", // ✅ important for Vercel
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@jumbo", replacement: "/src/@jumbo" },
      { find: "@assets", replacement: "/src/@assets" },
      { find: "@app", replacement: "/src/app" },
    ],
  },
  define: {
    global: "window",
  },
  optimizeDeps: {
    include: ["react-draft-wysiwyg"],
  },
});
