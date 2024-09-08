<script lang="ts">
    import {draggable, type DraggableOptions} from "../lib/draggable";
    export let options: DraggableOptions
</script>

<div class="border" use:draggable={options}>
    <div class="touchable"></div>
</div>

<style>
    .border {
        position: relative;
        width: 1px;
        height: 100%;
        top: 0;
        bottom: 0;
        background: var(--color-control);
    }

    .touchable {
        position: absolute;
        width: 21px;
        top: 0;
        right: 0;
        bottom: 0;
        margin-right: -11px;
        z-index: 10;
    }

    .touchable:hover,
    .touchable:active,
    .touchable:focus {
        cursor: ew-resize;
    }
</style>