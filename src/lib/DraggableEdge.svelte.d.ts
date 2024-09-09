import type {SvelteComponent} from "svelte";
import type {DraggableOptions} from "./types";

export interface DraggableEdgeProps {
    options: DraggableOptions | null
}

export default class DraggableEdge extends SvelteComponent<DraggableEdgeProps> {}