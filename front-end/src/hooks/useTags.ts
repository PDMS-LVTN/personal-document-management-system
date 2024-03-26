import { useAuthentication } from "../store/useAuth";
import { APIEndPoints } from "../api/endpoint";
import { useApi } from "./useApi";
import { AxiosRequestConfig } from "axios";

export const useTags = () => {
    const auth = useAuthentication((state) => state.auth);
    const callApi = useApi()

    const createTag = async (newTag: string, note_id: string) => {
        console.log(newTag, note_id);
        const options: AxiosRequestConfig = {
            method: "POST",
            data: JSON.stringify({
                user_id: auth.id,
                description: newTag,
                note_id: note_id,
            })
        }
        return await callApi(APIEndPoints.CREATE_TAG, options)
    }

    const deleteTagInNote = async (deleteTagId, note_id) => {
        console.log(deleteTagId, note_id);
        const options: AxiosRequestConfig = {
            method: "DELETE",
            data: {
                note_id: note_id
            }
        }
        return await callApi(`tag/${deleteTagId}`, options)
    }

    const getAllTags = async (controller) => {
        const options: AxiosRequestConfig = {
            method: "POST",
            data: { user_id: auth.id },
            signal: controller.signal
        }
        const { responseData, responseError } = await callApi(APIEndPoints.ALL_TAG, options)
        if (responseData) {
            const tags = responseData.map((tag) => {
                return { value: tag.description, label: tag.description, id: tag.id };
            })
            return { tags, responseError }
        }
        return { responseData, responseError }
    }

    const getNotesInTag = async (tagId) => {
        console.log(tagId);
        const options: AxiosRequestConfig = {
            method: "GET",
        }
        return await callApi(`tag/${tagId}`, options)
    }

    const deleteTag = async (tagId: string) => {
        console.log(tagId);
        const options: AxiosRequestConfig = {
            method: "DELETE",
        }
        return await callApi(`tag/${tagId}`, options)
    }

    const applyTag = async (tagId: string, noteId: string) => {
        console.log(tagId, noteId);
        const options: AxiosRequestConfig = {
            method: "POST",
            data: { note_id: noteId }
        }
        return await callApi(`tag/apply_tag/${tagId}`, options)
    }

    return { createTag, deleteTagInNote, getAllTags, getNotesInTag, deleteTag, applyTag };

}