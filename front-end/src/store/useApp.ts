import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

export interface Note {
    id: string,
    title: string,
    content: string,
    size?: number,
    read_only?: boolean,
    is_pinned: boolean,
    is_favorited: boolean,
    parent_id: string,
    user_id?: string,
    childNotes?: Note[]
}
// export interface TreeData {
//     title: string;
//     childNotes?: TreeData[];
//     id: string;
//     parent?: string
// };

// interface Tree {
//     notes: any[]
//     setNote: (obj) => void
// }

interface Tag {
    value: string
    label: string
    id: string
}
interface AppStore {
    expired: boolean
    setExpired: (isExpired: boolean) => void
    currentTab: string
    setCurrentTab: (tab: string) => void
    currentNote: Note | undefined
    setCurrentNote: (note: Note | undefined) => void
    // list of editing notes that are not yet saved
    dirtyNotes: string[]
    addDirtyNote: (noteId: string) => void
    removeDirtyNote: (noteId: string) => void
    clean: () => void,
    // treeItems: TreeData[],
    // setTree: (data) => void,
    // currentTree: Tree,
    // setCurrentTree: (notes, func) => void,
    // clearCurrentTree: () => void,
    allTags: Tag[]
    setAllTags: (tags) => void
    currentTags: Tag[]
    setCurrentTags: (tags) => void
    isMerge?: boolean
    setIsMerge?: (isMerge: boolean) => void
}

export const useApp = create<AppStore>()(devtools(persist((set) => ({
    expired: false,
    setExpired: (isExpired) => set((state) => ({ ...state, expired: isExpired })),
    currentTab: "note",
    setCurrentTab: (tab) => set((state) => ({ ...state, currentTab: tab })),
    currentNote: null,
    setCurrentNote: (note) => set((state) => ({ ...state, currentNote: note })),
    dirtyNotes: [],
    addDirtyNote: (noteId) => set((state) => ({ ...state, dirtyNotes: [...state.dirtyNotes, noteId] })),
    removeDirtyNote: (noteId) => set((state) => ({
        ...state,
        dirtyNotes:
            state.dirtyNotes.filter((id) => id !== noteId)
    })),
    // this method need to reset every state when user is logged out
    // clean: () => set({ expired: false, currentNote: null, dirtyNotes: [], currentTree: null, treeItems: null, allTags: [], currentTags: [] }),
    clean: () => set({ expired: false, currentNote: null, dirtyNotes: [], allTags: [], currentTags: [] }),
    // treeItems: [],
    // setTree: (data) => set((state) => ({ ...state, treeItems: data })),
    // currentTree: null,
    // setCurrentTree: (notes, func) => set((state) => ({ ...state, currentTree: { notes: notes, setNote: func } })),
    // clearCurrentTree: () => set((state) => ({ ...state, currentTree: null })),
    allTags: [],
    setAllTags: (tags) => set((state) => ({ ...state, allTags: tags })),
    currentTags: [],
    setCurrentTags: (tags) => set((state) => ({ ...state, currentTags: tags })),
    isMerge: false,
    setIsMerge: (isMerge) => set((state) => ({ ...state, isMerge: isMerge }))
}), { name: "app store" })))