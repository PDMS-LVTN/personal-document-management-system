import { useState } from "react";
import { useApp } from "../store/useApp";
import useAxiosJWT from "./useAxiosJWT";
import { useToast } from "@chakra-ui/react";
import { useAuthentication } from "../store/useAuth";
import { APIEndPoints } from "../api/endpoint";
import { tempState } from "@/editor/lib/api";
import { useApi } from "./useApi";
import { convertToHtml } from "mammoth";
import { ShareMode } from "@/lib/data/constant";
// import { EditorState } from "@tiptap/pm/state";
// import { TiptapTransformer } from "@hocuspocus/transformer";
import { useLocation, useNavigate } from "react-router-dom";
import ExtensionKit from "@/editor/extensions/extension-kit";
// import * as Y from "yjs";
import { generateJSON } from "@tiptap/react";


const useNotes = () => {
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
  const navigate = useNavigate();
  const location = useLocation()

  const extensions = ExtensionKit()

  const createNote = async (id: string, title?: string) => {
    // const initialContent = "<p>Start writing your notes</p>";
    try {
      const response = await axiosJWT.post(
        APIEndPoints.CREATE_NOTE,
        JSON.stringify({
          user_id: auth.id,
          title: title || "Untitled",
          // content: initialContent,
          read_only: false,
          size: 0,
          parent_id: id,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const currentNote = {
        id: response.data.id,
        title: response.data.title,
        // content: response.data.content,
        parent_id: response.data.parent_id,
        is_favorited: false,
        is_pinned: false,
        childrenNotes: null,
      };
      // setCurrentNote(currentNote);
      // ref?.current?.setMarkdown(markdown);
      // window.editor?.commands.setContent(response.data.content);
      navigate(`${response.data.id}`)
      return currentNote;
    } catch (error) {
      console.log(error);
      if (error.response?.status === 403 || error.response?.status === 401) {
        setAuth(undefined);
        clean();
      }
    }
  };

  const updateNote = async (title?) => {
    setLoading(true);
    console.log(tempState.waitingImage);
    // const editorContent = window.editor.getHTML();
    const formData = new FormData();
    // Append each of the files
    tempState.waitingImage.forEach((file) => {
      formData.append("files[]", file);
    });
    formData.append(
      "data",
      JSON.stringify({
        // content: editorContent,
        title: title ? title : currentNote?.title,
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
      await setCurrentNoteHandler(response.data);
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
    // setLoading(true);
    try {
      const response = await axiosJWT.post(
        APIEndPoints.ALL_NOTE,
        JSON.stringify({ user_id: auth.id }),
        {
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        }
      );
      // console.log(response.data);
      // setLoading(false);
      return response.data;
    } catch (error) {
      // setLoading(false);
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

  const moveNote = async (listId, parentId) => {
    try {
      const options = {
        method: "PATCH",
        data: {
          note_id_list: listId,
          parent_id: parentId,
          user_id: auth.id,
        },
      };
      const response = await callApi(
        `note/move_note`,
        options
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const mergeNotes = async (id1, id2) => {
    console.log(id1, ",", id2);
    setLoading(true);
    try {
      const response = await axiosJWT.patch(
        `note/merge_note/${id1}`,
        JSON.stringify({ merged_note_id: id2 }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response.data);
      setCurrentNoteHandler(response.data);
      setLoading(false);
      return response.data;
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const clickANoteHandler = async (id) => {
    // const noteItem = await getANote(id);
    // setCurrentNoteHandler(noteItem);
    resetContentAndSelection(id)
  };

  const setCurrentNoteHandler = (noteItem) => {
    setCurrentNote({
      title: noteItem?.title,
      id: noteItem?.id,
      content: noteItem?.content,
      parent_id: noteItem?.parent_id,
      is_favorited: noteItem.is_favorited,
      is_pinned: noteItem.is_pinned,
      childNotes: noteItem.childNotes,
    });
    const tags = noteItem.tags.map((tag) => {
      return { value: tag.description, label: tag.description, id: tag.id };
    });
    setCurrentTags(tags);
    // ref?.current?.setMarkdown(noteItem.content);
    // window.editor?.commands.setContent(noteItem.content);
    // return noteItem;
  };

  function resetContentAndSelection(id) {
    // Capture the current selection
    // const currentSelection = window.editor?.state?.selection;

    // Reset the content
    // window.editor?.commands.setContent(noteItem.content);

    // Create a new editor state while preserving the old selection
    // const newEditorState = EditorState.create({
    //   doc: window.editor.state.doc,
    //   plugins: window.editor.state.plugins,
    //   selection: currentSelection
    // });

    // Update the editor state
    // window.editor.view.updateState(newEditorState);
    // window.note_tree?.select(noteItem?.id)

    // /search needs location.state.data
    navigate(`${id}`, { state: { data: location.state?.data } })
  }

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
    return string.replace(regexp, () => replacements[i++]);
  }

  async function replaceImageTag(temp, ...group) {
    const src = group[1];
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

  // BUG: rename and import

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
        /<p[^>]*>([^\/]*?)(<img[^>]*?src="([^>]+)"[^>]*>).*?<\/p>/g,
        (...match) => {
          // console.log(match[1]);
          return match[2];
        }
      );
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
      await axiosJWT.post(`note/import/update_binary_data`, {
        id: response.data.id, data: generateJSON(response.data.content, extensions)
      }, {
        headers: { "Content-Type": "application/json" },
      });
      const currentNote = {
        id: response.data.id,
        title: title,
        // content: response.data.content,
        parent_id: response.data.parent_id,
        is_favorited: false,
        is_pinned: false,
      };
      // setCurrentNote(currentNote);
      // window.editor.commands.setContent(tempState.content);
      setLoading(false);
      navigate(`${response.data.id}`)
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

  const getAttachments = async (noteId: string) => {
    const options = {
      method: "GET",
    };
    const { responseData } = await callApi(`note/attachments/${noteId}`, options);
    return responseData
  }

  const removeNoteCollaborator = async (noteId: string, email: string) => {
    const options = {
      method: "DELETE",
      data: {
        note_id: noteId,
        email
      },
    };
    const { responseData } = await callApi(`note_collaborator`, options);
    return responseData
  }

  const addCollaborator = async (noteId: string, email: string, mode: ShareMode) => {
    const options = {
      method: "POST",
      data: { note_id: noteId, email, share_mode: mode }
    };
    const { responseData } = await callApi(`note_collaborator/add_note_collaborator`, options);
    return responseData
  }

  const findCollaboratorsOfNote = async (noteId: string) => {
    const options = {
      method: "GET",
    };
    const { responseData } = await callApi(`note_collaborator/collaborators/${noteId}`, options);
    return responseData
  }

  const updateGeneralPermission = async (noteId: string, is_anyone: boolean) => {
    const options = {
      method: "PATCH",
      data: {
        is_anyone,
        date: new Date()
      }
    }
    const { responseData } = await callApi(`note/is_anyone/${noteId}`, options);
    return responseData
  }

  const updateCollaboratorPermission = async (noteId: string, email: string, mode: ShareMode) => {
    const options = {
      method: "POST",
      data: {
        share_mode: mode,
        email,
        date: new Date()
      }
    }
    const { responseData } = await callApi(`note_collaborator/${noteId}`, options);
    return responseData
  }

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
      mergeNotes,
      moveNote,
      getAttachments,
      removeNoteCollaborator,
      findCollaboratorsOfNote,
      addCollaborator,
      updateGeneralPermission,
      updateCollaboratorPermission,
      setCurrentNoteHandler
    },
  };
};

export default useNotes;
