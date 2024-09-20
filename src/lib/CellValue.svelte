<script lang="ts">
    export let key: string
    export let value: string

    $: {

    }
</script>

<li class="metadata-{key} grid">
    <span class="value">{value}</span>
</li>