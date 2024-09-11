export type FileMetadata = {
  [key: string]: string;
};

export type FileDescriptor = {
  id: string;
  name: string;
  selected: boolean;
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
