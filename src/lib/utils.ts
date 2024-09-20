import type {FileDescriptor, SelectedFile, SortGroup} from "./types";
import * as string_decoder from "node:string_decoder";

function css(strings: TemplateStringsArray, ...values: any[]): string {
    return strings.reduce((result, string, i) =>
        result + string + (values[i] || ''), '');
}

/**
 * Helper for adding a window escape listener, returning true removes the listener again
 * @param listener
 */
function setOnEscListener(listener: (e: KeyboardEvent) => boolean) {
    const _listener = (e: KeyboardEvent) => {

        if (e.key !== 'Escape') {
            return
        }

        e.preventDefault();
        e.stopPropagation()

        if (listener(e)) {
            window.removeEventListener('keydown', _listener);
        }
    };
    window.addEventListener('keydown', _listener);
}

function waitForStylesheet(href: string): Promise<void> {
    return new Promise((resolve) => {
        const existingLink = document.querySelector(`link[href="${href}"]`);
        if (existingLink) {
            // If the stylesheet is already in the document, resolve immediately
            resolve();
        } else {
            // Otherwise, wait for the stylesheet to load
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    const addedNodes = mutation.addedNodes;
                    for (let i = 0; i < addedNodes.length; i++) {
                        const node = addedNodes[i] as HTMLLinkElement;
                        if (node.tagName === 'LINK' && node.href.includes(href)) {
                            observer.disconnect();
                            node.onload = () => resolve();
                            return;
                        }
                    }
                });
            });

            observer.observe(document.head, {
                childList: true,
                subtree: true
            });
        }
    });
}

function orderItems(items: FileDescriptor[], sortBy?: SortGroup): FileDescriptor[] {
    if (!sortBy) {
        return items
    }

    // These are special keys sat directly on the object
    if (sortBy.key === 'name') {
        if (sortBy.order === 'asc') {
            return items.sort((a, b) => b.name.localeCompare(a.name));
        }
        return items.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sortBy.key === 'mimeType') {
        if (sortBy.order === 'asc') {
            return items.sort((a, b) => b.mimeType.localeCompare(a.mimeType));
        }
        return items.sort((a, b) => a.mimeType.localeCompare(b.mimeType));
    }

    // Remaining sort goes trhough metadata
    switch (sortBy.orderOf) {
        case "number":
            if (sortBy.order === 'asc') {
                return items.sort((a, b) => {
                    const {valA, valB} = parseToNumber(sortBy.key, a, b)
                    return valA - valB
                });
            }

            return items.sort((a, b) => {
                const {valA, valB} = parseToNumber(sortBy.key, a, b)
                return valB - valA
            });
        case "string":
            if (sortBy.order === 'asc') {
                return items.sort((a, b) => {
                    const {valA, valB } = parseToString(sortBy.key, a, b)
                    return valB.localeCompare(valA)
                });
            }
            return items.sort((a, b) => {
                const {valA, valB } = parseToString(sortBy.key, a, b)
                return valA.localeCompare(valB)
            });
        case 'date':
            if (sortBy.order === 'asc') {
                return items.sort((a, b) => {
                    const {valA, valB } = parseToDate(sortBy.key, a, b)
                    return valA.getTime() - valB.getTime()
                });
            }
            return items.sort((a, b) => {
                const {valA, valB } = parseToDate(sortBy.key, a, b)
                return valB.getTime() - valA.getTime()
            });
        default:
            if (sortBy.order === 'asc') {
                return items.sort((a, b) => {
                    const {valA, valB } = parseToBoolean(sortBy.key, a, b)
                    return valB - valA
                });
            }
            return items.sort((a, b) => {
                const {valA, valB } = parseToBoolean(sortBy.key, a, b)
                return valB - valA
            });
    }
}

function parseToNumber(key: string, a?: FileDescriptor, b?: FileDescriptor): {valA: number, valB: number} {
    let valA = a?.metadata?.[key]?.value || 0
    if (typeof valA === 'string') {
        valA = parseInt(valA)
    } else if (valA instanceof Date) {
        valA = valA.getTime()
    } else if (typeof valA === 'boolean') {
        valA = valA ? 1 : 0
    }

    let valB = b?.metadata?.[key]?.value || 0
    if (typeof valB === 'string') {
        valB = parseInt(valB)
    } else if (valB instanceof Date) {
        valB = valB.getTime()
    } else if (typeof valB === 'boolean') {
        valB = valB ? 1 : 0
    }

    return {valA, valB}
}

function parseToString(key: string, a?: FileDescriptor, b?: FileDescriptor): {valA: string, valB: string} {
    const valA = (a?.metadata?.[key]?.value || '').toString()
    const valB = (b?.metadata?.[key]?.value || '').toString()
    return {valA, valB}
}

function parseToDate(key: string, a?: FileDescriptor, b?: FileDescriptor): {valA: Date, valB: Date} {
    let valA = a?.metadata?.[key]?.value || ''
    let valB = b?.metadata?.[key]?.value || ''

    if (!(valA instanceof Date)) {
        const parsedDate = new Date(valA.toString());
        if (isNaN(parsedDate.getTime())) {
            throw new Error(`Invalid date input: ${valA}`);
        }
        valA = parsedDate
    }

    if (!(valB instanceof Date)) {
        const parsedDate = new Date(valB.toString());
        if (isNaN(parsedDate.getTime())) {
            throw new Error(`Invalid date input: ${valB}`);
        }
        valB = parsedDate
    }

    return {valA, valB}
}

function parseToBoolean(key: string, a?: FileDescriptor, b?: FileDescriptor): {valA: number, valB: number} {
    const valA = !!(a?.metadata?.[key]?.value || false) ? 1 : 0
    const valB = !!(b?.metadata?.[key]?.value || false) ? 1 : 0
    return {valA, valB}
}

function displayDateISO(value: Date): string {
    return new Intl.DateTimeFormat('default', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(value).replace(/\//g, '.');
}

function reduceSelectedItems(start: FileDescriptor): Array<SelectedFile> {
    const _items: Array<SelectedFile> = [
        {
            id: start.id,
            name: start.name,
            metadata: start.metadata,
            mimeType: start.mimeType,
            path: start.path,
            href: start.href,
        },
    ];

    if (!start?.children?.length) {
        return _items;
    }

    for (const item of start.children) {
        _items.push(...reduceSelectedItems(item));
    }

    return _items;
}

export {
    css,
    setOnEscListener,
    waitForStylesheet,
    orderItems,
    displayDateISO,
    reduceSelectedItems
}