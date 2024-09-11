
import FileTreeItem from "./FileTreeItem.svelte";
import FileTree from "./FileTree.svelte";
import {getHighlightContext, setHighlightContext} from "./store";

export type * from "./types";

export {
  FileTreeItem,
  FileTree,
  getHighlightContext,
  setHighlightContext
};

export default FileTree;
