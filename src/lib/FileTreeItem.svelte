<script lang="ts">
    import "./fileTreeItem.css"
    import type {
        FileDescriptor,
        LastItem,
        SelectedFile,
        SelectedFiles,
        FileTreeContext,
        FileMetadata,
        KeyFileMetadata,
    } from "./types";
    import {createEventDispatcher, getContext} from "svelte";
    import Checkbox from "./Checkbox.svelte";
    import {css, orderItems, reduceSelectedItems} from "./utils";
    import {getHighlightContext} from "./index";
    import ItemRenderer from "./ItemRenderer.svelte";

    export let fileDesc: FileDescriptor;
    export let depth = 0;
    export let notSelectable = false;
    export let lastItem: LastItem = null;
    export let noFolderClick = false;
    export let noIndentation = false;
    export let displayKeys: Array<string> = []
    export let noActionsTransition = false

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
        getValueTransformer,
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

        const items = reduceSelectedItems(fileDesc);
        if (fileDesc.selected) {
            selectItems(...items);
        } else {
            deselectItems(...items);
        }
    }

    const highlightContext = getHighlightContext();

    $: indentedStyle = !noIndentation ? css`
        padding-left: calc(var(--sly-item-indentation) * ${depth + 1});
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

    let fileMetadata: Array<KeyFileMetadata<any>>
    $: {
        fileMetadata = []
        if (fileDesc.metadata) {
            Object.keys(fileDesc.metadata).forEach(key => {
                const data = fileDesc.metadata!![key] //TODO:: Hmm
                if (!data.hidden && displayKeys.includes(key)) {
                    if (!data.displayValue) {
                        data.displayValue = getValueTransformer(key) || ((value: any) => value)
                    }
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
        <ul class="metadata">
            {#if fileMetadata.length}
                {#each fileMetadata as metadata}
                    <li class="metadata-{metadata.key}">
                        <span class="name">{metadata.name}</span>
                        <span class="value">{metadata.displayValue(metadata.value)}</span>
                    </li>
                {/each}
            {/if}
        </ul>
        <div class="end" class:actions-transition={!noActionsTransition}>
            <div class="item-actions">
                <slot name="item-actions" data={fileDesc}></slot>
            </div>
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
</style>
