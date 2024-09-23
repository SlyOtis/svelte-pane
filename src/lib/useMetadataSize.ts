class SlyGrid {
    static cells: { [key: string]: { count: number, width: number } } = {};
}

function updateSize(node: HTMLElement, key: string) {
    const cellData = SlyGrid.cells?.[key] || {width: 0, count: 0};
    const currWidth = Math.ceil(node.offsetWidth)
    if (currWidth > cellData.width) {
        SlyGrid.cells[key] = {width: currWidth, count: cellData.count + 1};
        const fileTree = node.closest<HTMLElement>('.sly-file-tree')!!
        fileTree.style.setProperty(`--sly-tree-cell-${key}-size`, currWidth + "px")
        fileTree.style.setProperty('--sly-tree-metadata-columns-calc', Object.keys(SlyGrid.cells).reduce((prev, curr) => {
            return `${prev} minmax(auto, ${SlyGrid.cells[curr].width}px)`
        }, ''))
    } else {
        SlyGrid.cells[key] = {...cellData, count: cellData.count + 1};
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
            const count = (SlyGrid.cells?.[key]?.count || 0) - 1;
            if (count <= 0) {
                delete SlyGrid.cells[key]
            }
        },
        update(key: string) {
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
        destroy() {
        },
        update(key: string) {
            updateSize(node, key)
        }
    };
}

export function metadataSizeData(node: HTMLElement) {
    function update() {
        console.log("measuring")
        const cells = node.querySelectorAll<HTMLElement>('[data-key]')
        cells.forEach(cell => updateSize(cell, cell.dataset["key"]!!))
        node.style.setProperty('grid-template-columns', 'var(--sly-tree-metadata-columns)')
    }

    update()

    return {
        destroy() {
            node.querySelectorAll<HTMLElement>('[data-key]').forEach(cell => {
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
        node.style.setProperty('--sly-tree-metadata-columns', 'repeat(auto-fill, minmax(0, auto))')
        requestAnimationFrame(() => {
            node.style.setProperty('--sly-tree-metadata-columns', 'var(--sly-tree-metadata-columns-calc)')
        })
    }

    update()

    return {
        destroy() {
            node.style.setProperty('--sly-tree-metadata-columns', 'repeat(auto-fill, minmax(0, auto))')
        },
        update
    };
}