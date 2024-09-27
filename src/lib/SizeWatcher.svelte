<script lang="ts">
    import { onMount, afterUpdate, createEventDispatcher, onDestroy } from 'svelte';

    export let property = '--sly-tree-item-actions-size'; // name of the CSS variable to update
    export let defaultWidth = 0; // default width to use if slot is empty
    export let isSizeMeasured = false

    let slotElement: HTMLDivElement;
    let iconElement: HTMLElement;
    let width = defaultWidth;

    const dispatch = createEventDispatcher();

    const iconObserver = new ResizeObserver(entries => {
        // TODO:: Figure out a better way to do this -.-
        if (entries[0].contentRect.width === 48) {
            dispatch('end-measure')
            console.log('end measure bby')
            isSizeMeasured = true
        }
    });

    const slotObserver = new ResizeObserver(measureWidth)

    onMount(() => {
        slotObserver.observe(slotElement)
        iconObserver.observe(iconElement)
    });

    afterUpdate(() => {
        measureWidth();
    });

    onDestroy(() => {
        iconObserver.disconnect();
        slotObserver.disconnect();
    });

    function measureWidth() {
        if (slotElement) {
            const newWidth = slotElement.offsetWidth
            if (newWidth !== width) {
                width = newWidth
                updateCSSVariable(width)
            }
        } else {
            width = defaultWidth;
            updateCSSVariable(width);
        }
    }

    function updateCSSVariable(value: number) {
        if (slotElement.parentElement) {
            slotElement.parentElement.style.setProperty(property, `${value}px`);
        }
    }

</script>

<div class="size-watcher" bind:this={iconElement}>
    <span class="material-symbols-outlined">deleted</span>
</div>

<div class="size-watcher" bind:this={slotElement}>
    <slot></slot>
</div>

<style>
    .size-watcher {
        position: absolute !important;
        visibility: hidden !important;
        top: 0 !important;
        left: 0 !important;
        width: min-content !important;
        height: auto !important;
        overflow: visible !important;
        contain: none !important;
        margin: 0 !important;
        padding: 0 !important;
        display: flex !important;
        justify-content: start !important;
        align-items: center !important;
    }
</style>