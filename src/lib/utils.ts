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

export {
    css,
    setOnEscListener,
    waitForStylesheet
}