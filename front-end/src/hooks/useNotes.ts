import { useCallback, useState } from "react";
import { useApp } from "../store/useApp";
import useAxiosJWT from "./useAxiosJWT";
import { useToast } from "@chakra-ui/react";
import { useAuthentication } from "../store/useAuth";
import { APIEndPoints } from "../api/endpoint";
import { tempState } from "../editor/_boilerplate";
// import markdown from "../assets/default-content.md?raw";
import { useTags } from "./useTags";
import { useApi } from "./useApi";

const useNotes = (ref) => {
    const [isLoading, setLoading] = useState<boolean>(false);

    const clean = useApp((state) => state.clean);
    const setCurrentNote = useApp((state) => state.setCurrentNote);
    const axiosJWT = useAxiosJWT();
    const toast = useToast();

    const auth = useAuthentication((state) => state.auth);
    const setAuth = useAuthentication((state) => state.setAuth);

    const currentTree = useApp((state) => state.currentTree);
    const setTree = useApp((state) => state.setTree);
    const clearCurrentTree = useApp((state) => state.clearCurrentTree);
    const treeItems = useApp((state) => state.treeItems);
    const currentNote = useApp((state) => state.currentNote);
    const setCurrentTags = useApp((state) => state.setCurrentTags);

    const callApi = useApi()

    // const { getAllTags } = useTags()

    const createNote = async (id, markdown) => {
        console.log(markdown);
        try {
            const response = await axiosJWT.post(
                APIEndPoints.CREATE_NOTE,
                JSON.stringify({
                    user_id: auth.id,
                    title: "Untitled",
                    content: markdown,
                    read_only: false,
                    size: 0,
                    parent_id: id,
                }),
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
            console.log(response.data);
            if (!id) {
                setTree([
                    ...treeItems,
                    {
                        title: response.data.title,
                        id: response.data.id,
                        childNotes: [],
                    },
                ]);
            }
            const currentNote = {
                id: response.data.id,
                title: response.data.title,
                content: response.data.content,
                parent: response.data.parentNote.id,
                is_favorited: false,
                is_pinned: false,
            };
            setCurrentNote(currentNote);
            ref?.current?.setMarkdown(markdown);
            return currentNote;
        } catch (error) {
            console.log(error);
            if (error.response?.status === 403 || error.response?.status === 401) {
                setAuth(undefined);
                clean();
            }
        }
    }

    const updateNote = async () => {
        setLoading(true);
        console.log(tempState.waitingImage);
        const processedMarkdown: string = ref?.current?.getMarkdown().trim();
        const formData = new FormData();
        // Append each of the files
        tempState.waitingImage.forEach((file) => {
            formData.append("files[]", file);
        });
        formData.append(
            "data",
            JSON.stringify({
                content: processedMarkdown,
                title: currentNote?.title,
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
            console.log(response);
            toast({
                title: `Your note has been updated. 🙂`,
                status: "success",
                isClosable: true,
            });
            tempState.waitingImage = [];
            console.log(currentNote.parent);
            if (!currentNote.parent) {
                let index = treeItems.findIndex((x) => x.id === currentNote.id);
                if (index != -1) {
                    setTree([
                        ...treeItems.slice(0, index),
                        {
                            ...treeItems[index],
                            title: currentNote?.title,
                        },
                        ...treeItems.slice(index + 1),
                    ]);
                }
            } else {
                let index = currentTree.notes.findIndex((x) => x.id === currentNote.id);
                if (index != -1) {
                    currentTree.setNote([
                        ...currentTree.notes.slice(0, index),
                        {
                            ...currentTree.notes[index],
                            title: currentNote?.title,
                        },
                        ...currentTree.notes.slice(index + 1),
                    ]);
                }
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            toast({
                title: `Some error happened! 😢`,
                status: "error",
                isClosable: true,
            });
            setLoading(false);
        }
    }

    const deleteNote = async (id) => {
        try {
            await axiosJWT.delete(`note/${id}`, {
                headers: { "Content-Type": "application/json" },
            });
            // this part only handle deletion of the currently opened note
            // deletion from menu that is not associated with any opened note will be handled inside treeview
            if (currentNote && currentNote?.id == id) {
                if (!currentNote.parent) {
                    let index = treeItems.findIndex((x) => x.id === id);
                    if (index != -1) {
                        setTree([
                            ...treeItems.slice(0, index),
                            ...treeItems.slice(index + 1),
                        ]);
                    }
                } else {
                    let index = currentTree.notes.findIndex((x) => x.id === id);
                    if (index != -1) {
                        currentTree.setNote([
                            ...currentTree.notes.slice(0, index),
                            ...currentTree.notes.slice(index + 1),
                        ]);
                    }
                }
                setCurrentNote(null);
                clearCurrentTree();
            }
            toast({
                title: `Your note has been deleted.`,
                status: "success",
                isClosable: true,
            });
        } catch (error) {
            if (error.response?.status === 403 || error.response?.status === 401) {
                setAuth(undefined);
                clean();
            }
        }
    };

    const getAllNotes = async (controller) => {
        setLoading(true);
        try {
            const response = await axiosJWT.post(
                APIEndPoints.ALL_NOTE,
                JSON.stringify({ user_id: auth.id }),
                {
                    headers: { "Content-Type": "application/json" },
                    signal: controller.signal,
                }
            );
            console.log(response.data);
            setLoading(false)
            return response.data
        } catch (error) {
            if (error.response?.status === 403 || error.response?.status === 401) {
                setAuth(undefined);
                clean();
            }
            setLoading(false)
        }
    }

    const getANote = async (id) => {
        try {
            const response = await axiosJWT.get(`note/${id}`, {
                headers: { "Content-Type": "application/json" },
            });
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }

    const clickANoteHandler = async (id) => {
        const noteItem = await getANote(id)
        console.log(noteItem)
        setCurrentNote({
            title: noteItem?.title,
            id: noteItem?.id,
            content: noteItem?.content,
            parent: noteItem?.parent_id,
            is_favorited: noteItem.is_favorited,
            is_pinned: noteItem.is_pinned,
        });
        const tags = noteItem.tags.map((tag) => {
            return { value: tag.description, label: tag.description, id: tag.id };
        })
        console.log('current_tag', tags);
        setCurrentTags(tags);
        ref?.current?.setMarkdown(noteItem.content);
        return noteItem;
    }

    const handleSearch = async (keyword) => {
        setLoading(true)
        const options = {
            method: "POST",
            data: { user_id: auth.id, keyword: keyword }
        }
        const { responseData } = await callApi(APIEndPoints.SEARCH, options)
        setLoading(false)
        return responseData
    };

    return { isLoading, actions: { createNote, updateNote, deleteNote, getAllNotes, getANote, clickANoteHandler, handleSearch } }
}

export default useNotes;