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
    lib: {
      entry: path.resolve(__dirname, "src/lib/index.ts"),
      name: "sly-svelte-pane",
      fileName: (format) => `sly-svelte-pane.${format}.js`,
    },
    rollupOptions: {
      external: ["svelte"],
      output: {
        globals: {
          svelte: "Svelte",
        },
      },
    },
  },
});