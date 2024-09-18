import FileTreeItem from "./FileTreeItem.svelte";
import FileTree from "./FileTree.svelte";
import {getHighlightContext, setHighlightContext} from "./store";
import {displayDateISO} from "./utils";

export type * from "./types";

export {
    FileTreeItem,
    FileTree,
    getHighlightContext,
    setHighlightContext,
    displayDateISO,
};

export default FileTree;
