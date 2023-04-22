import Image from "next/image";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { useDropzone, Accept } from "react-dropzone";
import { AiFillPlusCircle as PlusCircleIcon } from "react-icons/ai";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { nanoid } from "nanoid";
import { api } from "../utils/api";

interface Props {
  onImagesSelected: (images: File[]) => void;
  images: File[];
  setImages: Dispatch<SetStateAction<File[]>>;
  multiple?: boolean;
  showButton?: boolean;
}

const ImageInput: React.FC<Props> = ({
  onImagesSelected,
  images,
  setImages,
  multiple = true,
  showButton = true,
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImages((prevImages) => [...prevImages, ...acceptedFiles]);
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
  const [divRef] = useAutoAnimate<HTMLDivElement>();

  return (
    <div>
      <div
        {...getRootProps()}
        className="cursor-pointer rounded-md border-2 border-dashed border-gray-300 p-4"
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <PlusCircleIcon className="h-12 w-12 text-gray-400" />
          {isDragActive ? (
            <p className="text-skin-600 text-lg font-medium">
              Drop the images here
            </p>
          ) : (
            <p className="text-lg font-medium text-gray-400">
              Drag and drop images here, or click to select files
            </p>
          )}
        </div>
      </div>
      <div className="flex w-full justify-end px-3">
        <button onClick={handleClearClick}>
          <h2 className="text-lg">Clear</h2>
        </button>
      </div>
      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={nanoid()} className="relative h-64 w-48">
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
          ))}
        </div>
      )}
      {showButton && images.length > 0 && (
        <button
          className="mt-4 rounded-md bg-black py-2 px-4 text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
          onClick={handleImagesSelected}
        >
          Upload Images
        </button>
      )}
    </div>
  );
};

export default ImageInput;
