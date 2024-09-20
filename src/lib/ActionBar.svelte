<script lang="ts">
    import type {FileDescriptor, FileGrouping, FileTreeContext, SortGroup} from "./types";
    import {getContext} from "svelte";
    import Checkbox from "./Checkbox.svelte";

    export let folderName: string
    export let fileGrouping: FileGrouping | undefined = undefined
    export let noActionsTransition = false
    export let notSelectable = false;
    export let fileDesc: FileDescriptor;

    const {sortItems, sortGroup} = getContext<FileTreeContext>("file-tree-context");

    function toggleSortGroup(next: SortGroup, curr?: SortGroup) {
        if (next.key === curr?.key) {
            return sortItems({...next, order: curr.order === 'asc' ? 'desc' : 'asc'})
        }

        return sortItems(next)
    }
</script>

<div class="root" class:selectable={!notSelectable}>
    {#if !notSelectable}
        <Checkbox checked={fileDesc.selected} on:checked/>
    {/if}
    <span><b>{folderName}</b></span>
    {#if fileGrouping}
        <ul>
            {#each Object.keys(fileGrouping) as groupKey}
                {@const group = fileGrouping[groupKey]}
                <li>
                    <button
                            class:active={$sortGroup?.key === groupKey}
                            on:click|preventDefault|stopPropagation={() => toggleSortGroup({
                            key: groupKey,
                            order: 'asc',
                            orderOf: group.orderOf
                        }, $sortGroup)}
                    >
                        {#if $sortGroup?.key === groupKey}
                            {#if $sortGroup?.order === 'asc'}
                                <span class="material-symbols-outlined">arrow_drop_down</span>
                            {:else }
                                <span class="material-symbols-outlined">arrow_drop_up</span>
                            {/if}
                        {/if}
                        <span class="material-symbols-outlined">{group.icon || 'tag'}</span>
                        <span class="text">{group.name}</span>
                    </button>
                </li>
            {/each}
        </ul>
    {/if}
    <div></div>
</div>

<style>
    * {
        box-sizing: border-box;
    }

    .root {
        position: relative;
        display: grid;
        grid-template-columns: min-content max-content minmax(0, 1fr) var(--sly-tree-item-actions-size);
    }

    .root.selectable {
        gap: 8px;
    }

    ul,
    li {
        position: relative;
        list-style: none;
        padding: 0;
        margin: 0;
        color: var(--color-on-secondary);
        width: auto;
    }

    button {
        position: relative;
        border-radius: 4px;
        width: auto;
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
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        gap: 16px;
    }

    button > .text {
        font-size: 1em;
        padding: 8px;
    }

    button:hover {
        cursor: pointer;
        color: var(--color-primary);
    }

    .active {
        background: var(--sly-color-select);
    }
</style>