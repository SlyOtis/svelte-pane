<script lang="ts">
    import {DraggableEdge} from "./lib";
</script>

<main class="pane-grid-container">
    <div class="pane">
        <h1>Pane 1</h1>
        <DraggableEdge
                options={{
                property: "--center-scale",
                anchor: "right",
                gridSelector: ".pane-grid-container",
            }}
        />
    </div>
    <div class="pane">
        <h1>Pane 2</h1>
    </div>
    <div class="pane">
        <h1>Pane 3</h1>
    </div>
</main>

<style>
    :root {
        --center-scale: 50%;
        --center-scale-max: 90%;
        --center-scale-min: 10%;
    }

    main {
        position: relative;
        display: grid;
        width: 100%;
        height: 100%;
        grid-template-columns: var(--center-scale) 1fr 1fr;
    }

    .pane {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
    }
</style>
