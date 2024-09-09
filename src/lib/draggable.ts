import type {DraggableAnchor, DraggableOptions} from "./types";

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

        const gridEl = node.closest(gridSelector) as HTMLElement;
        if (!gridEl) {
            throw Error(`missing grid parent ${gridSelector}`);
        }

        const style = window.getComputedStyle(gridEl);
        maxCor = style.getPropertyValue(property + "-max") || "0px";
        minCor = style.getPropertyValue(property + "-min") || "0px";
        curCor = style.getPropertyValue(property) || "0px";

        switch (anchor) {
            case "left":
            case "right":
                startCor = event.clientX;
                onDrag = (event: PointerEvent) => {
                    gridEl.style.setProperty(
                        property + "_calc",
                        `calc(${curCor} + (${event.clientX}px - ${startCor}px) * ${corDir})`,
                    );
                    gridEl.style.setProperty(
                        property,
                        `clamp(${minCor}, var(${property}_calc), ${maxCor})`,
                    );
                };
                break;
            case "top":
            case "bottom":
                startCor = event.clientY;
                onDrag = (event: PointerEvent) => {
                    gridEl.style.setProperty(
                        property + "_calc",
                        `calc(${curCor} + (${event.clientY}px - ${startCor}px) * ${corDir})`,
                    );
                    gridEl.style.setProperty(
                        property,
                        `clamp(${minCor}, var(${property}_calc), ${maxCor})`,
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

        const gridEl = node.closest(gridSelector) as HTMLElement;
        if (!gridEl) {
            throw Error(`Missing grid parent ${gridSelector}`);
        }

        const gridIndex = getGridIndex(node, gridEl);
        const endCor = getGridTemplate(gridEl, anchor)[gridIndex]

        gridEl.style.setProperty(property, endCor);
        gridEl.style.removeProperty(`${property}_calc`);

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

function getGridIndex(startEl: HTMLElement, gridEl: HTMLElement): number {
    let directChild = startEl;
    while (directChild.parentElement !== gridEl) {
        if (directChild.parentElement) {
            directChild = directChild.parentElement;
        } else {
            throw Error('Node is not a descendant of gridEl');
        }
    }

    const childIndex = Array.from(gridEl.children).indexOf(directChild)

    if (childIndex < 0) {
        throw Error('Node is not a descendant of gridEl');
    }

    return childIndex;
}

function getGridTemplate(gridEl: HTMLElement, anchor: DraggableAnchor): string[] {
    const style = window.getComputedStyle(gridEl)
    switch (anchor) {
        case "left":
        case "right":
            return style.gridTemplateColumns.split(" ")
        case "top":
        case "bottom":
            return style.gridTemplateRows.split(" ")
    }
}

export default draggable;
