import { useApp } from "../store/useApp";
import { useAuthentication } from "../store/useAuth";

const useLogout = () => {
    const remove = () => {
        const setAuth = useAuthentication((state) => state.setAuth);
        const setExpired = useApp((state) => state.setExpired)
        const setCurrentNote = useApp((state) => state.setCurrentNote)
        console.log("out here")

        setAuth(undefined)
        setCurrentNote(undefined)
        setExpired(true)
    }
    return { remove }
}

export default useLogout