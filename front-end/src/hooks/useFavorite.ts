import { APIEndPoints } from "../api/endpoint";
import { useApp } from "../store/useApp";
import useAxiosJWT from "./useAxiosJWT";
import { useToast } from "@chakra-ui/react";
import { useAuthentication } from "../store/useAuth";

export const useFavorite = () => {
    const clean = useApp((state) => state.clean);
    const axiosJWT = useAxiosJWT();
    const toast = useToast();

    const auth = useAuthentication((state) => state.auth);
    const setAuth = useAuthentication((state) => state.setAuth);
    const currentNote = useApp((state) => state.currentNote);
    const setCurrentNote = useApp((state) => state.setCurrentNote);

    const getFavoriteNotes = async () => {
        try {
            const response = await axiosJWT.post(
                APIEndPoints.FAVORITE_NOTE,
                JSON.stringify({ user_id: auth.id }),
                {
                    headers: { "Content-Type": "application/json" },
                    // signal: controller.signal,
                }
            );
            console.log(response.data);
            return response.data
        } catch (error) {
            if (error.response?.status === 403 || error.response?.status === 401) {
                setAuth(undefined);
                clean();
            }
        }
    }

    // BUG: Multiple instances of the same note in the tree are not updated/deleted at the same time 
    const updateFavorite = async () => {
        const formData = new FormData();
        formData.append(
            "data",
            JSON.stringify({
                is_favorited: !currentNote?.is_favorited,
            })
        );
        try {
            const response = await axiosJWT.patch(
                `note/${currentNote.id}`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            console.log(response.data);
            setCurrentNote({
                ...currentNote,
                is_favorited: !currentNote.is_favorited,
            });
            toast({
                title: `Your note has been updated. 🙂`,
                status: "success",
                isClosable: true,
            });
        } catch (error) {
            console.log(error);
            toast({
                title: `Some error happened! 😢`,
                status: "error",
                isClosable: true,
            });
        }
    }

    return { getFavoriteNotes, updateFavorite }
}