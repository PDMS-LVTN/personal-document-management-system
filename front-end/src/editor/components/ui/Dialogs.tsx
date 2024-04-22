import { Input, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export const UnsplashDialog = ({ onUpload }) => {
  const [images, setImages] = useState(null);
  useEffect(() => {
    const fetchImages = async () => {
      const response = await fetch(
        `https://api.unsplash.com/photos?client_id=${
          import.meta.env.VITE_UNSPLASH_ACCESS_KEY
        }`
      );
      const data = await response.json();
      setImages(data);
    };

    fetchImages();
  }, []);

  return (
    <>
      <Input placeholder="Search for an image" mb={3} />
      {!images ? (
        <div className="flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 lg:container">
          {images.map((image) => (
            <div className="flex flex-col gap-1" key={image.id}>
              {/* BUG: these images are not uploaded to our server */}
              <img
                src={image.urls.thumb}
                alt={image.alt_description}
                className="object-cover h-[125px] rounded-md hover:cursor-pointer"
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
