import { useApp } from "../store/useApp";
import useAxiosJWT from "./useAxiosJWT";
import { useAuthentication } from "../store/useAuth";
import { APIEndPoints } from "../api/endpoint";

export const useTags = () => {

    const clean = useApp((state) => state.clean);
    const axiosJWT = useAxiosJWT();

    const auth = useAuthentication((state) => state.auth);
    const setAuth = useAuthentication((state) => state.setAuth);

    const currentTags = useApp((state) => state.currentTags);
    const setCurrentTags = useApp((state) => state.setCurrentTags);

    const allTags = useApp((state) => state.allTags);
    const setAllTags = useApp((state) => state.setAllTags);

    const createTag = async (newTag, note_id, isSelectedTag) => {
        console.log(newTag, note_id);
        try {
            const response = await axiosJWT.post(
                APIEndPoints.CREATE_TAG,
                JSON.stringify({
                    user_id: auth.id,
                    description: newTag,
                    notes: [note_id],
                }),
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
            console.log(response.data);
            const newOption = { value: newTag, label: newTag , id: response.data.id}
            setCurrentTags([...currentTags, newOption]);
            if (!isSelectedTag) {
                setAllTags([...allTags, newOption]);
            }

        } catch (error) {
            console.log(error);
            if (error.response?.status === 403 || error.response?.status === 401) {
                setAuth(undefined);
                clean();
            }
        }
    }

    const deleteTagInNote = async (deleteTagId, note_id) => {
        console.log(deleteTagId, note_id);
        try {
            const response = await axiosJWT.delete(`tag/${deleteTagId}`, 
            {   
                data: {
                    note_id: note_id
                },
                headers: { "Content-Type": "application/json" },
            });
            console.log(response.data);
            setCurrentTags(currentTags.filter((tag) => tag.id !== deleteTagId));
        } catch (error) {
            if (error.response?.status === 403 || error.response?.status === 401) {
                setAuth(undefined);
                clean();
            }
        }
    };

return { createTag, deleteTagInNote }; 

}