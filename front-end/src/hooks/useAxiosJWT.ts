import { axiosJWT } from "../api/axios";
import { useAuthentication } from "../store/useAuth";
import { useEffect } from 'react'

// https://stackoverflow.com/questions/73140563/axios-throwing-cancelederror-with-abort-controller-in-react
const useAxiosJWT = () => {
    const auth = useAuthentication((state) => state.auth)

    useEffect(() => {
        console.log("use axios")
        const requestIntercept = axiosJWT.interceptors.request.use(
            config => {
                config.headers["Authorization"] = "Bearer " + auth.accessToken;
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
    }, [auth])

    return axiosJWT
}

export default useAxiosJWT