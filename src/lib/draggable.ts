import type {DraggableOptions} from "./types";

/**
 * Svelte directive to make an element draggable
 * @param node The DOM element to make draggable
 * @param options Configuration options for the draggable behavior
 */
function draggable(
    node: HTMLElement,
    options: DraggableOptions = {
        property: "--sidebar-width",
        anchor: "right",
        gridSelector: ".pane-grid-container",
    },
) {
    let startCor = 0,
        maxCor: string,
        minCor: string,
        curCor: string;

    let property: string = options.property
    let gridSelector: string = options.gridSelector // TODO:: Add optionals here
    let anchor = options?.anchor || "right";
    let corDir = anchor === "left" || anchor === "bottom" ? -1 : 1;
    let onDrag: (event: PointerEvent) => any;

    function onDragStart(event: PointerEvent) {
        document.body.style.userSelect = "none";
        document.body.style.pointerEvents = "none";
        document.body.style.cursor = "ew-resize";

        const style = getComputedStyle(document.documentElement);
        maxCor = style.getPropertyValue(property + "-max") || "0px";
        minCor = style.getPropertyValue(property + "-min") || "0px";
        curCor = style.getPropertyValue(property) || "0px";

        const gridEl = node.closest(gridSelector) as HTMLElement;
        if (!gridEl) {
            throw Error(`missing grid parent ${gridSelector}`);
        }

        switch (anchor) {
            case "left":
            case "right":
                startCor = event.clientX;
                onDrag = (event: PointerEvent) => {
                    gridEl.style.setProperty(
                        property,
                        `clamp(${minCor}, calc(${curCor} + (${event.clientX} - ${startCor}) * ${corDir}), ${maxCor})`,
                    );
                };
                break;
            case "top":
            case "bottom":
                startCor = event.clientY;
                onDrag = (event: PointerEvent) => {
                    gridEl.style.setProperty(
                        property,
                        `clamp(${minCor}, calc(${curCor} + (${event.clientY} - ${startCor}) * ${corDir}), ${maxCor})`,
                    );
                };
                break;
        }

        window.addEventListener("pointercancel", onDragEnd);
        window.addEventListener("pointerleave", onDragEnd);
        window.addEventListener("pointerup", onDragEnd);
        window.addEventListener("pointermove", onDrag);
    }

    function onDragEnd() {
        document.body.style.userSelect = "";
        document.body.style.pointerEvents = "";
        document.body.style.cursor = "";

        window.removeEventListener("pointercancel", onDragEnd);
        window.removeEventListener("pointerleave", onDragEnd);
        window.removeEventListener("pointerup", onDragEnd);
        window.removeEventListener("pointermove", onDrag);
    }

    function update(options: DraggableOptions) {
        property = options.property
        gridSelector = options.gridSelector // TODO:: Add optionals here
        anchor = options?.anchor || "right";
        corDir = anchor === "left" || anchor === "bottom" ? -1 : 1;
    }

    update(options)
    node.addEventListener("pointerdown", onDragStart);

    return {
        update,
        destroy() {
            node.removeEventListener("pointerdown", onDragStart);
        },
    };
}

function onDragX(
    curX: number,
    startCor: number,
    curCor: string,
    maxCor: string,
    minCor: string,
    corDir: number,
    property: string,
) {

}

function onDragY(
    curY: number,
    startCor: number,
    curCor: string,
    maxCor: string,
    minCor: string,
    corDir: number,
    property: string,
) {
    document.documentElement.style.setProperty(
        property + "_calc",
        `clamp(${minCor}, calc(${curCor}px + ${curY - startCor}px * ${corDir}), ${maxCor})`,
    );
}

export default draggable;
