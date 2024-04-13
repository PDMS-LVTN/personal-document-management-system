// import { HocuspocusProvider } from '@hocuspocus/provider'

// import { API } from '@/editor/lib/api'

import {
  // AiWriter,
  // AiImage,
  BlockquoteFigure,
  CharacterCount,
  Color,
  Document,
  Dropcursor,
  // Emoji,
  Figcaption,
  // FileHandler,
  Focus,
  FontFamily,
  FontSize,
  Heading,
  Highlight,
  HorizontalRule,
  ImageBlock,
  Link,
  Placeholder,
  Selection,
  SlashCommand,
  StarterKit,
  Subscript,
  Superscript,
  Table,
  TableOfContents,
  TableCell,
  TableHeader,
  TableRow,
  TextAlign,
  TextStyle,
  TrailingNode,
  Typography,
  Underline,
  // emojiSuggestion,
  Columns,
  Column,
  TaskItem,
  TaskList,
} from '.'
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight'
import { ImageUpload } from './ImageUpload'
import { TableOfContentsNode } from './TableOfContentsNode'
// import { lowlight } from 'lowlight/lib/core';
// https://stackoverflow.com/questions/77573628/how-do-you-highlight-codeblock-with-tiptap
import { common, createLowlight } from 'lowlight';
import { FileBlock } from './FileBlock';
import { FileUpload } from './FileUpload';
import { Mathematics } from '@tiptap-pro/extension-mathematics'
import { useSuggestion } from './InternalLink/suggestion'
import { InternalLink } from './InternalLink/InternalLink';
import { DeletionTracking } from './DeletionTracking';

// interface ExtensionKitProps {
//   provider?: HocuspocusProvider | null
//   userId?: string
//   userName?: string
//   userColor?: string
// }

// export const ExtensionKit = ({ provider, userId, userName = 'Maxi' }: ExtensionKitProps) => [
export const ExtensionKit = () => [
  Document,
  Columns,
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  // AiWriter.configure({
  //   authorId: userId,
  //   authorName: userName,
  // }),
  // AiImage.configure({
  //   authorId: userId,
  //   authorName: userName,
  // }),
  Column,
  Selection,
  Heading.configure({
    levels: [1, 2, 3, 4, 5, 6],
  }),
  HorizontalRule,
  StarterKit.configure({
    document: false,
    dropcursor: false,
    heading: false,
    horizontalRule: false,
    blockquote: false,
    history: false,
    codeBlock: false,
  }),
  CodeBlockLowlight.configure({
    lowlight: createLowlight(common),
    defaultLanguage: null,
  }),
  TextStyle,
  FontSize,
  FontFamily,
  Color,
  TrailingNode,
  Link.configure({
    openOnClick: false,
  }),
  Highlight.configure({ multicolor: true }),
  Underline,
  CharacterCount.configure({ limit: 50000 }),
  TableOfContents,
  TableOfContentsNode,
  // ImageUpload.configure({
  //   clientId: provider?.document?.clientID,
  // }),
  ImageUpload,
  ImageBlock,
  FileBlock,
  FileUpload,
  // FileHandler.configure({
  //   allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
  //   onDrop: (currentEditor, files, pos) => {
  //     files.forEach(async () => {
  //       const url = await API.uploadImage()

  //       currentEditor.chain().setImageBlockAt({ pos, src: url }).focus().run()
  //     })
  //   },
  //   onPaste: (currentEditor, files) => {
  //     files.forEach(async () => {
  //       const url = await API.uploadImage()

  //       return currentEditor
  //         .chain()
  //         .setImageBlockAt({ pos: currentEditor.state.selection.anchor, src: url })
  //         .focus()
  //         .run()
  //     })
  //   },
  // }),
  // Emoji.configure({
  //   enableEmoticons: true,
  //   suggestion: emojiSuggestion,
  // }),
  TextAlign.extend({
    addKeyboardShortcuts() {
      return {}
    },
  }).configure({
    types: ['heading', 'paragraph'],
  }),
  Subscript,
  Superscript,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Typography,
  Placeholder.configure({
    includeChildren: true,
    showOnlyCurrent: false,
    placeholder: () => '',
  }),
  SlashCommand,
  Focus,
  Figcaption,
  BlockquoteFigure,
  Dropcursor.configure({
    width: 2,
    class: 'ProseMirror-dropcursor border-black',
  }),
  Mathematics,
  InternalLink.configure({
    HTMLAttributes: {
      class: 'mention',
    },
    suggestion: useSuggestion(),
  }),
  DeletionTracking()
]

export default ExtensionKit
