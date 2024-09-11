import FileTree from "./FileTree.svelte";
import FileTreeItem from "./FileTreeItem.svelte";
import type { FileDescriptor, HighlightedItem } from "./types";
import { getContext, setContext } from "svelte";
import { type Writable, writable } from "svelte/store";

export type * from "./types";

export { FileTreeItem, FileTree, defaultFileTree };

export default FileTree;

const highlightedState = writable<HighlightedItem>();

export function setHighlightContext() {
  setContext("highlightItem", highlightedState);
  return {
    highlightItem: (
      fileDesc: FileDescriptor | undefined | null,
      style?: string,
    ) => {
      highlightedState.set({
        highlightItem: fileDesc,
        highlightStyle: style,
      });
    },
  };
}

export function getHighlightContext() {
  return getContext<Writable<HighlightedItem>>("highlightItem");
}
