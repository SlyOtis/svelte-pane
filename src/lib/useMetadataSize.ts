class GridCells {
    static cells: { [key: string]: { count: number, width: number } } = {};
}

function updateSize(node: HTMLElement, key: string) {
    const cellData = GridCells.cells?.[key] || {width: 0, count: 0};
    const currWidth = Math.ceil(parseFloat(window.getComputedStyle(node).width))
    if (currWidth > cellData.width) {
        GridCells.cells[key] = {width: currWidth, count: cellData.count + 1};
        const fileTree = node.closest<HTMLElement>('.sly-file-tree')!!
        fileTree.style.setProperty(`--sly-tree-cell-${key}-size`, currWidth + "px")
        fileTree.style.setProperty('--sly-tree-metadata-columns', Object.keys(GridCells.cells).reduce((prev, curr) => {
            return `${prev} minmax(${GridCells.cells[curr].width}px, auto)`
        }, ''))

        console.log(node.innerHTML, currWidth)
    } else {
        GridCells.cells[key] = {...cellData, count: cellData.count + 1};
    }
}

/*
Should always be a child of a ul or another list wrapper so that we can update the grid display for that element
 */
export function metadataSizeDynamic(node: HTMLElement, key: string) {
    updateSize(node, key)
    node.parentElement?.style.setProperty('grid-template-columns', 'var(--sly-tree-metadata-columns)')

    return {
        destroy() {
            const count = (GridCells.cells?.[key]?.count || 0) - 1;
            if (count <= 0) {
                delete GridCells.cells[key]
            }
        },
        update(key: string){
            requestAnimationFrame(() => {
                updateSize(node, key)
            })
        }
    };
}

export function metadataSizeStatic(node: HTMLElement, key: string) {
    updateSize(node, key)
    node.parentElement?.style.setProperty('grid-template-columns', 'var(--sly-tree-metadata-columns)')

    return {
        destroy() {},
        update(key: string){
            updateSize(node, key)
        }
    };
}