<script lang="ts">
    import Checkbox from "./Checkbox.svelte";
    import type {SelectedFiles} from "./types";
    export let selectionCount = 0
    export let selectedFiles: SelectedFiles
</script>

<div class="root">
    <Checkbox checked={true} on:checked/>
    <span class="selection"><code>{selectionCount}</code><b>Files selected</b></span>
    <div class="actions">
        <slot data={selectedFiles}/>
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