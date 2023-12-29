import { axiosJWT } from "../api/axios";
import { useAuthentication } from "../store/useAuth";
import { useEffect } from 'react'

const useAxiosJWT = () => {
    const auth = useAuthentication((state) => state.auth)

    useEffect(() => {
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