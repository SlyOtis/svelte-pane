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

export {
    css,
    setOnEscListener
}

