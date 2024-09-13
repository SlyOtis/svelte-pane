<script lang="ts">
    import "./index.css"
    import type {
        FileDescriptor, LastItem,
        SelectedFile,
        SelectedFiles,
        FileTreeContext, FileMetadata,
    } from "./types";
    import {createEventDispatcher, getContext} from "svelte";
    import Checkbox from "./Checkbox.svelte";
    import {css, orderItems} from "./utils";
    import {getHighlightContext} from "./index";
    import ItemRenderer from "./ItemRenderer.svelte";

    export let fileDesc: FileDescriptor;
    export let depth = 0;
    export let notSelectable = false;
    export let lastItem: LastItem = null;
    export let noFolderClick = false;
    export let noIndentation = false;
    export let displayKeys: Array<string> = []

    const dispatch = createEventDispatcher();

    function getIcon(is_expanded: boolean, descriptor: FileDescriptor) {
        if (/\bfolder\b/i.test(descriptor.mimeType)) {
            return is_expanded ? "folder_open" : "folder"
        }


        if (/\bpdf\b/i.test(descriptor.mimeType)) {
            return "picture_as_pdf";
        }

        if (/\bimage\b/i.test(descriptor.mimeType)) {
            return "image";
        }

        if (
            /^application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document$/i.test(
                descriptor.mimeType,
            )
        ) {
            return "description";
        }

        return "folder";
    }

    const {
        selectItems,
        deselectItems,
        expandFolders,
        collapseFolders,
        expandedItems,
        sortGroup
    } = getContext<FileTreeContext>("file-tree-context");

    $: isExpanded = $expandedItems.includes(fileDesc.id)

    function onItemClick() {
        if (fileDesc.mimeType === "folder") {
            if (isExpanded) {
                collapseFolders(fileDesc.id)
            } else {
                expandFolders(fileDesc.id)
            }

            if (!noFolderClick) {
                dispatch("click", fileDesc);
            }
        } else {
            dispatch("click", fileDesc);
        }
    }

    function onItemSelected(e: CustomEvent<boolean>) {
        fileDesc.selected = e.detail;
        dispatch("selected", fileDesc);

        const items = reduceItem(fileDesc);
        if (fileDesc.selected) {
            selectItems(...items);
        } else {
            deselectItems(...items);
        }
    }

    function reduceItem(start: FileDescriptor): Array<SelectedFile> {
        const _items: Array<SelectedFile> = [
            {
                id: start.id,
                name: start.name,
                metadata: start.metadata,
                mimeType: start.mimeType,
                path: start.path,
                href: start.href,
            },
        ];

        if (!start?.children?.length) {
            return _items;
        }

        for (const item of start.children) {
            _items.push(...reduceItem(item));
        }

        return _items;
    }

    const highlightContext = getHighlightContext();

    $: indentedStyle = !noIndentation ? css`
        padding-left: calc(16px * ${depth + 1});
    ` : '';

    let itemStyle = indentedStyle;

    $: {
        if (
            $highlightContext?.highlightItem?.id == fileDesc.id &&
            $highlightContext?.highlightStyle
        ) {
            itemStyle = `${indentedStyle}${$highlightContext?.highlightStyle}`;
        } else {
            itemStyle = indentedStyle;
        }
    }

    $: icon = getIcon(isExpanded, fileDesc);

    let fileMetadata: Array<FileMetadata & { key: string }>
    $: {
        fileMetadata = []
        if (fileDesc.metadata) {
            Object.keys(fileDesc.metadata).forEach(key => {
                const data = fileDesc.metadata!![key]
                if (!data.hidden && displayKeys.includes(key)) {
                    fileMetadata.push({...data, key})
                }
            })
        }
    }

</script>

<ul class="root">
    <li class="tree-item" style={itemStyle}>
        <div class="start">
            {#if !notSelectable}
                <Checkbox checked={fileDesc.selected} on:checked={onItemSelected}/>
            {/if}
        </div>
        <button on:click={onItemClick} class="name">
            <span class="material-symbols-outlined">{icon}</span>
            <span>{fileDesc.name}</span>
        </button>
        {#if fileMetadata.length}
            <ul class="metadata">
                {#each fileMetadata as metadata}
                    <li class="metadata-{metadata.key}">
                        <span class="name">{metadata.name}</span>
                        <span class="value">{metadata.value}</span>
                    </li>
                {/each}
            </ul>
        {/if}
        <div class="end">
            <slot name="item-actions" data={fileDesc}></slot>
        </div>
    </li>
    {#if fileDesc.children && isExpanded}
        {#each orderItems(fileDesc.children, $sortGroup) as child}
            {@const childDesc = {...child, selected: fileDesc.selected, expanded: isExpanded}}
            {#key `${childDesc.id}#${childDesc.selected}`}
                <li>
                    <svelte:self
                            fileDesc={childDesc}
                            depth={depth + 1}
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
                    </svelte:self>
                </li>
            {/key}
        {/each}
        {#if lastItem && fileDesc.mimeType === "folder"}
            <li
                    class="last-item"
            >
                <ItemRenderer {fileDesc} item={lastItem} depth={depth}>
                    <slot name="item-loading" slot="loading" data={fileDesc}></slot>
                    <slot name="item-no-content" slot="no-content" data={fileDesc}></slot>
                </ItemRenderer>
            </li>
        {/if}
    {/if}
</ul>

<style>
    * {
        box-sizing: border-box;
        border-collapse: collapse;
    }

    ul,
    li {
        position: relative;
        list-style: none;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        color: var(--sly-color-on-content);
        background: var(--sly-color-content);
    }


    .tree-item {
        position: relative;
        display: flex;
        justify-content: start;
        align-items: center;
        width: 100%;
        height: auto;
        padding: 8px 16px;
        overflow: hidden;
        box-sizing: border-box;
        border-bottom: 1px solid var(--sly-color-control);
    }

    .tree-item:hover {
        color: var(--sly-color-on-hover);
        background-color: var(--sly-color-hover);
    }

    .tree-item > .name {
        position: relative;
        display: flex;
        justify-content: start;
        align-items: center;
        width: 100%;
        gap: 8px;
    }

    .tree-item > .start, .tree-item > .end {
        position: relative;
        display: flex;
        justify-content: start;
        align-items: center;
    }

    .tree-item > .metadata {
        position: relative;
        display: flex;
        justify-content: end;
        align-items: center;
        padding: 0 16px;
        overflow: hidden;
    }

    .metadata > li {
        position: relative;
        width: auto;
        border: 8px;
        background: var(--sly-color-metadata);
        color: var(--sly-color-on-metadata);
        padding: 2px 6px;
        border-radius: 12px;
        font-size: 0.7em;
        display: flex;
        justify-content: center;
        align-items: center;
        vertical-align: middle;
    }

    .metadata > li > .name {
        font-weight: 600;
        padding-right: 4px;
    }

    button {
        background: none;
        color: inherit;
        outline: none;
        border: none;
        cursor: pointer;
    }

    .last-item {
        border-bottom: 1px solid var(--sly-color-control);
    }
</style>
