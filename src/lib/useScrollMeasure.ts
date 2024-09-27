export default function scrollMeasure(node: HTMLElement, selector: string) {

    function update() {
        const contentWidth = node.querySelector<HTMLElement>(selector)?.offsetWidth || node.offsetWidth
        node.style.setProperty('--sly-scrollbar-width', `${node.offsetWidth - contentWidth}px`)
    }

    update()

    return {
        destroy() {
        },
        update
    };
}