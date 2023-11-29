import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

interface User {
    email: string;
    accessToken: string;
}
interface AuthStore {
    auth: User | undefined; // Whatever you need to add here
    setAuth: (auth: User|undefined) => void;
}

export const useAuthentication = create<AuthStore>()(devtools(persist((set) => ({
    auth: undefined,
    setAuth: (newAuth) => set({ auth: newAuth })
}), { name: "user" })))