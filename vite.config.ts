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
        dev: false,
        css: "injected",
      },
      emitCss: false,
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
        // Provide exports for Svelte components
        exports: "named",
        // Preserve modules
        // preserveModules: true,
        // Output to a directory
        dir: "dist",
        // Use .js extension for all files
        entryFileNames: "[name].[format].js",
        chunkFileNames: "[name]-[hash].js",
      },
    },
    sourcemap: true,
    // Ensure Svelte components are processed
    commonjsOptions: {
      include: [/node_modules/],
      extensions: [".js", ".svelte"],
    },
    // Ensure CSS is handled correctly
    cssCodeSplit: true,
    // Minimize bundle
    minify: true,
  },
});
