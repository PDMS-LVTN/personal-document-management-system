import { AxiosRequestConfig } from 'axios'
import { useApp } from '../store/useApp';
import useAxiosJWT from './useAxiosJWT';
import { useAuthentication } from '../store/useAuth';

export const useApi = () => {
    let responseData, responseError
    const clean = useApp((state) => state.clean);
    const axiosJWT = useAxiosJWT();
    const setAuth = useAuthentication((state) => state.setAuth);
    const defaultOptions: AxiosRequestConfig = {
        headers: { "Content-Type": "application/json" },
    }

    const callApi = async (url: string, options?: AxiosRequestConfig) => {
        try {
            const response = await axiosJWT(url, { ...defaultOptions, ...options })
            console.log(response.data)
            responseData = response.data
        }
        catch (error) {
            console.log(error)
            if (error.response?.status === 403 || error.response?.status === 401) {
                setAuth(undefined);
                clean();
            }
            responseError = error
        }

        return { responseData, responseError }
    }

    return callApi
}