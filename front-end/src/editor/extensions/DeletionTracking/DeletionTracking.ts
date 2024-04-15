import { useDeletion } from '@/hooks/useDeletion'
import { useApp } from '@/store/useApp'
// import { useToast } from '@chakra-ui/react'
import { Extension } from '@tiptap/core'
import { TextSelection } from '@tiptap/pm/state'

// https://discuss.prosemirror.net/t/backspace-delete-give-a-prompt-before-deleting/1129/5
// https://discuss.prosemirror.net/t/get-nodebefore-for-current-cursor-position-if-depth-1/5821/2
// https://github.com/ProseMirror/prosemirror-menu/issues/29
export const DeletionTracking = () => {
    const currentNote = useApp(state => state.currentNote)
    const { deleteFile, deleteImage, deleteLink } = useDeletion()
    // const toast = useToast()

    const getPath = (src: string) => {
        const index = src.lastIndexOf('/')
        return src.substring(index + 1)
    }

    return Extension.create({
        addKeyboardShortcuts() {
            return {
                'Backspace': ({ editor }) => {
                    let skip = false
                    const selection = editor.state.selection

                    // Check if the selection contains such a node
                    if (!selection.empty) {
                        const nodes = { 'imageBlock': [], 'fileBlock': [], 'internalLink': [] }
                        const content = editor.state.selection.content().content
                        for (let i = 0; i < content.childCount; i++) {
                            if (content.child(i).type.name === 'imageBlock') {
                                nodes.imageBlock.push(content.child(i))
                                if (content.child(i).attrs.src.startsWith(`${import.meta.env.VITE_SERVER_PATH}`)) {
                                    deleteImage(getPath(content.child(i).attrs.src))
                                }
                            }
                            else if (content.child(i).type.name === 'fileBlock') {
                                nodes.fileBlock.push(content.child(i))
                                deleteFile(getPath(content.child(i).attrs.src))
                            }
                            else {
                                content.child(i).descendants(child => {
                                    if (child.type.name === 'mention') {
                                        nodes.internalLink.push(child)
                                        deleteLink(child.attrs.id, currentNote.id)
                                    }
                                })
                            }
                        }
                        if (nodes.fileBlock.length || nodes.imageBlock.length || nodes.internalLink.length) {
                            skip = true
                        }
                        console.log(nodes)
                        // return false
                    }

                    // Check if the cursor is directly after such a node
                    else {
                        const { $cursor } = editor.state.selection as TextSelection;
                        // node at top level
                        if (!$cursor.nodeBefore && $cursor.nodeAfter) {
                            let node = null
                            if (selection.$from.index(-1) > 0) {
                                node = selection.$from.node(-1).child(selection.$from.index(-1) - 1)
                                if (node.type.name === 'imageBlock') {
                                    if (node.attrs.src.startsWith(`${import.meta.env.VITE_SERVER_PATH}`)) {
                                        deleteImage(getPath(node.attrs.src))
                                        skip = true
                                    }
                                }
                                else if (node.type.name === 'fileBlock') {
                                    deleteFile(getPath(node.attrs.src))
                                    skip = true
                                }
                            }
                            // return false
                        }

                        // other cases
                        else if ($cursor && $cursor.nodeBefore) {
                            if ($cursor.nodeBefore.type.name === 'mention') {
                                deleteLink($cursor.nodeBefore.attrs.id, currentNote.id)
                                skip = true
                            }
                        }

                        console.log(editor.state.selection.content().content)
                        // return false; // Let other handlers handle the backspace key
                    }
                    // if (skip) editor.chain().setMeta('addToHistory', false).deleteSelection().joinBackward().selectNodeBackward().run()
                    // else editor.chain().deleteSelection().joinBackward().selectNodeBackward().run()
                    return false
                },
                // 'Mod-z': () => {
                //     if (!this.editor.can().undo()) {
                //         toast({
                //             title: `Cannot undo`,
                //             status: "error",
                //             isClosable: true,
                //         })
                //     }
                //     return false
                // },
                // 'Shift-Mod-z': () => {
                //     if (!this.editor.can().undo()) {
                //         toast({
                //             title: `Cannot redo`,
                //             status: "error",
                //             isClosable: true,
                //         })
                //     }
                //     return false
                // },
                // 'Mod-y': () => {
                //     if (!this.editor.can().undo()) {
                //         toast({
                //             title: `Cannot redo`,
                //             status: "error",
                //             isClosable: true,
                //         })
                //     }
                //     return false
                // },
            }
        },
    })
}

export default DeletionTracking
