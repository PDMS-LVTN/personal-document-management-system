import { useState } from "react";
import { useApp } from "../store/useApp";
import useAxiosJWT from "./useAxiosJWT";
import { useToast } from "@chakra-ui/react";
import { useAuthentication } from "../store/useAuth";
import { APIEndPoints } from "../api/endpoint";
import { tempState } from "@/editor/lib/api";
import { useApi } from "./useApi";
import { convertToHtml } from "mammoth";

const useNotes = () => {
  // console.log("use notes")
  const [isLoading, setLoading] = useState<boolean>(false);

  const clean = useApp((state) => state.clean);
  const setCurrentNote = useApp((state) => state.setCurrentNote);
  const axiosJWT = useAxiosJWT();
  const toast = useToast();

  const auth = useAuthentication((state) => state.auth);
  const setAuth = useAuthentication((state) => state.setAuth);

  const currentNote = useApp((state) => state.currentNote);
  const setCurrentTags = useApp((state) => state.setCurrentTags);

  const callApi = useApi();

  // const { getAllTags } = useTags()

  const createNote = async (id: string, title?: string) => {
    const initialContent = "<p>Start writing your notes</p>";
    try {
      const response = await axiosJWT.post(
        APIEndPoints.CREATE_NOTE,
        JSON.stringify({
          user_id: auth.id,
          title: title || "Untitled",
          content: initialContent,
          read_only: false,
          size: 0,
          parent_id: id,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response.data);
      const currentNote = {
        id: response.data.id,
        title: response.data.title,
        content: response.data.content,
        parent_id: response.data.parent_id,
        is_favorited: false,
        is_pinned: false,
      };
      setCurrentNote(currentNote);
      // ref?.current?.setMarkdown(markdown);
      window.editor?.commands.setContent(response.data.content);
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
      setCurrentNote(null);
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
      setLoading(false);
      if (error.response?.status === 403 || error.response?.status === 401) {
        setAuth(undefined);
        clean();
      }
    }
  };

  const getANote = async (id) => {
    const options = {
      method: "GET",
    };
    const { responseData } = await callApi(`note/${id}`, options);
    return responseData;
  };

  const clickANoteHandler = async (id) => {
    const noteItem = await getANote(id);
    console.log(noteItem);
    setCurrentNote({
      title: noteItem?.title,
      id: noteItem?.id,
      content: noteItem?.content,
      parent_id: noteItem?.parent_id,
      is_favorited: noteItem.is_favorited,
      is_pinned: noteItem.is_pinned,
    });
    const tags = noteItem.tags.map((tag) => {
      return { value: tag.description, label: tag.description, id: tag.id };
    });
    console.log("current_tag", tags);
    setCurrentTags(tags);
    // ref?.current?.setMarkdown(noteItem.content);
    window.editor?.commands.setContent(noteItem.content);
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

  async function replaceAsync(
    string: string,
    regexp: RegExp,
    replacerFunction,
    tempState
  ) {
    const replacements = await Promise.all(
      Array.from(string.matchAll(regexp), (match) =>
        replacerFunction(tempState, ...match)
      )
    );
    let i = 0;
    console.log(replacements);
    return string.replace(regexp, () => replacements[i++]);
  }

  async function replaceImageTag(temp, ...group) {
    const src = group[1];
    console.log(src);
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
    temp.waitingImages.push(newFile);
    return group[0].replace(/src="[^"]+"/, `src="${url}"`);
  }

  const importNote = async (parentId, file) => {
    setLoading(true);
    let title = file.name.substring(0, file.name.indexOf("."));
    const tempState = { waitingImages: [], content: "" };
    try {
      const result = await convertToHtml({ arrayBuffer: file });
      tempState.content = result.value;

      const regex = '<img[^>]*?src="([^>]+)"[^>]*>';
      const regexp = new RegExp(regex, "g");
      const sourceReplacedContent = await replaceAsync(
        tempState.content,
        regexp,
        replaceImageTag,
        tempState
      );
      tempState.content = sourceReplacedContent;

      tempState.content = tempState.content.replace(
        // /<p\b[^>]*>(<strong>|<i>|<em>|<u>)*(<img\b[^>]*>)(<\/strong>|<\/i>|<\/em>|<\/u>)*<\/p>/g,
        /<p[^>]*>([^\/]*?)(<img[^>]*?src="([^>]+)"[^>]*>).*?<\/p>/g,
        (...match) => {
          console.log(match[1]);
          return match[2];
        }
      );
      console.log(tempState.content);
    } catch (error) {
      setLoading(false);
      console.error(error);
      return;
    }

    const formData = new FormData();
    // Append each of the files
    tempState.waitingImages.forEach((file) => {
      formData.append("files[]", file);
    });
    formData.append(
      "data",
      JSON.stringify({
        user_id: auth.id,
        title: title,
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
      const currentNote = {
        id: response.data.id,
        title: title,
        content: response.data.content,
        parent_id: response.data.parent_id,
        is_favorited: false,
        is_pinned: false,
      };
      setCurrentNote(currentNote);
      window.editor.commands.setContent(tempState.content);
      setLoading(false);
      console.log(currentNote);
      return currentNote;
    } catch (error) {
      setLoading(false);
      if (error.response?.status === 403 || error.response?.status === 401) {
        setAuth(undefined);
        clean();
      }
    }
  };

  const handelFilterNotes = async (formValue) => {
    const tags = formValue.tags.map((tag) => {
      return tag.id;
    });
    // formValue.tags = tags
    // formValue.sortBy = formValue.sortBy.value
    console.log(2, formValue);
    setLoading(true);
    const options = {
      method: "POST",
      data: {
        ...formValue,
        tags: tags,
        sortBy: formValue.sortBy.value,
        user_id: auth.id,
      },
    };
    const { responseData } = await callApi(APIEndPoints.FILTER, options);
    setLoading(false);
    return responseData;
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
      handelFilterNotes,
    },
  };
};

export default useNotes;
