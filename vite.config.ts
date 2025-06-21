import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { tempo } from "tempo-devtools/dist/vite";

const conditionalPlugins: [string, Record<string, any>][] = [];

// @ts-ignore
if (process.env.TEMPO === "true") {
  conditionalPlugins.push(["tempo-devtools/swc", {}]);
}

// https://vitejs.dev/config/
export default defineConfig({
  base:
    process.env.NODE_ENV === "development"
      ? "/"
      : process.env.VITE_BASE_PATH || "/",
  optimizeDeps: {
    entries: ["src/main.tsx", "src/tempobook/**/*"],
    include: ["react", "react-dom"],
    exclude: [
      "@radix-ui/react-avatar",
      "@radix-ui/react-dialog",
      "@radix-ui/react-select",
      "@radix-ui/react-icons",
    ],
  },
  plugins: [
    react({
      plugins: conditionalPlugins,
    }),
    tempo(),
  ],
  resolve: {
    preserveSymlinks: true,
    alias: {
      "@": path.resolve(__dirname, "./src"),
      react: "react",
      "react-dom": "react-dom",
    },
    extensions: [".js", ".ts", ".jsx", ".tsx", ".json"],
  },
  server: {
    // @ts-ignore
    allowedHosts: true,
  },
});
