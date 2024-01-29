import React, { useState } from "react";
import { api } from "../../utils/api";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import Image from "next/image";
import ImageInput from "@/components/general/ImageInput";
import { toBase64 } from "@/utils/general/convertToBase64";
import { SIZES_PROP } from "@/utils/general/constants";
import { IoCloseOutline } from "react-icons/io5";

export default function Gallery() {
  const [images, setImages] = useState<File[]>([]);
  const { data, isFetching } = api.gallery.getUserGallery.useQuery({});
  const { mutateAsync: uploadImage, isLoading: imageUploadLoading } =
    api.gallery.uploadStyle.useMutation();
  const { mutateAsync: deleteImage, isLoading: deleteImageLoading } =
    api.gallery.deleteStyle.useMutation();

  const context = api.useContext();

  const handleImageUpload = async () => {
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      if (image) {
        const img = (await toBase64(image)) as string;
        await uploadImage({ picture: img });
        setImages(images.filter((item) => item !== image));
      }
    }
    await context.gallery.getUserGallery.invalidate();
    setImages([]);
  };
  const handleDeleteImage = async (imageId: string, idx: number) => {
    await deleteImage({ styleId: imageId });
    setImages(images.splice(idx, 1));
  };
  return (
    <div className="text-skin-base min-h-screen w-full bg-background px-12">
      <div className="pt-20">
        <ImageInput
          images={images}
          setImages={setImages}
          onImagesSelected={handleImageUpload}
          isLoading={imageUploadLoading}
        />
        <section className="mt-24 pb-32">
          <h2 className="border-b-2 border-white px-6 pb-12 text-4xl text-primary-foreground">
            My Pictures
          </h2>
          {isFetching || imageUploadLoading ? (
            <div className="flex min-h-screen items-center justify-center bg-background">
              <Loader2 />
            </div>
          ) : (
            <div className="flex w-full justify-center">
              <ul className="relative grid grid-cols-1 items-center justify-start gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:mt-12 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7">
                {data?.imgs.map((image, index) => (
                  <li key={image.id} className="relative m-4 flex h-72 w-48">
                    <IoCloseOutline
                      size={20}
                      className="absolute top-0 right-0 z-10 text-muted-foreground duration-150 hover:scale-105 hover:text-red-500 "
                      onClick={() => handleDeleteImage(image.id, index)}
                    />
                    <Image
                      fill
                      sizes={SIZES_PROP}
                      src={image.url}
                      alt={`user uploaded image ${index + 1}`}
                      className="rounded-lg object-contain"
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
