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
        <DraggableEdge
                options={{
                property: "--center-scale-2",
                anchor: "right",
                gridSelector: ".pane-grid-container",
            }}
        />
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
        --center-scale-2: 50%;
        --center-scale-2-max: 90%;
        --center-scale-2-min: 10%;
    }

    main {
        position: relative;
        display: grid;
        width: 100%;
        height: 100%;
        grid-template-columns: var(--center-scale) var(--center-scale-2) 1fr;
        overflow: hidden;
    }

    .pane {
        position: relative;
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: 1fr auto;
        justify-items: center;
        align-items: center;
    }
</style>
