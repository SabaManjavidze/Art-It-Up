import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
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
    <div className="text-skin-base min-h-screen w-full bg-background px-12">
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
          <h2 className="border-b-2 border-white px-6 pb-12 text-4xl text-primary-foreground">
            My Pictures
          </h2>
          {isFetching || galleryUploadLoading ? (
            <div className="flex min-h-screen items-center justify-center bg-background">
              <Loader2 color="white" />
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
