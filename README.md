# Svelte Pane

A lightweight, flexible Svelte library for creating resizable pane layouts in your web applications, leveraging CSS variables and grid for flexible layouts.

## Features

- Create draggable and resizable panes using CSS Grid
- Utilizes CSS variables for dynamic sizing
- Customizable drag handles
- Responsive design
- TypeScript support

## Installation

```bash
pnpm add sly-svelte-pane
```

## Usage

### 1. Import the components

```svelte
<script>
  import { DraggableEdge } from 'sly-svelte-pane';
</script>
```

### 2. Create a resizable pane layout

```svelte
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
```

### 3. Set up CSS variables and grid layout

```html
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
        display: grid;
        grid-template-columns: var(--center-scale) var(--center-scale-2) 1fr;
    }
</style>
```
## Styling

The package includes default styles for the draggable edge. You can customize these styles by overriding the following CSS classes:

- `.sly-draggable-edge-root`: Styles the root container of the draggable edge.
- `.sly-draggable-edge-touchable`: Styles the touchable area of the draggable edge.

Example of custom styling:

```css
.sly-draggable-edge-root {
  background: #007bff;
}

.sly-draggable-edge-touchable {
   cursor: col-resize;
}
```

## API

### DraggableEdge

A Svelte component that creates a draggable edge for resizing panes. Place it inside the grid element you want to resize.

Props:
- `options`: DraggableOptions (required)

### DraggableOptions

```typescript
{
  property: string;       // CSS variable to update (e.g., "--center-scale")
  anchor: "left" | "right" | "top" | "bottom";  // Edge anchor position
  gridSelector: string;   // Selector for the parent grid container
}
```

## License

MIT
