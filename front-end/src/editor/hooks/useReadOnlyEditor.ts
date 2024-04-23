import { Editor, useEditor } from '@tiptap/react'
import { ExtensionKit } from '@/editor/extensions/extension-kit'
import { useSidebar } from './useSidebar'
import { useApp } from '@/store/useApp'

declare global {
    interface Window {
        editor: Editor | null
    }
}

export const useReadOnlyEditor = (initialContent?) => {
    const leftSidebar = useSidebar()
    const currentNote = useApp((state) => state.currentNote);
    const editor = useEditor(
        {
            autofocus: true,
            onCreate: ({ editor }) => {
                if (editor.isEmpty) {
                    if (initialContent)
                        editor.commands.setContent(initialContent)
                    else
                        editor.commands.setContent(currentNote?.content || '<p> Hello world </p>')
                }
            },
            extensions: [
                ...ExtensionKit(),
            ],
            editorProps: {
                attributes: {
                    autocomplete: 'off',
                    autocorrect: 'off',
                    autocapitalize: 'off',
                },
            },
        }
    )

    const characterCount = editor?.storage.characterCount || { characters: () => 0, words: () => 0 }
    window.editor = editor

    return { editor, leftSidebar, characterCount }
}