import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";
import { z } from "zod";
import ImageInput from "../../components/ImageInput";
import { api } from "../../utils/api";
import { toBase64 } from "../../utils/convertToBase64";
import { useEntities } from "../../hooks/useEntitiesHook";
import { BLANK_PROFILE_URL } from "../../pages/_app";

const GallerySection = () => {
  const {
    images,
    setImages,
    handleImageUpload,
    galleryUploadLoading,
    name,
    entityImg,
    handleAddEntityClick,
  } = useEntities();
  const { data, isFetching } = api.services.getUserImages.useQuery();
  return (
    <div className="min-h-screen w-full bg-skin-main px-12 text-skin-base">
      <section>
        <div className="flex items-center ">
          <div className="flex max-h-24 items-center rounded-md border-2 border-white pr-5 ">
            <Image
              alt="Entity Image"
              src={
                entityImg[0]
                  ? URL.createObjectURL(entityImg[0])
                  : BLANK_PROFILE_URL
              }
              width={40}
              height={40}
              className="rounded-sm object-cover"
            />
            <h3 className="ml-4 text-lg">{name}</h3>
          </div>
          <button
            className="ml-4 rounded-md bg-black py-2 px-4 text-white hover:bg-gray-800 
          focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
            onClick={handleAddEntityClick}
          >
            Edit
          </button>
        </div>
      </section>
      <div className="pt-20">
        <ImageInput
          images={images}
          setImages={setImages}
          onImagesSelected={handleImageUpload}
        />
        <section className="mt-24 pb-32">
          <h2 className="border-b-2 border-white px-6 pb-12 text-4xl text-white">
            My Pictures
          </h2>
          {isFetching || galleryUploadLoading ? (
            <div className="flex min-h-screen items-center justify-center bg-skin-main">
              <ClipLoader color="white" />
            </div>
          ) : (
            <ul className="relative flex items-center justify-start">
              {data?.map((image, index) => (
                <li key={image.id} className="relative m-4 flex h-72 w-48">
                  <Image
                    fill
                    src={image.url}
                    alt={`user uploaded image ${index + 1}`}
                    className="rounded-lg object-contain"
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default GallerySection;
