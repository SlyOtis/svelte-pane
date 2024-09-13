import {type Writable, writable} from "svelte/store";
import type {FileDescriptor, HighlightedItem, ItemExpandedState} from "./types";
import {getContext, setContext} from "svelte";

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