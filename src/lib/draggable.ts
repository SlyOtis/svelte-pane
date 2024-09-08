/**
 * Svelte directive to make an element draggable
 * @param node The DOM element to make draggable
 * @param options Configuration options for the draggable behavior
 */
export function draggable(
  node: any,
  options: DraggableOptions = {
    property: "--sidebar-width",
    min: 100,
    max: 500,
  },
) {
  let startX = 0,
    startValue = 0;
  const direction = (options?.direction || "ltr") === "rtl" ? -1 : 1;

  function onDragStart(event: PointerEvent) {
    document.body.style.userSelect = "none";
    document.body.style.pointerEvents = "none";
    document.body.style.cursor = "ew-resize";

    startX = event.clientX;
    const style = getComputedStyle(document.documentElement);
    startValue = parseInt(style.getPropertyValue(options.property)) || 0;

    window.addEventListener("pointercancel", onDragEnd);
    window.addEventListener("pointerleave", onDragEnd);
    window.addEventListener("pointerup", onDragEnd);
    window.addEventListener("pointermove", onDrag);
  }

  function onDrag(event: PointerEvent) {
    const dx = event.clientX - startX;
    let newValue = startValue + dx * direction;
    newValue = Math.max(options.min, Math.min(options.max, newValue));
    document.documentElement.style.setProperty(
      options.property,
      `${newValue}px`,
    );
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

  node.addEventListener("pointerdown", onDragStart);

  return {
    destroy() {
      node.removeEventListener("pointerdown", onDragStart);
    },
  };
}
