<script lang="ts">
    import { onMount, afterUpdate, createEventDispatcher, onDestroy } from 'svelte';

    export let property = '--sly-tree-item-actions-size'; // name of the CSS variable to update
    export let defaultWidth = 0; // default width to use if slot is empty

    let slotElement: HTMLDivElement;
    let parentElement: HTMLElement;
    let width = defaultWidth;
    let parentWidth = 0;
    let parentHeight = 0;

    const dispatch = createEventDispatcher();

    let resizeObserver: ResizeObserver;

    onMount(() => {
        measureWidth();
        setupParentObserver();
        updateCSSVariable(width);
    });

    afterUpdate(() => {
        measureWidth();
    });

    onDestroy(() => {
        if (resizeObserver) {
            resizeObserver.disconnect();
        }
    });

    function measureWidth() {
        if (slotElement) {
            const newWidth = slotElement.offsetWidth;
            if (newWidth !== width) {
                width = newWidth;
                updateCSSVariable(width);
                dispatch('widthchange', {width});
            }
        } else {
            width = defaultWidth;
            updateCSSVariable(width);
            dispatch('widthchange', {width});
        }
    }

    function updateCSSVariable(value: number) {
        if (parentElement) {
            parentElement.style.setProperty(property, `${value}px`);
        }
    }

    function setupParentObserver() {
        if (slotElement && slotElement.parentElement) {
            parentElement = slotElement.parentElement;
            resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    if (entry.target === parentElement) {
                        parentWidth = entry.contentRect.width;
                        parentHeight = entry.contentRect.height;
                        dispatch('parentresize', { width: parentWidth, height: parentHeight });
                        measureWidth()
                    }
                }
            });
            resizeObserver.observe(parentElement);
        }
    }

    $: console.log(width)
</script>

<div class="size-watcher" bind:this={slotElement}>
    <slot></slot>
</div>

<style>
    .size-watcher {
        position: absolute !important;
        visibility: hidden !important;
        top: 0 !important;
        left: 0 !important;
        width: auto !important;
        height: auto !important;
        overflow: visible !important;
        contain: none !important;
    }
</style>