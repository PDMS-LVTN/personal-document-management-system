import { useState } from "react";
import { useApp } from "../store/useApp";
import useAxiosJWT from "./useAxiosJWT";
import { useToast } from "@chakra-ui/react";
import { useAuthentication } from "../store/useAuth";
import { APIEndPoints } from "../api/endpoint";
import { tempState } from "@/editor/lib/api";
// import markdown from "../assets/default-content.md?raw";
// import { useTags } from "./useTags";
import { useApi } from "./useApi";
// import { initialContent } from "@/editor/lib/data/initialContent";
import { convertToHtml } from "mammoth";

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

  const callApi = useApi();

  // const { getAllTags } = useTags()

  const createNote = async (id) => {
    const initialContent = "<p> Hello world </p>";
    try {
      const response = await axiosJWT.post(
        APIEndPoints.CREATE_NOTE,
        JSON.stringify({
          user_id: auth.id,
          title: "Untitled",
          content: initialContent,
          read_only: false,
          size: 0,
          parent_id: id,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
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
      // ref?.current?.setMarkdown(markdown);
      console.log(response.data.content);
      window.editor.commands.setContent(initialContent);
      return currentNote;
    } catch (error) {
      console.log(error);
      if (error.response?.status === 403 || error.response?.status === 401) {
        setAuth(undefined);
        clean();
      }
    }
  };

  const updateNote = async () => {
    setLoading(true);
    console.log(tempState.waitingImage);
    // const processedMarkdown: string = ref?.current?.getMarkdown().trim();
    const editorContent = window.editor.getHTML();
    const formData = new FormData();
    // Append each of the files
    tempState.waitingImage.forEach((file) => {
      formData.append("files[]", file);
    });
    formData.append(
      "data",
      JSON.stringify({
        content: editorContent,
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
  };

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
      setLoading(false);
      return response.data;
    } catch (error) {
      if (error.response?.status === 403 || error.response?.status === 401) {
        setAuth(undefined);
        clean();
      }
      setLoading(false);
    }
  };

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
  };

  const clickANoteHandler = async (id) => {
    const noteItem = await getANote(id);
    console.log(noteItem);
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
    });
    console.log("current_tag", tags);
    setCurrentTags(tags);
    // ref?.current?.setMarkdown(noteItem.content);
    window.editor.commands.setContent(noteItem.content);
    return noteItem;
  };

  const handleSearch = async (keyword) => {
    setLoading(true);
    const options = {
      method: "POST",
      data: { user_id: auth.id, keyword: keyword },
    };
    const { responseData } = await callApi(APIEndPoints.SEARCH, options);
    setLoading(false);
    return responseData;
  };

  const importNote = async (parentId, file) => {
    setLoading(true);
    const tempState = { waitingImages: [], content: "" };
    await convertToHtml({ arrayBuffer: file })
      .then(async function (result) {
        tempState.content = result.value;
        const images = tempState.content.match(/<img[^>]+src="([^">]+)/g); // Extract img tags
        const urls = [];

        if (images) {
          for (const imgTag of images) {
            const src = imgTag.match(/src="([^">]+)/)[1]; // Extract src attribute value
            const response = await fetch(src);
            const blob = await response.blob();
            const type = src.substring(5, src.indexOf(";"));
            const ext = type.substring(6);
            const image = new File([blob], "File name", { type: type });

            const url = URL.createObjectURL(image);
            const pos = url.lastIndexOf("/");
            const fileName = url.substring(pos + 1);

            const newFile = new File([image], fileName + "." + ext, {
              type: image.type,
            });
            tempState.waitingImages.push(newFile);
            urls.push(url);
          }
        }

        if (urls.length > 0) {
          let currentIndex = 0;
          tempState.content = tempState.content.replace(
            /<p>(<img[^>]+>)<\/p>/g,
            (match, imgTag) => {
              const newUrl = urls[currentIndex];
              currentIndex++;
              return imgTag.replace(/src="([^"]+)"/, `src="${newUrl}"`);
            }
          );
        }
      })
      .catch(function (error) {
        console.error(error);
      });
    const formData = new FormData();
    // Append each of the files
    tempState.waitingImages.forEach((file) => {
      formData.append("files[]", file);
    });
    formData.append(
      "data",
      JSON.stringify({
        user_id: auth.id,
        title: "Untitled",
        content: tempState.content,
        read_only: false,
        size: 0,
        parent_id: parentId,
      })
    );
    try {
      const response = await axiosJWT.post(`note/import`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (!parentId) {
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
        parent: response.data.parent_id,
        is_favorited: false,
        is_pinned: false,
      };
      setCurrentNote(currentNote);
      window.editor.commands.setContent(tempState.content);
      return currentNote;
    } catch (error) {
      if (error.response?.status === 403 || error.response?.status === 401) {
        setAuth(undefined);
        clean();
      }
    }
  };

  return {
    isLoading,
    actions: {
      createNote,
      updateNote,
      deleteNote,
      getAllNotes,
      getANote,
      clickANoteHandler,
      handleSearch,
      importNote,
    },
  };
};

export default useNotes;
