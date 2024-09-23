class SlyGrid {
    static cells: { [key: string]: { count: number, width: number } } = {};
}

async function updateSize(fileTree: HTMLElement, node: HTMLElement, key: string) {
    const cellData = SlyGrid.cells?.[key] || {width: 0, count: 0};
    const currWidth = Math.ceil(node.offsetWidth)
    if (currWidth > cellData.width) {
        SlyGrid.cells[key] = {width: currWidth, count: cellData.count + 1};
        fileTree.style.setProperty(`--sly-tree-cell-${key}-size`, currWidth + "px")
        fileTree.style.setProperty('--sly-tree-metadata-columns-calc', Object.keys(SlyGrid.cells).reduce((prev, curr) => {
            return `${prev} minmax(auto, ${SlyGrid.cells[curr].width}px)`
        }, ''))
    } else {
        SlyGrid.cells[key] = {...cellData, count: cellData.count + 1};
    }
}

export function metadataSizeData(node: HTMLElement) {
    function update() {
        const cells = node.querySelectorAll<HTMLElement>('[data-metadata-key]')
        const fileTree = node.closest<HTMLElement>('.sly-file-tree')!!
        cells.forEach(cell => updateSize(fileTree, cell, cell.dataset["metadataKey"]!!))
        node.style.setProperty('grid-template-columns', 'var(--sly-tree-metadata-columns)')
    }

    update()

    return {
        destroy() {
            node.querySelectorAll<HTMLElement>('[data-metadata-key]').forEach(cell => {
                const key = cell.dataset["key"]!!
                const count = (SlyGrid.cells?.[key]?.count || 0) - 1;
                if (count <= 0) {
                    delete SlyGrid.cells[key]
                }
            });
        },
        update
    };
}

export function metadataGrid(node: HTMLElement) {
    function update() {
        node.style.setProperty('--sly-tree-metadata-columns', 'var(--sly-tree-metadata-columns-calc)')
    }

    update()

    return {
        destroy() {
            node.style.setProperty('--sly-tree-metadata-columns', 'repeat(auto-fill, minmax(0, auto))')
        },
        update
    };
}