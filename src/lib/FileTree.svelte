<script lang="ts">
    import "./index.css"
    import type {
        FileDescriptor,
        LastItem,
        SelectedFile,
        SelectedFiles,
        FileTreeContext, ExpandedFolders, ExpandedFolder, FileGrouping, FileGroup, SortGroup,
    } from "./types";
    import FileTreeItem from "./FileTreeItem.svelte";
    import {createEventDispatcher, setContext} from "svelte";
    import ItemRenderer from "./ItemRenderer.svelte";
    import {writable} from "svelte/store";
    import SelectionBar from "./SelectionBar.svelte";
    import MenuBar from "./ActionBar.svelte";
    import {orderItems} from "./utils";

    export let fileDesc: FileDescriptor;
    export let selectedFiles: SelectedFiles = {};
    export let fileGrouping: FileGrouping | undefined = undefined

    export let notSelectable = false;
    export let noMenuBar = false;
    export let lastItem: LastItem = null;
    export let noFolderClick = false;
    export let noIndentation = false

    const expandedItems = writable<Array<string>>([])
    const sortGroup = writable<SortGroup | undefined>(undefined)

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

    function collapseFolders(...items: Array<string>) {
        expandedItems.update(state => state.filter(value => !items.includes(value)))
    }

    function sortItems(group: SortGroup) {
        sortGroup.set(group)
    }

    setContext<FileTreeContext>("file-tree-context", {
        selectItems,
        deselectItems,
        expandFolders,
        collapseFolders,
        sortItems,
        sortGroup,
        expandedItems
    });

    $: selectedFilesCount = Object.keys(selectedFiles).length;
    $: displayKeys = fileGrouping ? Object.keys(fileGrouping) : []
</script>

<div class="root">
    {#if !noMenuBar}
        <div class="header">
            {#if !notSelectable && selectedFilesCount > 0}
                <SelectionBar>
                    <slot name="selection-actions"/>
                </SelectionBar>
            {:else}
                <MenuBar folderName={fileDesc.name} {fileGrouping}/>
            {/if}
        </div>
    {/if}
    <div class="inner">
        {#if fileDesc?.children?.length}
            {#key `${fileDesc.id}#${fileDesc.selected}`}
                <div class="files">
                    <ul>
                        {#each orderItems(fileDesc.children, $sortGroup)  as child}
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
                                            {displayKeys}
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
        --sly-color-metadata: rgba(75, 218, 237, 0.6);
        --sly-color-on-metadata: white;
        --sly-color-header: transparent;
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
        background: var(--sly-color-header);
        border-bottom: 1px solid var(--sly-color-control);
    }

    ul,
    li {
        list-style: none;
        padding: 0;
        margin: 0;
        color: var(--color-on-secondary);
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
