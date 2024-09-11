<script lang="ts">
    import { onMount } from 'svelte';
    import type { ComponentType } from 'svelte';
    import type {FileDescriptor, LastItem} from './types';  // Assuming we've defined LastItem in a separate file

    export let item: LastItem;
    export let fileDesc: FileDescriptor

    let renderedComponent: ComponentType | null = null;
    let htmlContent: string | null = null;
    let isLoading = true

    function isSvelteComponent(func: any): func is ComponentType {
        return func.$$render !== undefined;
    }

    async function renderItem() {
        isLoading = true;

        try {
            if (item === null || item === undefined) {
                htmlContent = '';
            } else if (typeof item === 'string') {
                htmlContent = item;
            } else if (typeof item === 'function') {
                if (isSvelteComponent(item)) {
                    renderedComponent = item;
                } else {
                    const result = (item as any)(fileDesc);
                    if (result instanceof Promise) {
                        const resolvedResult = await result;
                        renderedComponent = resolvedResult.default;
                    } else {
                        renderedComponent = result.default;
                    }
                }
            } else if (typeof item === 'object' && 'default' in item && typeof item.default === 'function') {
                renderedComponent = item.default;
            }
        } catch (error) {
            console.error('Error rendering item:', error);
            htmlContent = `<p>Error: ${error}</p>`;
        } finally {
            isLoading = false;
        }
    }

    onMount(() => {
        renderItem();
    });

    $: if (item || fileDesc) renderItem();
</script>

{#if isLoading}
    <slot data={fileDesc}></slot>
{:else if htmlContent !== null}
    {@html htmlContent}
{:else if renderedComponent}
    <svelte:component this={renderedComponent} />
{:else}
    <p>No content to display</p>
{/if}