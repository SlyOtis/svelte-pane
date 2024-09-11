<script>
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher()

    export let checked = false

    function onClick() {
        checked = !checked
        dispatch('checked', checked)
    }

</script>

<button on:click={onClick}>
    <span class="material-symbols-outlined">{#if checked}check_box{:else}check_box_outline_blank{/if}</span>
</button>

<style>
    button {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        outline: none;
        border: none;
        background: none;
        color: inherit;
    }

    button > .material-symbols-outlined {
        color: inherit;
    }
</style>