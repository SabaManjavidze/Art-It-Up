import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";
import { z } from "zod";
import ImageInput from "../ImageInput";
import { api } from "../../utils/api";
import { toBase64 } from "../../utils/convertToBase64";
import { useEntities } from "../../hooks/useEntitiesHook";
import { BLANK_PROFILE_URL } from "../../pages/_app";
import EditEntitySection from "./EditEntitySection";

const GallerySection = () => {
  const [images, setImages] = useState<File[]>([]);
  const { handleImageUpload, handleCancelEntityClick, galleryUploadLoading } =
    useEntities();
  const { data, isFetching } = api.services.getUserImages.useQuery();
  return (
    <div className="min-h-screen w-full bg-skin-main px-12 text-skin-base">
      <EditEntitySection
        handleCancelEntity={() => {
          handleCancelEntityClick();
          setImages([]);
        }}
      />
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
