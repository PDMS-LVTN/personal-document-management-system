import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

export interface Note {
    id: string;
    title: string;
    content: string;
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
    clean: () => void
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
    clean: () => set({ expired: false, currentNote: undefined, dirtyNotes: [] })

}), { name: "app store" })))