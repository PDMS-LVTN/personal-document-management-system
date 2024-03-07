import { Input, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export const UnsplashDialog = ({ onUpload }) => {
  const [images, setImages] = useState(null);
  //   console.log(process.env.UNSPLASH_ACCESS_KEY);
  useEffect(() => {
    const fetchImages = async () => {
      const response = await fetch(
        `https://api.unsplash.com/photos?client_id=${
          import.meta.env.VITE_UNSPLASH_ACCESS_KEY
        }`
      );
      const data = await response.json();
      console.log(data);
      setImages(data);
    };

    fetchImages();
  }, []);

  return (
    <>
      <Input placeholder="Search for an image" mb={3} />
      {!images ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 lg:container">
          {images.map((image) => (
            <div className="flex flex-col gap-1" key={image.id}>
              <img
                src={image.urls.thumb}
                alt={image.alt_description}
                className="object-cover h-[125px] rounded-2xl hover:cursor-pointer"
                loading="lazy"
                onClick={() => {
                  onUpload(image.urls.regular);
                }}
              />
              <p>
                by{" "}
                <a href={image.links.html} className="underline">
                  {image.user.name}
                </a>
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
