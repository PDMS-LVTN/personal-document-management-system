import { useApp } from '@/store/useApp';
import { v4 as uuidv4 } from 'uuid'

export const tempState = { waitingImage: [], waitingFile: [] };

export class API {
  public static uploadImage = async (file) => {
    const ext = file.name.substring(file.name.indexOf("."));
    const url = URL.createObjectURL(file);
    const pos = url.lastIndexOf("/");
    const fileName = url.substring(pos + 1);

    const newFile = new File([file], fileName + ext, { type: file.type });
    tempState.waitingImage.push(newFile);
    return Promise.resolve(url);
  }

  public static uploadFileDirect = async (file: File, upload) => {
    const fileName = file.name;
    const ext = file.name.substring(file.name.indexOf("."));
    const id = uuidv4()
    const newFile = new File([file], id + ext, { type: file.type });
    const { responseData } = await upload(useApp.getState().currentNote.id, newFile, fileName)
    return responseData[0]

    // Always return a Promise
    // return new Promise<string>((resolve, reject) => {
    //   const reader = new FileReader();
    //   // Wait till complete
    //   reader.onloadend = function (e: any) {
    //     const fileContent = e.target.result;
    //     // Do something with the file content
    //     console.log(fileContent);
    //     resolve(file.name);
    //   };
    //   // Make sure to handle error states
    //   reader.onerror = function (e: any) {
    //     reject(e);
    //   };
    //   reader.readAsDataURL(file);
    // });
  }
}

export default API
