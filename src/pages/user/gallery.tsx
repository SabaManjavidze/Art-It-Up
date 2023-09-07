import React, { useState } from "react";
import { api } from "../../utils/api";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import Image from "next/image";
import ImageInput from "@/components/general/ImageInput";
import { toBase64 } from "@/utils/convertToBase64";

export default function Gallery() {
  const [images, setImages] = useState<File[]>([]);
  const { data, isFetching } = api.gallery.getUserGallery.useQuery();
  const { mutateAsync: uploadImage, isLoading: imageUploadLoading } =
    api.gallery.uploadStyle.useMutation();
  const handleImageUpload = async () => {
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      if (image) {
        const img = (await toBase64(image)) as string;
        await uploadImage({ picture: img });
      }
    }
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
}
