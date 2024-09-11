<script lang="ts">
    import FileTree, {type FileDescriptor, type SelectedFiles} from "./lib";
    import {defaultFileTree} from "./example"

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
    <FileTree
            {fileDesc}
            on:click={onClick}
            on:selected={onSelected}
            bind:selectedFiles
            noLastItem
            noFolderClick
    />
</main>

<style>
    .root {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: start;
        align-items: start;
        overflow: hidden;
    }
</style>