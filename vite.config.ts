import {defineConfig} from "vite";
import {svelte} from "@sveltejs/vite-plugin-svelte";
import path from "path";
import dts from "vite-plugin-dts";
import pkg from './package.json';

const bundleComponents = process.env.BUNDLE_COMPONENTS ?? true;

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        svelte({
            compilerOptions: {
                customElement: false,
            },
        }),
        dts({
            include: ["src/lib/*.ts"],
        }),
    ],
    build: {
        emptyOutDir: true,
        lib: {
            entry: path.resolve(__dirname, "src/lib/index.ts"),
            formats: bundleComponents ? ['es', 'esm', 'umd'] as any : ['es'],
            name: pkg.name,
            fileName: (format) => `${pkg.name}.${format}.js`
        },
        rollupOptions: {
            external: ['svelte'],
            output: bundleComponents ? {} : {
                inlineDynamicImports: false,
                chunkFileNames: "[name].js",
                manualChunks: {'svelte': ["svelte"]},
                globals: {
                  svelte: "Svelte",
                }
            }
        },
    },
});
