<script lang="ts">
    import type {FileDescriptor, FileGrouping, FileTreeContext, SortGroup} from "./types";
    import {getContext} from "svelte";
    import Checkbox from "./Checkbox.svelte";

    export let notSelectable = false;
    export let fileDesc: FileDescriptor;
    export let noActionsTransition = false
    export let selectionCount = 0

    const {sortItems, sortGroup} = getContext<FileTreeContext>("file-tree-context");

</script>

<div class="root">
    {#if !notSelectable}
        <Checkbox checked={true} on:checked/>
    {/if}
    <span class="selection"><code>{selectionCount}</code><b>Files selected</b></span>
    <div class="actions">
        <slot/>
    </div>
</div>

<style>
    * {
        box-sizing: border-box;
    }

    .root {
        position: relative;
        display: grid;
        grid-template-columns: min-content max-content 1fr;
        overflow: hidden;
        width: 100%;
        gap: 8px;
    }

    .selection {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
        width: 100%;
        height: 100%;
    }

    .actions {
        position: relative;
        width: 100%;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>