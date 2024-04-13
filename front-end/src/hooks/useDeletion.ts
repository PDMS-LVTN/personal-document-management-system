import { APIEndPoints } from "../api/endpoint";
import { useApi } from "./useApi";
import { AxiosRequestConfig } from "axios";

export const useDeletion = () => {
    const callApi = useApi()

    const deleteImage = async (path: string) => {
        const options: AxiosRequestConfig = {
            method: "DELETE",
            data: { path }
        }
        return await callApi(`${APIEndPoints.IMAGE_CONTENT}`, options)
    }

    const deleteFile = async (path) => {
        const options: AxiosRequestConfig = {
            method: "DELETE",
            data: { path }
        }
        return await callApi(`${APIEndPoints.FILE_UPLOAD}`, options)
    }

    const deleteLink = async (head: string, back: string) => {
        const options: AxiosRequestConfig = {
            method: "DELETE",
            data: { backlink_id: back }
        }
        return await callApi(`${APIEndPoints.INTERNAL_LINK}/${head}`, options)
    }

    return { deleteImage, deleteFile, deleteLink };

}