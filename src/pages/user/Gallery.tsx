import Image from "next/image";
import React from "react";
import { ClipLoader } from "react-spinners";
import ImageInput from "../../components/ImageInput";
import { api } from "../../utils/api";
import { toBase64 } from "../../utils/convertToBase64";

const GalleryPage = () => {
  const { data, isFetching } = api.services.getUserImages.useQuery();
  const utils = api.useContext();
  const { mutateAsync, isLoading } = api.services.uploadImage.useMutation({
    onSuccess() {
      utils.services.getUserImages.invalidate();
    },
  });
  const handleImageUpload = async (imgs: File[]) => {
    imgs.forEach(async (image) => {
      const img = (await toBase64(image)) as string;
      await mutateAsync({ picture: img });
    });
  };
  return (
    <div className="min-h-screen w-full bg-skin-main text-skin-base">
      <div className="px-12 pt-20">
        <ImageInput onImagesSelected={handleImageUpload} />
        <section className="mt-24 pb-32">
          <h2 className="border-b-2 border-white px-6 pb-12 text-4xl text-white">
            My Pictures
          </h2>
          {isFetching || isLoading ? (
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

export default GalleryPage;
