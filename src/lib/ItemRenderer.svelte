<script lang="ts">
    import { onMount } from 'svelte';
    import type { ComponentType } from 'svelte';
    import type {FileDescriptor, LastItem} from './types';  // Assuming we've defined LastItem in a separate file

    export let item: LastItem;
    export let fileDesc: FileDescriptor

    let renderedComponent: ComponentType | null = null;
    let htmlContent: string | null = null;

    async function renderItem() {
        if (item === null) {
            htmlContent = '';
        } else if (typeof item === 'string') {
            htmlContent = item;
        } else if (typeof item === 'function') {
            renderedComponent = item;
        } else if (typeof item === 'object' && 'default' in item && typeof item.default === 'function') {
            renderedComponent = item.default;
        } else if (item instanceof Promise) {
            try {
                const resolvedItem = await item;
                if (typeof resolvedItem === 'object' && resolvedItem !== null && 'default' in resolvedItem) {
                    renderedComponent = resolvedItem.default;
                }
            } catch (error) {
                console.error('Error loading async component:', error);
            }
        }
    }

    onMount(() => {
        renderItem();
    });

    $: if (item) renderItem();
</script>

{#if htmlContent !== null}
    {@html htmlContent}
{:else if renderedComponent}
    <svelte:component this={renderedComponent} />
{:else}
    <slot data={fileDesc}></slot>
{/if}