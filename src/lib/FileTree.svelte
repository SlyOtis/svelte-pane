<script lang="ts">
    import "./fileTree.css"
    import type {
        FileDescriptor,
        LastItem,
        SelectedFile,
        SelectedFiles,
        FileTreeContext,
        FileGrouping,
        SortGroup,
        DisplayValueTransformer,
    } from "./types";
    import FileTreeItem from "./FileTreeItem.svelte";
    import {setContext} from "svelte";
    import ItemRenderer from "./ItemRenderer.svelte";
    import {writable} from "svelte/store";
    import SelectionBar from "./SelectionBar.svelte";
    import MenuBar from "./ActionBar.svelte";
    import {orderItems, reduceSelectedItems} from "./utils";
    import SizeWatcher from "./SizeWatcher.svelte";
    import scrollMeasure from "./useScrollMeasure";
    import {metadataGrid} from "./useMetadataSize";

    export let fileDesc: FileDescriptor;
    export let selectedFiles: SelectedFiles = {};
    export let fileGrouping: FileGrouping | undefined = undefined
    export let notSelectable = false;
    export let noMenuBar = false;
    export let lastItem: LastItem = null;
    export let noFolderClick = false;
    export let noIndentation = false
    export let noActionsTransition = false
    export let metadataAsTags = false

    let isFontsLoaded = false

    const expandedItems = writable<Array<string>>([])
    const sortGroup = writable<SortGroup | undefined>(undefined)

    function onFontsLoaded(e: any) {
        console.log(e)
        document.fonts.ready.then(() => {
            console.log('ready')
            isFontsLoaded = true
        })
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

    function getValueTransformer(metadataKey: string): DisplayValueTransformer<any> | undefined {
        if (!fileGrouping) {
            return undefined
        }

        return fileGrouping?.[metadataKey]?.displayValue
    }

    function onSelectAll(e: CustomEvent<boolean>) {
        fileDesc.selected = e.detail;
        const items = reduceSelectedItems(fileDesc);
        if (fileDesc.selected) {
            selectItems(...items);
        } else {
            deselectItems(...items);
        }
    }

    setContext<FileTreeContext>("file-tree-context", {
        selectItems,
        deselectItems,
        expandFolders,
        collapseFolders,
        sortItems,
        getValueTransformer,
        sortGroup,
        expandedItems
    });

    $: selectionCount = Object.keys(selectedFiles).length;
    $: displayKeys = fileGrouping ? Object.keys(fileGrouping) : []
</script>

<svelte:head>
    <link
            rel="stylesheet"
            type="text/css"
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
            on:load={onFontsLoaded}
    >
</svelte:head>

<SizeWatcher>
    <slot name="item-actions" data={fileDesc}></slot>
</SizeWatcher>

{#if isFontsLoaded}
    <div class="sly-file-tree" use:scrollMeasure={".inner > .files"} use:metadataGrid>
        {#if !noMenuBar}
            <div class="header">
                {#if !notSelectable && selectionCount > 0}
                    <SelectionBar
                            on:checked={onSelectAll}
                            {selectionCount}
                            {selectedFiles}
                    >
                        <slot name="selection-actions" data={selectedFiles}/>
                    </SelectionBar>
                {:else}
                    <MenuBar
                            on:checked={onSelectAll}
                            folderName={fileDesc.name}
                            {fileGrouping}
                            {notSelectable}
                            {fileDesc}
                    />
                {/if}
            </div>
        {/if}
        <div class="inner">
            {#if fileDesc?.children?.length}
                {#key `${fileDesc.id}#${fileDesc.selected}`}
                    <div class="files">
                        <ul>
                            {#each orderItems(fileDesc.children, $sortGroup) as child}
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
                                                {noActionsTransition}
                                                {metadataAsTags}
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
{:else }
    <div class="sly-file-tree loading">
        <slot name="loading" data={fileDesc}></slot>
    </div>
{/if}
