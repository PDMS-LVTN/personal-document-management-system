// import { useContext, useEffect, useMemo, useState } from 'react'

import { Editor, useEditor } from '@tiptap/react'
// import Ai from '@tiptap-pro/extension-ai'
// import Collaboration from '@tiptap/extension-collaboration'
// import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
// import { TiptapCollabProvider, WebSocketStatus } from '@hocuspocus/provider'
// import * as Y from 'yjs'

import { ExtensionKit } from '@/editor/extensions/extension-kit'
// import History from '@tiptap/extension-history'
// import { EditorContext } from '../context/EditorContext'
// import { userColors, userNames } from '../lib/constants'
// import { randomElement } from '../lib/utils'
// import { EditorUser } from '../components/BlockEditor/types'
import { useSidebar } from './useSidebar'
// import { initialContent } from '@/editor/lib/data/initialContent'
import { useApp } from '@/store/useApp'
import API from '../lib/api'
import useNotes from '@/hooks/useNotes'
import { useCallback, useState } from 'react'
import { debounce } from 'lodash'
import { useUpload } from '@/hooks/useUpload'
import { EditorView } from '@tiptap/pm/view'

// const TIPTAP_AI_APP_ID = process.env.NEXT_PUBLIC_TIPTAP_AI_APP_ID
// const TIPTAP_AI_BASE_URL = process.env.NEXT_PUBLIC_TIPTAP_AI_BASE_URL || 'https://api.tiptap.dev/v1/ai'

declare global {
    interface Window {
        editor: Editor | null
    }
}

// export const useBlockEditor = ({
//   aiToken,
//   ydoc,
//   provider,
// }: {
//   aiToken: string
//   ydoc: Y.Doc
//   provider?: TiptapCollabProvider | null | undefined
// }) => {
export const useBlockEditor = (initialContent?) => {
    const leftSidebar = useSidebar()
    const currentNote = useApp((state) => state.currentNote);
    const { actions } = useNotes()
    const [isSaving, setIsSaving] = useState(false)
    //   const [collabState, setCollabState] = useState<WebSocketStatus>(WebSocketStatus.Connecting)
    //   const { setIsAiLoading, setAiError } = useContext(EditorContext)

    const debouncedHandle = useCallback(
        debounce(async () => {
            setIsSaving(true)
            await actions.updateNote()
            setIsSaving(false)
        }, 2000),
        [currentNote.id]
    );
    const { upload } = useUpload()
    async function uploadAndReplaceImages(imageUrls: string[], view: EditorView) {
        for (const url of imageUrls) {
            let file
            if (url.startsWith('data:image')) {
                const fetched = await fetch(url)
                const blob = await fetched.blob();
                const match = url.match(/^data:image\/([a-zA-Z+]+);base64,/);
                file = new File([blob], `image.${match[1]}`, { type: `image/${match[1]}` })
                const newUrl = await API.uploadFileDirect(file, upload)
                replaceImage(url, newUrl, view);
            }
            // else {
            //     const extPos = url.lastIndexOf('.')
            //     const ext = url.substring(extPos + 1)
            //     file = new File([blob], `image.${ext}`, { type: `image/${ext}` })
            // }
        }
    }

    function replaceImage(currentUrl: string, newUrl: string, view: EditorView) {
        view.state.doc.descendants((node, pos) => {
            if (
                node.type.name === 'imageBlock' &&
                node.attrs.src === currentUrl
            ) {
                const tr = view.state.tr.setNodeAttribute(pos, 'src', newUrl);
                view.dispatch(tr);
            }
        });
    }

    const editor = useEditor(
        {
            autofocus: true,
            onCreate: ({ editor }) => {
                // provider?.on('synced', () => {
                //     if (editor.isEmpty) {
                //         editor.commands.setContent(initialContent)
                //     }
                // })
                if (editor.isEmpty) {
                    if (initialContent)
                        editor.commands.setContent(initialContent)
                    else
                        editor.commands.setContent(currentNote?.content || '<p> Hello world </p>')
                }
            },
            onUpdate({ editor }) {
                // The content has changed.
                debouncedHandle()
            },
            extensions: [
                ...ExtensionKit(),
                // History,
                // Collaboration.configure({
                //   document: ydoc,
                // }),
                // CollaborationCursor.configure({
                //   provider,
                //   user: {
                //     name: randomElement(userNames),
                //     color: randomElement(userColors),
                //   },
                // }),
                // Ai.configure({
                //   appId: TIPTAP_AI_APP_ID,
                //   token: aiToken,
                //   baseUrl: TIPTAP_AI_BASE_URL,
                //   autocompletion: true,
                //   onLoading: () => {
                //     setIsAiLoading(true)
                //     setAiError(null)
                //   },
                //   onSuccess: () => {
                //     setIsAiLoading(false)
                //     setAiError(null)
                //   },
                //   onError: error => {
                //     setIsAiLoading(false)
                //     setAiError(error.message)
                //   },
                // }),
            ],
            editorProps: {
                attributes: {
                    autocomplete: 'off',
                    autocorrect: 'off',
                    autocapitalize: 'off',
                    // class: 'border border-gray-400 p-4 ',
                },
                // https://supun.io/pm-upload-on-paste
                handlePaste: (view, event, slice) => {
                    // const items = Array.from(event.clipboardData?.files || []);
                    const imageUrls = []
                    slice.content.descendants((node) => {

                        if (node.type.name === 'imageBlock') {
                            imageUrls.push(node.attrs.src)
                        }

                    })
                    // for (const item of items) {
                    //     if (item.type.indexOf("image") === 0) {
                    //         console.log(item)
                    //         // const ext = item.name.substring(item.name.indexOf("."));
                    //         const url = URL.createObjectURL(item);
                    //         // console.log(url)
                    //         // const pos = url.lastIndexOf("/");
                    //         // const fileName = url.substring(pos + 1);

                    //         // const newFile = new File([item], fileName + ext, { type: item.type });
                    //         images.push({ file: item, src: url })
                    //         // tempState.waitingImage.push(newFile);
                    //         // const url = await API.uploadFileDirect(item, upload)
                    //         // const node = view.state.schema.nodes.imageBlock.create({ src: url }); // creates the image element
                    //         // const transaction = view.state.tr.replaceSelectionWith(node); // places it in the correct position
                    //         // view.dispatch(transaction);
                    //         // return true; // handled

                    //     }
                    // }
                    setTimeout(() => {
                        uploadAndReplaceImages(imageUrls, view);
                    }, 100);
                    // return false; // not handled use default behaviour
                },
            },
            // [ydoc, provider],
        }
    )

    //   const users = useMemo(() => {
    //     if (!editor?.storage.collaborationCursor?.users) {
    //       return []
    //     }

    //     return editor.storage.collaborationCursor?.users.map((user: EditorUser) => {
    //       const names = user.name?.split(' ')
    //       const firstName = names?.[0]
    //       const lastName = names?.[names.length - 1]
    //       const initials = `${firstName?.[0] || '?'}${lastName?.[0] || '?'}`

    //       return { ...user, initials: initials.length ? initials : '?' }
    //     })
    //   }, [editor?.storage.collaborationCursor?.users])

    const characterCount = editor?.storage.characterCount || { characters: () => 0, words: () => 0 }

    //   useEffect(() => {
    //     provider?.on('status', (event: { status: WebSocketStatus }) => {
    //       setCollabState(event.status)
    //     })
    //   }, [provider])

    window.editor = editor

    // return { editor, users, characterCount, collabState, leftSidebar }
    return { editor, leftSidebar, characterCount, isSaving }
}