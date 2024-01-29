import Image from "next/image";
import type { Dispatch, SetStateAction } from "react";
import { useCallback, useState } from "react";
import { useDropzone, Accept } from "react-dropzone";
import { AiFillPlusCircle as PlusCircleIcon } from "react-icons/ai";
import { nanoid } from "nanoid";
import { Button } from "../ui/button";

interface Props {
  onImagesSelected: (images: File[]) => void;
  images: File[];
  setImages: Dispatch<SetStateAction<File[]>>;
  title?: string;
  multiple?: boolean;
  showButton?: boolean;
  isLoading?: boolean;
}

const ImageInput: React.FC<Props> = ({
  onImagesSelected,
  images,
  setImages,
  title = "Drag and drop images here, or click to select files",
  multiple = true,
  showButton = true,
  isLoading = false,
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (multiple) {
      setImages((prevImages) => [...prevImages, ...acceptedFiles]);
    } else {
      setImages(acceptedFiles);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    multiple,
  });

  const removeImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleImagesSelected = async () => {
    onImagesSelected(images);
  };
  const handleClearClick = async () => {
    setImages([]);
  };

  return (
    <div className="h-full w-full">
      {images.length == 0 ? (
        <>
          <div
            {...getRootProps()}
            className="h-full cursor-pointer rounded-md border-2 border-dashed border-gray-300 p-4"
          >
            <input multiple={multiple} {...getInputProps()} />
            <div className="flex h-full flex-col items-center justify-center space-y-2">
              <PlusCircleIcon className="h-12 w-12 text-gray-400" />
              {isDragActive ? (
                <p className="text-center text-lg font-medium text-accent-foreground">
                  Drop the images here
                </p>
              ) : (
                <p className="text-center text-lg font-medium text-gray-400">
                  {title}
                </p>
              )}
            </div>
          </div>
          <div className="flex w-full justify-end px-3">
            <button onClick={handleClearClick}>
              <h2 className="text-lg">Clear</h2>
            </button>
          </div>
        </>
      ) : null}
      {images.length > 0 && (
        <div
          className={
            multiple
              ? "mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
              : "flex justify-center"
          }
        >
          {multiple ? (
            images.map((image, index) => (
              <div key={nanoid()} className="flex w-full justify-center">
                <div
                  key={nanoid()}
                  className="relative h-80 w-64 border-2 sm:h-64 sm:w-48"
                >
                  <button
                    className="absolute top-0 right-0 z-10 h-6 w-6 text-gray-400 hover:text-red-500"
                    onClick={() => removeImage(index)}
                  >
                    &#10005;
                  </button>
                  <Image
                    src={URL.createObjectURL(image)}
                    alt=""
                    fill
                    className="w-full rounded-md object-contain"
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="relative h-64 w-48">
              <button
                className="absolute top-0 right-0 z-10 h-6 w-6 text-gray-400 hover:text-red-500"
                onClick={() => removeImage(0)}
              >
                &#10005;
              </button>
              <Image
                src={URL.createObjectURL(images[0] as File)}
                alt=""
                fill
                className="w-full rounded-md object-contain"
              />
            </div>
          )}
        </div>
      )}
      {showButton ||
        (images.length > 0 && (
          <Button
            isLoading={isLoading}
            className="mt-10 w-full"
            onClick={handleImagesSelected}
          >
            Upload Images
          </Button>
        ))}
    </div>
  );
};

export default ImageInput;
