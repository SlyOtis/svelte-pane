import type {ComponentType} from "svelte";

export type FileMetadata = {
    key: string;
    value: string | number;
}[];

export type FileDescriptor = {
    id: string;
    name: string;
    selected: boolean;
    expanded?: boolean
    metadata: FileMetadata;
    href: string;
    mimeType: string;
    path: string;
    children?: FileDescriptor[];
};

export type SelectedFile = Omit<FileDescriptor, "children" | "selected">;

export type SelectedFiles = {
    [id: string]: SelectedFile;
};

export type SelectedFilesContext = {
    selectItems: (...items: Array<SelectedFile>) => void;
    deselectItems: (...items: Array<SelectedFile>) => void;
};

export type HighlightedItem = {
    highlightItem?: FileDescriptor | null;
    highlightStyle?: string | null;
};

export type LastItem =
    | string  // for raw HTML
    | ComponentType  // for Svelte components
    | { default: ComponentType }  // for synchronously imported components
    | Promise<{ default: ComponentType }>  // for asynchronously imported components
    | null
    | undefined