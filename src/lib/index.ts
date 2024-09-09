export * from "./types";

/**
 * Draggable border for controlling the size of a {@link Pane} in a {@link PaneGrid}
 */
import DraggableEdge from "./DraggableEdge.svelte";

/**
 * A directive for making elements draggable, typically used with {@link DraggableEdge}
 */
import draggable from "./draggable";

// Export components and directive for use in other Svelte applications
export { DraggableEdge, draggable };

// This package provides a flexible pane system for Svelte applications
// Use PaneGrid as a container, Pane for individual panels, and DraggableEdge for resizable borders
// The draggable directive can be used for custom draggable elements
