<script lang="ts">
    import "./index.css"
    import type {
        FileDescriptor,
        LastItem,
        SelectedFile,
        SelectedFiles,
        FileTreeContext, ExpandedFolders, ExpandedFolder,
    } from "./types";
    import FileTreeItem from "./FileTreeItem.svelte";
    import {createEventDispatcher, setContext} from "svelte";
    import ItemRenderer from "./ItemRenderer.svelte";
    import {writable} from "svelte/store";

    export let fileDesc: FileDescriptor;
    export let selectedFiles: SelectedFiles = {};

    export let notSelectable = false;
    export let noMenuBar = false;
    export let lastItem: LastItem = null;
    export let noFolderClick = false;
    export let noIndentation = false

    let expandedItems = writable<Array<string>>([])

    const dispatch = createEventDispatcher();

    function onDeselect() {
        selectedFiles = {};
        fileDesc.selected = false;
    }

    function onDelete() {
    }

    function onTag() {
    }

    function onArchive() {
    }

    function selectItems(...items: Array<SelectedFile>) {
        for (const item of items) {
            if (item.mimeType !== "folder") {
                selectedFiles[item.id] = item;
            }
        }
    }

    function deselectItems(...items: Array<SelectedFile>) {
        for (const item of items) {
            delete selectedFiles[item.id];
        }
        selectedFiles = selectedFiles;
    }

    function expandFolders(...items: Array<string>) {
        expandedItems.update(state => ([...state, ...items]))
    }

    function collapseItems(...items: Array<string>) {
        expandedItems.update(state => state.filter(value => !items.includes(value)))
    }

    setContext<FileTreeContext>("file-tree-context", {
        selectItems,
        deselectItems,
        expandFolders,
        collapseFolders: collapseItems,
        expandedItems
    });

    $: selectedFilesCount = Object.keys(selectedFiles).length;
</script>

<div class="root">
    {#if !noMenuBar}
        <div class="header">
            <span><b>{fileDesc.name}</b></span>
            <ul>
                {#if selectedFilesCount > 0 && !notSelectable}
                    <li>
                        <button on:click={onDeselect}>
                            <span class="text"><b>{selectedFilesCount}</b></span
                            >
                            <span class="material-symbols-outlined"
                            >select_check_box</span
                            >
                            <span class="text">Deselect</span>
                        </button>
                    </li>
                {/if}
                <li>
                    <button>
                        <span class="material-symbols-outlined">archive</span>
                        <span class="text">Archive</span>
                    </button>
                </li>
                <li>
                    <button>
                        <span class="material-symbols-outlined">tag</span>
                        <span class="text">Tag</span>
                    </button>
                </li>
                <li>
                    <button>
                        <span class="material-symbols-outlined">delete</span>
                        <span class="text">Delete</span>
                    </button>
                </li>
            </ul>
        </div>
    {/if}
    <div class="inner">
        {#if fileDesc?.children?.length}
            {#key `${fileDesc.id}#${fileDesc.selected}`}
                <div class="files">
                    <ul>
                        {#each fileDesc.children as child}
                            {@const childDesc = {
                                ...child,
                                selected: fileDesc.selected,
                            }}
                            {#key `${childDesc.id}#${childDesc.selected}`}
                                <li>
                                    <FileTreeItem
                                            fileDesc={childDesc}
                                            on:click
                                            on:selected
                                            {notSelectable}
                                            {lastItem}
                                            {noFolderClick}
                                            {noIndentation}
                                    >
                                        <slot name="item-loading" slot="item-loading" data={fileDesc}></slot>
                                        <slot name="item-actions" slot="item-actions" data={fileDesc}></slot>
                                        <slot name="item-no-content" slot="item-no-content" data={fileDesc}></slot>
                                    </FileTreeItem>
                                </li>
                            {/key}
                        {/each}
                        {#if lastItem}
                            <li class="last-item">
                                <ItemRenderer {fileDesc} item={lastItem}>
                                    <slot name="item-loading" slot="loading" data={fileDesc}></slot>
                                    <slot name="item-no-content" slot="no-content" data={fileDesc}></slot>
                                </ItemRenderer>
                            </li>
                        {/if}
                    </ul>
                </div>
            {/key}
        {:else}
            <div class="empty-list">
                <slot name="empty-list" data={fileDesc}></slot>
            </div>
        {/if}
    </div>
</div>

<style>
    * {
        box-sizing: border-box;
    }

    :root {
        --sly-color-control: gray;
        --sly-color-content: transparent;
        --sly-color-no-content: gray;
        --sly-color-hover: gray;
        --sly-color-select: gray;
        --sly-color-on-content: white;
        --sly-color-on-hover: white;
        --sly-color-on-select: white;
    }

    .root {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: start;
        align-items: start;
        flex-direction: column;
    }

    .header {
        position: relative;
        width: 100%;
        height: auto;
        padding: 8px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        background: var(--color-secondary);
    }

    .header > ul {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        gap: 16px;
    }

    ul,
    li {
        list-style: none;
        padding: 0;
        margin: 0;
        color: var(--color-on-secondary);
    }

    button {
        position: relative;
        border-radius: 50%;
        width: auto;
        height: 24px;
        border: none;
        outline: none;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        gap: 8px;
        background: none;
        color: inherit;
    }

    button > .text {
        font-size: 0.8em;
    }

    button:hover {
        cursor: pointer;
        color: var(--color-primary);
    }

    .inner {
        position: relative;
        display: flex;
        justify-content: start;
        align-items: start;
        width: 100%;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .files {
        position: relative;
        display: flex;
        justify-content: start;
        align-items: center;
        width: 100%;
        height: auto;
    }

    .files > ul,
    .files > ul > li {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .last-item {
        position: relative;
        display: flex;
        justify-content: start;
        align-items: center;
        width: 100%;
        height: auto;
    }
</style>
