export * from "./types";

import { default as DraggableEdge } from "./DraggableEdge.svelte";
import draggable from "./draggable";

/**
 * A Svelte component representing a draggable edge.
 * @component
 */
export { DraggableEdge };

/**
 * A Svelte action to make an element draggable.
 * @function
 * @param {HTMLElement} node - The DOM element to make draggable.
 * @param {DraggableOptions} options - Configuration options for the draggable behavior.
 */
export { draggable };
