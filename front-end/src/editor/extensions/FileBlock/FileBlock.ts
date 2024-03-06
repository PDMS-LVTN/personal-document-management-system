import { ReactNodeViewRenderer } from '@tiptap/react'
import { mergeAttributes, Range } from '@tiptap/core'
import FileBlockView from './FileBlockView'
import { Image } from '../Image'

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        fileBlock: {
            setFileBlock: (attributes: { src: string, name: string, size }) => ReturnType
            setFileBlockAt: (attributes: { src: string; pos: number | Range }) => ReturnType
        }
    }
}

export const FileBlock = Image.extend({
    name: 'fileBlock',

    group: 'block',

    defining: true,

    isolating: true,

    addAttributes() {
        return {
            src: {
                default: '',
                parseHTML: element => element.getAttribute('src'),
                renderHTML: attributes => ({
                    src: attributes.src,
                }),
            },
            name: {
                default: '',
                parseHTML: element => element.getAttribute('name'),
                renderHTML: attributes => ({
                    name: attributes.name,
                }),
            },
            size: {
                default: '',
                parseHTML: element => element.getAttribute('size'),
                renderHTML: attributes => ({
                    size: attributes.size,
                }),
            },
        }
    },

    parseHTML() {
        return [
            // {
            //   tag: 'img[src*="tiptap.dev"]:not([src^="data:"]), img[src*="windows.net"]:not([src^="data:"])',
            // },
            { tag: 'file-block' }
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['file-block', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
    },

    addCommands() {
        return {
            setFileBlock:
                attrs =>
                    ({ commands }) => {
                        return commands.insertContent({ type: 'fileBlock', attrs: { src: attrs.src, name: attrs.name, size: attrs.size } })
                    },

            setFileBlockAt:
                attrs =>
                    ({ commands }) => {
                        return commands.insertContentAt(attrs.pos, { type: 'fileBlock', attrs: { src: attrs.src } })
                    },

        }
    },

    addNodeView() {
        return ReactNodeViewRenderer(FileBlockView)
    },
})

export default FileBlock
