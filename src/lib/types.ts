/**
 * Configuration options for the draggable directive
 */
export type DraggableOptions = {
  /** CSS custom property to be updated */
  property: string;
  /** Minimum value for the draggable property in px */
  min: number;
  /** Maximum value for the draggable property in px */
  max: number;
  /** Placement of the draggable element within its parent */
  anchor?: "left" | "right" | "top" | "bottom";
};
