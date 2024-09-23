import type {ComponentType} from 'svelte';
import type {Readable} from "svelte/store";

/**
 * Represents metadata for a file.
 * @template T - The type of the value (string, number, Date, or boolean).
 */
export type FileMetadata<T extends string | number | Date | boolean> = {
    /** The name of the metadata field */
    name: string;
    /** The value of the metadata field */
    value: string | number | Date | boolean;
    /** Whether the metadata should be hidden */
    hidden?: boolean;
    /** A function to transform the display value of the metadata */
    displayValue: DisplayValueTransformer<T>;
};

/**
 * Extends FileMetadata with a key property.
 * @template T - The type of the value (string, number, Date, or boolean).
 */
export type KeyFileMetadata<T extends string | number | Date | boolean> = FileMetadata<T> & {
    /** The key of the metadata field */
    key: string
};

/**
 * A dictionary of FileMetadata objects.
 */
export type FileMetadataDescriptor = {
    [key: string]: FileMetadata<any>;
};

/**
 * Describes a file or folder in the file tree.
 */
export type FileDescriptor = {
    /** Unique identifier for the file */
    id: string;
    /** Name of the file */
    name: string;
    /** Whether the file is selected */
    selected: boolean;
    /** Whether the folder is expanded (if applicable) */
    expanded?: boolean;
    /** Metadata associated with the file */
    metadata?: FileMetadataDescriptor;
    /** URL or path to access the file */
    href: string;
    /** MIME type of the file */
    mimeType: string;
    /** File system path */
    path: string;
    /** Child files or folders (if this is a folder) */
    children?: FileDescriptor[];
};

/**
 * Represents a selected file, omitting certain properties.
 */
export type SelectedFile = Omit<FileDescriptor, 'children' | 'selected'>;

/**
 * A dictionary of selected files, keyed by their IDs.
 */
export type SelectedFiles = {
    [id: string]: SelectedFile;
};

/**
 * A function to transform a value for display.
 * @template T - The type of the input value (string, number, boolean, or Date).
 */
export type DisplayValueTransformer<T extends string | number | boolean | Date> = (value: T) => string;

/**
 * Describes a group of files.
 */
export type FileGroup = {
    /** Name of the group */
    name: string;
    /** Type of ordering for the group */
    orderOf: 'date' | 'number' | 'string' | 'boolean';
    /** Optional function to transform the display value */
    displayValue?: DisplayValueTransformer<any>;
};

/**
 * A dictionary of FileGroup objects.
 */
export type FileGrouping = {
    [key: string]: FileGroup;
};

/**
 * Represents an expanded folder, omitting certain properties.
 */
export type ExpandedFolder = Omit<FileDescriptor, 'children' | 'expanded'>;

/**
 * A dictionary of expanded folders, keyed by their IDs.
 */
export type ExpandedFolders = {
    [id: string]: ExpandedFolder;
};

/**
 * Describes how items should be sorted.
 */
export type SortGroup = {
    /** Key to sort by */
    key: string;
    /** Sort order (ascending or descending) */
    order: 'asc' | 'desc';
} & Pick<FileGroup, 'orderOf'>;

/**
 * Context for the file tree component.
 */
export type FileTreeContext = {
    /** Function to select items */
    selectItems: (...items: Array<SelectedFile>) => void;
    /** Function to deselect items */
    deselectItems: (...items: Array<SelectedFile>) => void;
    /** Function to expand folders */
    expandFolders: (...items: Array<string>) => void;
    /** Function to collapse folders */
    collapseFolders: (...items: Array<string>) => void;
    /** Function to get a value transformer for a metadata key */
    getValueTransformer: (metadataKey: string) => (DisplayValueTransformer<any> | undefined);
    /** Function to sort items */
    sortItems: (sortGroup: SortGroup) => void;
    /** Readable store for the current sort group */
    sortGroup: Readable<SortGroup | undefined>;
    /** Readable store for expanded items */
    expandedItems: Readable<Array<string>>;
};

/**
 * Represents a highlighted item in the file tree.
 */
export type HighlightedItem = {
    /** The item to highlight */
    highlightItem?: FileDescriptor | null;
    /** CSS style to apply to the highlighted item */
    highlightStyle?: string | null;
};

/**
 * Represents a component type with a default export.
 */
export type LastItemComp = { default: ComponentType };

/**
 * Function types for importing the last item component.
 */
export type ImportLastItem =
    | ((data: FileDescriptor) => LastItemComp)  // for synchronously imported components
    | (() => LastItemComp)  // for synchronously imported components
    | ((data: FileDescriptor) => Promise<LastItemComp>)  // for asynchronously imported components
    | (() => Promise<LastItemComp>);

/**
 * Represents the last item in a file tree node.
 */
export type LastItem =
    | string  // for raw HTML
    | ComponentType  // for Svelte components
    | LastItemComp  // for synchronously imported components
    | ImportLastItem
    | null
    | undefined;

/**
 * Represents the expanded state of an item.
 */
export type ItemExpandedState = {
    /** Whether the item has been interacted with */
    touched: boolean;
    /** Whether the item is expanded */
    expanded: boolean;
};