import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    sourcemap: true,
    minify: false,
    cssCodeSplit: false,
    lib: {
      entry: path.resolve(__dirname, "src/lib/index.ts"),
      name: "sly-svelte-pane",
      formats: ["es", "umd"],
      fileName: (format) => `sly-svelte-pane.${format}.js`,
    },
    rollupOptions: {
      external: ["svelte"],
      output: {
        globals: {
          svelte: "Svelte",
        },
        inlineDynamicImports: false,
        preserveModules: false,
      },
    },
  },
});
