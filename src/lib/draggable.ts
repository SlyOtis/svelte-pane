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

    let onDrag: (event: PointerEvent) => any;
    const anchor = options?.anchor || "right";
    const corDir = anchor === "left" || anchor === "bottom" ? -1 : 1;

    function onDragStart(event: PointerEvent) {
        document.body.style.userSelect = "none";
        document.body.style.pointerEvents = "none";
        document.body.style.cursor = "ew-resize";

        const style = getComputedStyle(document.documentElement);
        maxCor = style.getPropertyValue(options.property + "-max") || "0px";
        minCor = style.getPropertyValue(options.property + "-min") || "0px";
        curCor = style.getPropertyValue(options.property) || "0px";

        const gridEl = node.closest(options.gridSelector) as HTMLElement;
        if (!gridEl) {
            throw Error(`missing grid parent ${options.gridSelector}`);
        }

        switch (anchor) {
            case "left":
            case "right":
                startCor = event.clientX;
                onDrag = (event: PointerEvent) => {
                    gridEl.style.setProperty(
                        options.property + "_calc",
                        `clamp(${minCor}, calc(${curCor} + (${event.clientX} - ${startCor}) * ${corDir}), ${maxCor})`,
                    );
                };
                break;
            case "top":
            case "bottom":
                startCor = event.clientY;
                onDrag = (event: PointerEvent) => {
                    gridEl.style.setProperty(
                        options.property + "_calc",
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
        const gridEl = node.closest(options.gridSelector) as HTMLElement;
        if (!gridEl) {
            throw Error(`missing grid parent ${options.gridSelector}`);
        }

        const style = getComputedStyle(gridEl);
        console.log("calc", style.getPropertyValue(options.property + "_calc"))

        if (style.getPropertyValue(options.property + "_calc").length <= 0) {
            gridEl.style.setProperty(options.property, `var(${options.property}_calc)`);
        }
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
        `clamp(${minCor}, calc(${curCor} + ${curY - startCor} * ${corDir}), ${maxCor})`,
    );
}

export default draggable;
