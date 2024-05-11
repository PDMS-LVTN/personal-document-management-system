import { useApi } from "./useApi";
import { AxiosRequestConfig } from "axios";

export const useUpload = () => {
    const callApi = useApi()

    const upload = async (noteId: string, file, fileName: string) => {
        const formData = new FormData();
        formData.append("files[]", file);
        formData.append(
            "data",
            JSON.stringify({
              fileName: fileName,
            })
          );
        const options: AxiosRequestConfig = {
            method: "POST",
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
        }
        return await callApi(`note/upload/${noteId}`, options)
    }

    return { upload };
}