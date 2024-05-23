import { create } from 'zustand'
import { persist, devtools, createJSONStorage } from 'zustand/middleware'
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
    parentPath?: [],
    shared: boolean
}

interface stackUndoRedo {
    stackUndo: string[],
    stackRedo: string[]
}
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
    clean: () => void,
    allTags: Tag[]
    setAllTags: (tags) => void
    currentTags: Tag[]
    setCurrentTags: (tags) => void
    isMerge?: boolean
    setIsMerge?: (isMerge: boolean) => void
    stackHistory?: stackUndoRedo
    setStackHistory?: (stack: stackUndoRedo) => void
}

export const useApp = create<AppStore>()(devtools(persist((set) => ({
    expired: false,
    setExpired: (isExpired) => set((state) => ({ ...state, expired: isExpired })),
    currentTab: "note",
    setCurrentTab: (tab) => set((state) => ({ ...state, currentTab: tab })),
    currentNote: null,
    setCurrentNote: (note) => set((state) => ({ ...state, currentNote: note })),
    // this method need to reset every state when user is logged out
    clean: () => set({ expired: false, currentNote: null, allTags: [], currentTags: [], stackHistory: { stackUndo: [], stackRedo: [] } }),
    allTags: [],
    setAllTags: (tags) => set((state) => ({ ...state, allTags: tags })),
    currentTags: [],
    setCurrentTags: (tags) => set((state) => ({ ...state, currentTags: tags })),
    isMerge: false,
    setIsMerge: (isMerge) => set((state) => ({ ...state, isMerge: isMerge })),
    stackHistory: { stackUndo: [], stackRedo: [] },
    setStackHistory: (stack) => set((state) => ({ ...state, stackHistory: stack }))
}), { name: `app store`, storage: createJSONStorage(() => sessionStorage) })))