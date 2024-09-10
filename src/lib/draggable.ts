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
    },
) {
    let startXY = 0,
        maxCor: string,
        minCor: string,
        curCor: string;

    let property: string = options.property
    let gridSelector: string | undefined = options.gridSelector // TODO:: Add optionals here
    let anchor = options?.anchor || "right";
    let corDir = anchor === "left" || anchor === "bottom" ? -1 : 1;
    let onDrag: (event: PointerEvent) => any;
    let dragTimeout: any = null

    function onDragStart(event: PointerEvent) {
        document.body.style.userSelect = "none";
        document.body.style.pointerEvents = "all";
        document.body.style.cursor = "ew-resize";

        const gridEl = getGridEl(node, gridSelector)

        const style = window.getComputedStyle(gridEl);
        maxCor = style.getPropertyValue(property + "-max") || "0px";
        minCor = style.getPropertyValue(property + "-min") || "0px";
        curCor = style.getPropertyValue(property) || "0px";

        switch (anchor) {
            case "left":
            case "right":
                startXY = event.clientX;
                onDrag = (e: PointerEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDragProperties(gridEl, property, e.clientX, startXY, curCor, corDir, maxCor, minCor)
                    clearTimeout(dragTimeout)
                    dragTimeout = setTimeout(onDragEnd, 5000)
                };
                break;
            case "top":
            case "bottom":
                startXY = event.clientY;
                onDrag = (e: PointerEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDragProperties(gridEl, property, e.clientY, startXY, curCor, corDir, maxCor, minCor)
                    clearTimeout(dragTimeout)
                    dragTimeout = setTimeout(onDragEnd, 5000)
                };
                break;
        }

        // If we loose the event ref this will clear it right up
        clearTimeout(dragTimeout)
        dragTimeout = setTimeout(onDragEnd, 5000)

        window.addEventListener("pointercancel", onDragEnd);
        window.addEventListener("lostpointercapture", onDragEnd);
        window.addEventListener("pointerleave", onDragEnd);
        window.addEventListener("pointerup", onDragEnd);
        window.addEventListener("pointermove", onDrag);
    }

    function onDragEnd(e?: PointerEvent) {
        e?.preventDefault();
        e?.stopPropagation();

        clearTimeout(dragTimeout)

        document.body.style.userSelect = "";
        document.body.style.pointerEvents = "";
        document.body.style.cursor = "";

        const gridEl = getGridEl(node, gridSelector)

        const gridIndex = getGridIndex(node, gridEl);
        const endCor = getGridTemplate(gridEl, anchor)[gridIndex]

        gridEl.style.setProperty(property, endCor);
        gridEl.style.removeProperty(`${property}_calc`);

        window.removeEventListener("pointercancel", onDragEnd);
        window.removeEventListener("lostpointercapture", onDragEnd);
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

function setDragProperties(gridEl: HTMLElement, property: string, curXY: number, startXY: number, curCor: string, corDir: number, maxCor: string, minCor: string) {
    gridEl.style.setProperty(
        property + "_calc",
        `calc(${curCor} + (${curXY}px - ${startXY}px) * ${corDir})`,
    );
    gridEl.style.setProperty(
        property,
        `clamp(${minCor}, var(${property}_calc), ${maxCor})`,
    );
}

function getGridEl(node: HTMLElement, gridSelector?: string): HTMLElement {
    const gridEl = gridSelector ? locateClosest(node, gridSelector) as HTMLElement : document.body;
    if (!gridEl) {
        throw Error(`Missing grid parent ${gridSelector}`);
    }
    return gridEl
}

function locateClosest(node: HTMLElement, selector: string): HTMLElement {
    if (node === document.body) {
        return node
    }

    if (node.matches(selector)) {
        return node
    }

    const parent = node.parentElement
    if (parent) {
        return locateClosest(parent, selector);
    }

    return document.body
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
