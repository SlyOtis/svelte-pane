<script lang="ts">
    import type {FileDescriptor, FileGrouping, FileTreeContext, SortGroup} from "./types";
    import {getContext} from "svelte";
    import Checkbox from "./Checkbox.svelte";
    import {metadataSizeData} from "./useMetadataSize";

    export let folderName: string
    export let fileGrouping: FileGrouping | undefined = undefined
    export let notSelectable = false;
    export let fileDesc: FileDescriptor;
    export let noActionsTransition = false

    const {sortItems, sortGroup} = getContext<FileTreeContext>("file-tree-context");

    function toggleSortGroup(next: SortGroup, curr?: SortGroup) {
        if (next.key === curr?.key) {
            return sortItems({...next, order: curr.order === 'asc' ? 'desc' : 'asc'})
        }

        return sortItems(next)
    }
</script>

<div class="root" class:selectable={!notSelectable} class:no-action-transition={noActionsTransition}>
    {#if !notSelectable}
        <Checkbox checked={fileDesc.selected} on:checked/>
    {/if}
    <span><b>{folderName}</b></span>
    {#if fileGrouping}
        <ul use:metadataSizeData>
            {#each Object.keys(fileGrouping) as groupKey}
                {@const group = fileGrouping[groupKey]}
                <li data-key={groupKey}>
                    <button
                            class:active={$sortGroup?.key === groupKey}
                            on:click|preventDefault|stopPropagation={() => toggleSortGroup({
                            key: groupKey,
                            order: 'asc',
                            orderOf: group.orderOf
                        }, $sortGroup)}
                    >
                        {#if $sortGroup?.order === 'asc'}
                            <span class="material-symbols-outlined">arrow_drop_down</span>
                        {:else }
                            <span class="material-symbols-outlined">arrow_drop_up</span>
                        {/if}
                        <div class="text">
                            <span class="name">{group.name}</span>
                            <span class="placeholder">{group.name}</span>
                        </div>
                    </button>
                </li>
            {/each}
        </ul>
    {/if}
    {#if noActionsTransition}
        <div class="transition-placeholder"></div>
    {/if}
</div>

<style>
    * {
        box-sizing: border-box;
    }

    .root {
        position: relative;
        display: grid;
        grid-template-columns: min-content max-content minmax(0, 1fr);
        width: 100%;
        scrollbar-gutter: stable;
    }

    .root.selectable {
        gap: 8px;
    }

    .root.no-action-transition {
        grid-template-columns: min-content max-content minmax(0, 1fr) var(--sly-tree-item-actions-size);
    }

    ul,
    li {
        position: relative;
        list-style: none;
        padding: 0;
        margin: 0;
        color: var(--sly-color-on-content);
        width: 100%;
    }

    button {
        position: relative;
        border-radius: 4px;
        width: 100%;
        height: 24px;
        border: none;
        outline: none;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        gap: 0;
        background: none;
        color: inherit;
        overflow: hidden;
    }

    ul {
        display: grid;
        justify-content: end;
        align-items: center;
        justify-items: center;
        align-content: center;
        grid-template-columns: repeat(auto-fill, minmax(0, auto));
        grid-template-rows: 1fr;
        width: 100%;
    }

    li {
        padding: 0 4px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    li:not(:last-child) {
        border-right: 1px solid var(--sly-color-control);
    }

    button > .text {
        font-size: 1em;
        user-select: none;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 0;
    }

    .text > .placeholder {
        opacity: 0;
        font-weight: 600;
        z-index: 0;
    }

    .text > .name {
        position: absolute;
        z-index: 1;
    }

    button > .material-symbols-outlined {
        opacity: 0.5;
    }

    button:hover {
        cursor: pointer;
        color: var(--sly-color-on-hover);
    }

    .active > .text > .name {
        font-weight: 600;
    }

    .active > .material-symbols-outlined {
        opacity: 1;
    }
</style>