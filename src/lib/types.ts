
export type DraggableAnchor = "left" | "right" | "top" | "bottom"
/**
 * Configuration options for the draggable directive
 */
export type DraggableOptions = {
  /** CSS custom variable property to be updated */
  property: string;
  /** Placement of the draggable element within its parent, default: 'right' */
  anchor?: DraggableAnchor;
  /** Nearest grid parent class name */
  gridSelector: string;
};
