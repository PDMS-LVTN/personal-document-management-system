export const tempState = { waitingImage: [], waitingFile: [] };

export class API {
  public static uploadImage = async (file: File) => {
    // await new Promise(r => setTimeout(r, 500))
    // return '/placeholder-image.jpg'
    console.log(file)
    const ext = file.name.substring(file.name.indexOf("."));
    const url = URL.createObjectURL(file);
    console.log(url)
    const pos = url.lastIndexOf("/");
    const fileName = url.substring(pos + 1);

    const newFile = new File([file], fileName + ext, { type: file.type });
    tempState.waitingImage.push(newFile);
    return Promise.resolve(url);
  }

  public static uploadFile = (file: File) => {
    tempState.waitingImage.push(file);

    // Always return a Promise
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      // Wait till complete
      reader.onloadend = function (e: any) {
        const fileContent = e.target.result;
        // Do something with the file content
        console.log(fileContent);
        resolve(file.name);
      };
      // Make sure to handle error states
      reader.onerror = function (e: any) {
        reject(e);
      };
      reader.readAsDataURL(file);
    });
  }
}

export default API
