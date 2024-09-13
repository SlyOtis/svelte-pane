import type {ComponentType} from 'svelte';
import type {Readable} from "svelte/store";

export type FileMetadata = {
    name: string;
    value: string | number | Date | boolean;
    hidden?: boolean
};

export type FileMetadataDescriptor = {
    [key: string]: FileMetadata;
}

export type FileDescriptor = {
    id: string;
    name: string;
    selected: boolean;
    expanded?: boolean
    metadata?: FileMetadataDescriptor;
    href: string;
    mimeType: string;
    path: string;
    children?: FileDescriptor[];
};

export type SelectedFile = Omit<FileDescriptor, 'children' | 'selected'>;

export type SelectedFiles = {
    [id: string]: SelectedFile;
};

export type FileGroup = {
    name: string,
    icon?: string,
    orderOf: 'date' | 'number' | 'string' | 'boolean'
}

export type FileGrouping = {
    [key: string]: FileGroup
};

export type ExpandedFolder = Omit<FileDescriptor, 'children' | 'expanded'>;

export type ExpandedFolders = {
  [id: string]: ExpandedFolder;
};

export type SortGroup = {
    key: string,
    order: 'asc' | 'desc',
} & Pick<FileGroup, 'orderOf'>

export type FileTreeContext = {
    selectItems: (...items: Array<SelectedFile>) => void;
    deselectItems: (...items: Array<SelectedFile>) => void;
    expandFolders: (...items: Array<string>) => void;
    collapseFolders: (...items: Array<string>) => void;
    sortItems: (sortGroup: SortGroup) => void;
    sortGroup: Readable<SortGroup | undefined>
    expandedItems: Readable<Array<string>>
};

export type HighlightedItem = {
    highlightItem?: FileDescriptor | null;
    highlightStyle?: string | null;
};

export type LastItemComp = { default: ComponentType }

export type ImportLastItem =
    | ((data: FileDescriptor) => LastItemComp)  // for synchronously imported components
    | (() => LastItemComp)  // for synchronously imported components
    | ((data: FileDescriptor) => Promise<LastItemComp>)  // for asynchronously imported components
    | (() => Promise<LastItemComp>)

export type LastItem =
    | string  // for raw HTML
    | ComponentType  // for Svelte components
    | LastItemComp  // for synchronously imported components
    | ImportLastItem
    | null
    | undefined

export type ItemExpandedState = {
    touched: boolean
    expanded: boolean
}