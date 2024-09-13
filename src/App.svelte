<script lang="ts">
    import FileTree, {type FileDescriptor, type SelectedFiles} from "./lib";
    import {defaultFileTree} from "./example"
    import LastItemTest from "./LastItemTest.svelte";

    const fileDesc = defaultFileTree
    let selectFileDesc: FileDescriptor | undefined = undefined
    let selectedFiles: SelectedFiles = {};

    function onClick(e: CustomEvent<FileDescriptor>) {
        // TODO:: Get selected file from URL
        // window.location.href = `/inbox${e.detail.path}`
        selectFileDesc = e.detail
    }

    function onSelected(e: CustomEvent<FileDescriptor>) {

    }

</script>

<main class="root page-root">
    <section>
        <FileTree
                {fileDesc}
                on:click={onClick}
                on:selected={onSelected}
                bind:selectedFiles
                noFolderClick
                fileGrouping={{
                    "size": {
                        name: "File size",
                        orderOf: 'number'
                    },
                    "created_at": {
                        name: "Created At",
                        orderOf: 'date',
                        icon: 'event'
                    }
                }}

        >
            <div slot="item-actions">
                <button><span class="material-symbols-outlined">delete</span></button>
            </div>
            <div slot="item-loading">
                <span>Loading...</span>
            </div>
            <div slot="item-no-content" let:data>
                <span>Failed to load content for {data.name}</span>
            </div>
        </FileTree>
    </section>
</main>

<style>
    .root {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
    }

    section {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        max-width: 800px;
        max-height: 800px;
        border: 1px solid gray;
        border-radius: 12px;
        overflow: hidden;
    }
</style>