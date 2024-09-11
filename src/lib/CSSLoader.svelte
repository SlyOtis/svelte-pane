<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import {waitForStylesheet} from "./utils";

    const cssLoaded = writable(false);

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