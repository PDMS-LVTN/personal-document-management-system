import axios from "@/api/axios";
import { useApi } from "./useApi";

export const usePermission = () => {
    const callApi = useApi()

    const checkGeneralPermission = async (noteId: string) => {
        try {
            const response = await axios.get(`note/is_anyone/${noteId}`);
            return response.data
        }
        catch (err) {
            console.log(err)
        }
    };

    const checkPermissionWithEmail = async (noteId: string, email: string) => {
        const options = {
            method: "GET",
            params: { email },
        };
        return await callApi(
            `note_collaborator/${noteId}`,
            options
        );
    };

    const createPublicCollaborator = async (note_id: string, email: string) => {
        const options = {
            method: "POST",
            data: { note_id, email },
        };
        return await callApi(
            `public_collaborator`,
            options
        );
    };

    const getAllSharedNotes = async (email: string) => {
        const options = {
            method: "GET",
        };
        return await callApi(
            `note_collaborator/get_all_notes/${email}`,
            options
        );
    }

    return { checkGeneralPermission, checkPermissionWithEmail, createPublicCollaborator, getAllSharedNotes };

}