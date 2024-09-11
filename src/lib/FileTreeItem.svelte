<script lang="ts">
    import type {
        FileDescriptor,
        SelectedFile,
        SelectedFiles,
        SelectedFilesContext,
    } from "./types";
    import { FileTreeItem, getHighlightContext } from "./index.js";
    import { createEventDispatcher, getContext } from "svelte";
    import Checkbox from "../Checkbox.svelte";
    import { css } from "../../lib/utils";

    export let fileDesc: FileDescriptor;
    export let depth = 0;
    export let expanded = false;
    export let notSelectable = false;
    export let noLastItem = false;
    export let noFolderClick = false;

    const dispatch = createEventDispatcher();

    function getIcon(is_expanded: boolean, descriptor: FileDescriptor) {
        if (is_expanded) {
            return "folder_open";
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

    $: icon = getIcon(expanded, fileDesc);

    const { selectItems, deselectItems } =
        getContext<SelectedFilesContext>("selectedFiles");

    function onItemClick() {
        if (fileDesc.mimeType === "folder") {
            expanded = !expanded;

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
                size: start.size,
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

    $: indentedStyle = css`
        padding-left: calc(16px * ${depth + 1});
    `;
    let headerStyle = indentedStyle;
    $: {
        if (
            $highlightContext?.highlightItem?.id == fileDesc.id &&
            $highlightContext?.highlightStyle
        ) {
            headerStyle = `${indentedStyle}${$highlightContext?.highlightStyle}`;
        } else {
            headerStyle = indentedStyle;
        }
    }
</script>

<ul class="root">
    <li class="header" style={headerStyle}>
        {#if !notSelectable}
            <Checkbox checked={fileDesc.selected} on:checked={onItemSelected} />
        {/if}
        <span class="material-symbols-outlined">{icon}</span>
        <button on:click={onItemClick}>{fileDesc.name}</button>
    </li>
    {#if fileDesc.children && expanded}
        {#each fileDesc.children as child}
            {@const childDesc = { ...child, selected: fileDesc.selected }}
            {#key `${childDesc.id}#${childDesc.selected}`}
                <li>
                    <FileTreeItem
                        fileDesc={childDesc}
                        depth={depth + 1}
                        on:click
                        on:selected
                        {notSelectable}
                        {noLastItem}
                        {noFolderClick}
                    >
                        {#if !noLastItem && fileDesc.mimeType === "folder"}
                            <slot></slot>
                        {/if}
                    </FileTreeItem>
                </li>
            {/key}
        {/each}
        {#if !noLastItem && fileDesc.mimeType === "folder"}
            <li
                class="last-item"
                style="padding-left: calc(16px * {!notSelectable
                    ? depth
                    : depth + 1})"
            >
                <slot data={fileDesc}></slot>
            </li>
        {/if}
    {/if}
</ul>

<style>
    ul,
    li {
        position: relative;
        list-style: none;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        color: var(--color-on-content);
        background: var(--color-content);
    }

    button {
        background: none;
        color: inherit;
        outline: none;
        border: none;
        cursor: pointer;
    }

    .header {
        position: relative;
        display: flex;
        justify-content: start;
        align-items: center;
        border-bottom: 1px solid var(--color-control);
        width: 100%;
        height: auto;
        padding: 8px 16px;
    }

    .last-item {
        border-bottom: 1px solid var(--color-control);
    }
</style>
