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
    // list of editing notes that is not yet saved
    dirtyNotes: string[]
    addDirtyNote: (noteId: string) => void
    removeDirtyNote: (noteId: string) => void
}

export const useApp = create<AppStore>()(devtools(persist((set) => ({
    expired: false,
    setExpired: (state) => set({ expired: state }),
    currentTab: "note",
    setCurrentTab: (tab) => set({ currentTab: tab }),
    currentNote: undefined,
    setCurrentNote: (note) => set({ currentNote: note }),
    dirtyNotes: [],
    addDirtyNote: (noteId) => set((state) => ({ dirtyNotes: [...state.dirtyNotes, noteId] })),
    removeDirtyNote: (noteId) => set((state) => ({
        dirtyNotes:
            state.dirtyNotes.filter((id) => id !== noteId)
    })),

}), { name: "note" })))