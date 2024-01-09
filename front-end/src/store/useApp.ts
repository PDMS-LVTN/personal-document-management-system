import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

export interface Note {
    id: string;
    title: string;
    content: string;
    parent?: string
}

export interface TreeData {
    title: string;
    childNotes?: TreeData[];
    id: string;
};

interface Tree {
    notes: any[]
    setNote: (obj) => void
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
    treeItems: TreeData[],
    setTree: (data) => void,
    currentTree: Tree,
    setCurrentTree: (notes, func) => void,
    clearCurrentTree: () => void,
}

export const useApp = create<AppStore>()(devtools(persist((set) => ({
    expired: false,
    setExpired: (isExpired) => set((state) => ({ ...state, expired: isExpired })),
    currentTab: "note",
    setCurrentTab: (tab) => set((state) => ({ ...state, currentTab: tab })),
    currentNote: undefined,
    setCurrentNote: (note) => set((state) => ({ ...state, currentNote: note })),
    dirtyNotes: [],
    addDirtyNote: (noteId) => set((state) => ({ ...state, dirtyNotes: [...state.dirtyNotes, noteId] })),
    removeDirtyNote: (noteId) => set((state) => ({
        ...state,
        dirtyNotes:
            state.dirtyNotes.filter((id) => id !== noteId)
    })),
    clean: () => set({ expired: false, currentNote: undefined, dirtyNotes: [], currentTree: undefined, treeItems: undefined }),
    treeItems: [],
    setTree: (data) => set((state) => ({ ...state, treeItems: data })),
    currentTree: null,
    setCurrentTree: (notes, func) => set((state) => ({ ...state, currentTree: { notes: notes, setNote: func } })),
    clearCurrentTree: () => set((state) => ({ ...state, currentTree: null })),

}), { name: "app store" })))