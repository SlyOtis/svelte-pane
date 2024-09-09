<script lang="ts">
    import type {DraggableOptions} from "./types";

    function update(node: HTMLElement, options: DraggableOptions) {
        const gridEl = node.closest(options.gridSelector) as HTMLElement;
        if (!gridEl) {
            throw Error(`missing grid parent ${options.gridSelector}`);
        }

        const style = getComputedStyle(gridEl);
        if (style.getPropertyValue(options.property + "_calc").length <= 0) {
            switch (anchor) {
                case "left":
                    node.style.display = "grid";
                    node.style.setProperty(
                        `${options.property}_calc`,
                        `auto ${style.gridTemplateRows}`,
                    );
                    break;
                case "right":
                    node.style.display = "grid";
                    node.style.setProperty(
                        `${options.property}_calc`,
                        `${style.gridTemplateRows} auto`,
                    );
                    break;
                case "top":
                    node.style.display = "grid";
                    node.style.setProperty(
                        `${options.property}_calc`,
                        `auto ${style.gridTemplateColumns}`,
                    );
                    break;
                case "bottom":
                    node.style.display = "grid";
                    node.style.setProperty(
                        `${options.property}_calc`,
                        `${style.gridTemplateColumns} auto`,
                    );
                    break;
            }
            gridEl.style.setProperty(options.property, `var(${options.property}_calc)`);
        }
    }
</script>

<script lang="ts">
    import type {DraggableOptions} from "./types";
    import DraggableEdge from "./DraggableEdge.svelte";

    export let as: keyof HTMLElementTagNameMap = 'div';
    export let options: DraggableOptions = {
        property: "--sidebar-width",
        anchor: "right",
        gridSelector: ".pane-grid",
    }

    function update(node: HTMLElement, options: DraggableOptions) {
        // ... existing update function code ...
    }
</script>

<svelte:element
        this={as}
        class="pane-grid"
        class:pane-grid-left={options.anchor === "left"}
        class:pane-grid-right={options.anchor === "right"}
        class:pane-grid-top={options.anchor === "top"}
        class:pane-grid-bottom={options.anchor === "bottom"}
>
    {#if options.anchor === "left" || options.anchor === "top"}
        <DraggableEdge {options} />
        <slot></slot>
    {:else}
        <slot></slot>
        <DraggableEdge {options} />
    {/if}
</svelte:element>

<style global>
    .pane-grid {
        position: relative;
        display: grid;

    }
    .pane-grid-left {

    }
    .pane-grid-right {

    }
    .pane-grid-bottom {

    }
    .pane-grid-top {

    }
</style>

