import { useAuthentication } from "../store/useAuth";
import { APIEndPoints } from "../api/endpoint";
import { useApi } from "./useApi";
import { AxiosRequestConfig } from "axios";

export const useInternalLinks = () => {
    const auth = useAuthentication((state) => state.auth);
    const callApi = useApi()

    const getHeadlinks = async (noteId: string, name: string) => {
        const options: AxiosRequestConfig = {
            method: "GET",
            params: { name: `@${name}` }
        }
        return await callApi(`${APIEndPoints.INTERNAL_LINK}/head/${noteId}`, options)
    }

    const getBacklinks = async (noteId: string, name: string) => {
        const options: AxiosRequestConfig = {
            method: "GET",
            params: { name: `@${name}` }
        }
        return await callApi(`${APIEndPoints.INTERNAL_LINK}/back/${noteId}`, options)
    }

    return { getHeadlinks, getBacklinks };

}