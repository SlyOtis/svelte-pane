<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';

    const cssLoaded = writable(false);

    function waitForStylesheet(href: string): Promise<void> {
        return new Promise((resolve) => {
            const existingLink = document.querySelector(`link[href="${href}"]`);
            if (existingLink) {
                // If the stylesheet is already in the document, resolve immediately
                resolve();
            } else {
                // Otherwise, wait for the stylesheet to load
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        const addedNodes = mutation.addedNodes;
                        for (let i = 0; i < addedNodes.length; i++) {
                            const node = addedNodes[i] as HTMLLinkElement;
                            if (node.tagName === 'LINK' && node.href.includes(href)) {
                                observer.disconnect();
                                node.onload = () => resolve();
                                return;
                            }
                        }
                    });
                });

                observer.observe(document.head, {
                    childList: true,
                    subtree: true
                });
            }
        });
    }

    onMount(async () => {
        const href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200";
        await waitForStylesheet(href);
        cssLoaded.set(true);
    });
</script>

<svelte:head>
    <style>
        @import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200");
    </style>
</svelte:head>

{#if $cssLoaded}
    <slot></slot>
{:else}
    <slot name="loading"></slot>
{/if}