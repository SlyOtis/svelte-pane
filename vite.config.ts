import {defineConfig} from "vite";
import {svelte} from "@sveltejs/vite-plugin-svelte";
import path from "path";
import dts from "vite-plugin-dts";

const bundleComponents = process.env.BUNDLE_COMPONENTS ?? true;

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svelte()],
    build: {
        emptyOutDir: true,
        lib: {
            entry: path.resolve(__dirname, "src/lib/index.ts"),
            name: "sly-svelte-pane",
            fileName: 'index',
            formats: ['es']
        },
        rollupOptions: {
            external: ['svelte'],
            output: {
                globals: {
                    svelte: 'Svelte'
                }
            }
        },
    },
});
