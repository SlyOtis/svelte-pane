<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';

    interface StyleRule extends CSSRule {
        href?: string;
        styleSheet?: CSSStyleSheet;
    }
    function waitForStylesheet(href: string, timeout: number = 5000): Promise<void> {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            function checkStylesheet(): void {
                const link = document.querySelector<HTMLLinkElement>(`link[href^="${href}"]`);

                if (link) {
                    if (link.sheet) {
                        // Stylesheet is already loaded
                        resolve();
                    } else {
                        // Stylesheet found but not yet loaded, wait for load event
                        link.addEventListener('load', () => resolve());
                        link.addEventListener('error', () => reject(new Error(`Error loading stylesheet: ${href}`)));
                    }
                } else {
                    // Stylesheet not found in DOM, check if it's loaded via @import
                    if (isStylesheetLoadedViaImport(href)) {
                        resolve();
                    } else if (Date.now() - startTime > timeout) {
                        reject(new Error(`Timeout waiting for stylesheet: ${href}`));
                    } else {
                        // Check again after a short delay
                        setTimeout(checkStylesheet, 50);
                    }
                }
            }

            function isStylesheetLoadedViaImport(href: string): boolean {
                const styleSheets = document.styleSheets;
                for (let i = 0; i < styleSheets.length; i++) {
                    try {
                        const rules = styleSheets[i].cssRules;
                        for (let j = 0; j < rules.length; j++) {
                            if ('href' in rules[j] && rules[j]["href"].startsWith(href)) {
                                return true;
                            }
                        }
                    } catch (e) {
                        console.warn("Can't read cross-origin stylesheet", styleSheets[i].href);
                    }
                }
                return false;
            }

            checkStylesheet();
        });
    }

    const cssLoaded = writable(false);

    onMount(async () => {
        await waitForStylesheet("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined")
        console.log('whooot')
        cssLoaded.set(true);
    });
</script>

{#if $cssLoaded}
    <slot name="content"></slot>
{:else}
    <slot name="loading"></slot>
{/if}