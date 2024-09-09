import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        customElement: false,
      },
    }),
    dts({
      include: ["./src/lib"],
      exclude: ["**/*.spec.ts", "**/*.test.ts"],
    }),
  ],
  build: {
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, "src/lib/index.ts"),
      name: "sly-svelte-pane",
      fileName: (format) => `index.${format}.js`,
      formats: ["es", "umd"],
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
