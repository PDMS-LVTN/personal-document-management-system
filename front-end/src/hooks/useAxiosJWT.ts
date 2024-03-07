import { axiosJWT } from "../api/axios";
import { useAuthentication } from "../store/useAuth";
import { useEffect, useRef } from 'react'

// https://stackoverflow.com/questions/73140563/axios-throwing-cancelederror-with-abort-controller-in-react
// https://stackoverflow.com/questions/73147257/infinite-re-render-using-zustand
const useAxiosJWT = () => {

    // const auth = useAuthentication((state) => state.auth)
    const authRef = useRef(useAuthentication.getState().auth)

    // Connect to the store on mount, disconnect on unmount, catch state-changes in a reference
    useEffect(() => useAuthentication.subscribe(
        state => (authRef.current = state.auth)
    ), [])

    useEffect(() => {
        // BUG: this still logged multiple times
        console.log("use axios")
        const requestIntercept = axiosJWT.interceptors.request.use(
            config => {
                config.headers["Authorization"] = "Bearer " + authRef.current.accessToken;
                return config
            },
            (error) => Promise.reject(error)
        )
        const responseIntercept = axiosJWT.interceptors.response.use(response => response,
            (error) => {
                console.log(error)
                return Promise.reject(error);
            })

        return () => {
            axiosJWT.interceptors.request.eject(requestIntercept)
            axiosJWT.interceptors.response.eject(responseIntercept)
        }
    }, [])

    return axiosJWT
}

export default useAxiosJWT