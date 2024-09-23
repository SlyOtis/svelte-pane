# Sly Svelte File Tree

A customizable file tree view component for Svelte.

## Features

- Hierarchical file and folder structure display
- File selection with multi-select support
- Folder expansion and collapse
- Custom sorting and grouping
- Metadata display
- Customizable item actions
- Loading and empty states
- Responsive design


## Installation

To install the Svelte File Tree component using pnpm, run the following command in your project directory:

```bash
pnpm add sly-svelte-file-tree
```

## Usage

```svelte
<script lang="ts">
import FileTree, { type FileDescriptor, type SelectedFiles, displayDateISO } from 'sly-svelte-file-tree';

// Example file structure
const fileStructure: FileDescriptor = {
  id: 'root',
  name: 'Root',
  selected: false,
  expanded: true,
  mimeType: 'folder',
  href: '/',
  path: '/',
  children: [
    {
      id: 'folder1',
      name: 'Folder 1',
      selected: false,
      expanded: false,
      mimeType: 'folder',
      href: '/folder1',
      path: '/folder1',
      children: [
        {
          id: 'file1',
          name: 'File 1.txt',
          selected: false,
          mimeType: 'text/plain',
          href: '/folder1/file1.txt',
          path: '/folder1/file1.txt',
          metadata: {
            size: { name: 'Size', value: 1024, displayValue: (v) => `${v} bytes` },
            created_at: { name: 'Created', value: new Date(), displayValue: displayDateISO }
          }
        }
      ]
    },
    {
      id: 'file2',
      name: 'File 2.pdf',
      selected: false,
      mimeType: 'application/pdf',
      href: '/file2.pdf',
      path: '/file2.pdf',
      metadata: {
        size: { name: 'Size', value: 2048, displayValue: (v) => `${v} bytes` },
        created_at: { name: 'Created', value: new Date(), displayValue: displayDateISO }
      }
    }
  ]
};

let selectedFiles: SelectedFiles = {};

function handleClick(event: CustomEvent<FileDescriptor>) {
  console.log('Clicked:', event.detail);
}

function handleSelection(event: CustomEvent<FileDescriptor>) {
  console.log('Selection changed:', event.detail);
}
</script>

<FileTree
  fileDesc={fileStructure}
  on:click={handleClick}
  on:selected={handleSelection}
  bind:selectedFiles
  fileGrouping={{
    "size": {
      name: "File size",
      orderOf: 'number',
      displayValue: (v) => `${v} bytes`
    },
    "created_at": {
      name: "Created At",
      orderOf: 'date',
      displayValue: displayDateISO,
    }
  }}
  noFolderClick={false}
  notSelectable={false}
  noMenuBar={false}
  noIndentation={false}
  noActionsTransition={false}
  metadataAsTags={false}
>
  <div slot="loading">
    <span>Loading file tree...</span>
  </div>

  <div slot="item-actions" let:data>
    <button on:click={() => console.log('Delete', data)}>
      <span class="material-icons">delete</span>
    </button>
  </div>

  <div slot="selection-actions" let:data>
    <button on:click={() => console.log('Bulk delete', Object.values(data))}>
      <span class="material-icons">delete_sweep</span>
    </button>
  </div>

  <div slot="item-loading">
    <span>Loading item...</span>
  </div>

  <div slot="item-no-content" let:data>
    <span>Failed to load content for {data.name}</span>
  </div>

  <div slot="empty-list">
    <span>This folder is empty</span>
  </div>
</FileTree>

<style>
  :global(.sly-file-tree) {
    --sly-color-control: #e0e0e0;
    --sly-color-hover: #f5f5f5;
    --sly-color-select: #bbdefb;
    --sly-item-indentation: 20px;
  }
</style>
```

## Customization

### CSS Variables

Override these CSS variables to customize the appearance:

- `--sly-color-control`
- `--sly-color-content`
- `--sly-color-no-content`
- `--sly-color-hover`
- `--sly-color-select`
- `--sly-color-on-content`
- `--sly-color-on-hover`
- `--sly-color-on-select`
- `--sly-color-metadata`
- `--sly-color-on-metadata`
- `--sly-color-header`
- `--sly-item-indentation`
- `--sly-item-cell-gap`

### Slots

Customize various parts of the tree using slots:

- `loading`: Content to show while loading
- `item-actions`: Custom actions for each item
- `selection-actions`: Actions for selected items
- `item-loading`: Content for loading items
- `item-no-content`: Content for items that failed to load

## Props

- `fileDesc`: File structure descriptor
- `selectedFiles`: Currently selected files
- `fileGrouping`: Grouping configuration
- `notSelectable`: Disable selection
- `noMenuBar`: Hide menu bar
- `noFolderClick`: Disable folder click
- `noIndentation`: Remove indentation
- `noActionsTransition`: Disable action transitions
- `metadataAsTags`: Display metadata as tags

Refer to the component's TypeScript definitions for more detailed prop information.
