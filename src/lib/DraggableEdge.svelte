<script lang="ts">
    import "./edge.css"
    import draggable from "./draggable";
    import type {DraggableOptions} from "./types";
    export let options: DraggableOptions | null = null

</script>

{#if options}
    <div class="sly-draggable-edge-root" use:draggable={options}>
        <div class="sly-draggable-edge-touchable"></div>
    </div>
{:else}
    <div class="sly-draggable-edge-root" on:pointerdown>
        <div class="sly-draggable-edge-touchable"></div>
    </div>
{/if}