export * from "./types";

/**
 * A Svelte component representing a draggable edge.
 * @component
 */
export {default as DraggableEdge} from "./DraggableEdge.svelte";

/**
 * A Svelte action to make an element draggable.
 * @function
 * @param {HTMLElement} node - The DOM element to make draggable.
 * @param {DraggableOptions} options - Configuration options for the draggable behavior.
 */
export {default as draggable } from "./draggable";
