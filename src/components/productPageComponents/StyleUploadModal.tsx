import { useEffect, useState } from "react";
import ImageInput from "../general/ImageInput";
import Modal from "../ui/modal";
import { Button } from "../ui/button";
import { api } from "@/utils/api";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { BsChevronLeft } from "react-icons/bs";
import { toBase64 } from "@/utils/general/convertToBase64";
import { toast } from "react-toastify";
import UserGalleryTab from "../profilePageComponents/UserGalleryTab";
import { PaginationProvider } from "@/hooks/usePaginationHook";

export const StyleUploadModal = ({
  closeModal,
  isOpen,
  productId,
}: {
  closeModal: () => void;
  isOpen: boolean;
  productId: string;
}) => {
  const [page, setPage] = useState<"main" | "gallery" | "uploaded">("main");
  const [images, setImages] = useState<File[]>([]);
  const [selectedImage, setSelectedImage] = useState("");
  const context = api.useContext();
  const { mutateAsync: setStyle } = api.product.setProductStyle.useMutation({
    onSuccess() {
      context.product.getPrintifyProduct.invalidate({ id: productId });
    },
  });
  const { mutateAsync: uploadImage, isLoading: imageUploadLoading } =
    api.gallery.uploadStyle.useMutation();
  const {
    data,
    isLoading,
    error,
    refetch: getGallery,
    fetchNextPage,
  } = api.gallery.getUserGallery.useInfiniteQuery(
    { limit: 6 },
    {
      enabled: false,

      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  const closeModal2 = () => {
    closeModal();
    setPage("main");
  };

  const handleImageClick = async (url: string) => {
    if (selectedImage == url) {
      closeModal();
    } else {
      setSelectedImage(url);
    }
  };
  const handleImageUpload = async () => {
    const image = images[0];
    if (!image) return;
    const img = (await toBase64(image)) as string;
    const finalImg = await uploadImage({ picture: img });
    if (!finalImg) return;
    toast.success("image uploaded to your gallery");
    await setStyle({ styleId: finalImg, productId });
    setImages([]);
  };
  if (page == "main") {
    return (
      <Modal closeModal={closeModal2} isOpen={isOpen}>
        <div className="flex flex-col items-center">
          <div className="flex h-72 w-64 items-center justify-center">
            <ImageInput
              title="Upload a photo from your device"
              images={images}
              setImages={setImages}
              isLoading={imageUploadLoading}
              multiple={false}
              showButton={false}
              onImagesSelected={handleImageUpload}
            />
          </div>
          <div className={"mt-10 flex w-full flex-col items-center"}>
            <Button
              className="mt-4 w-64"
              variant="accent"
              onClick={async () => {
                setPage("gallery");
                await getGallery();
              }}
            >
              Upload From Gallery
            </Button>
          </div>
        </div>
      </Modal>
    );
  } else if (page == "gallery") {
    return (
      <Modal
        closeModal={closeModal2}
        isOpen={isOpen}
        title="Choose From Gallery"
      >
        <button
          onClick={() => setPage("main")}
          className="absolute top-4 left-5 rounded-md border-2 border-transparent p-[2px] duration-150 focus:border-gray-700/50"
        >
          <BsChevronLeft size={15} />
        </button>
        <div className="w-full">
          {!isLoading && !error && data?.pages ? (
            <PaginationProvider
              pagesData={data.pages}
              fetchNextPage={fetchNextPage}
            >
              <UserGalleryTab
                size="sm"
                gallery={data}
                className="py-4"
                onClick={(url) => handleImageClick(url)}
                isActive={(url) => selectedImage == url}
              />
            </PaginationProvider>
          ) : (
            <Loader2 />
          )}
        </div>
      </Modal>
    );
  } else {
    return (
      <Modal closeModal={closeModal2} isOpen={isOpen}>
        uploaded
      </Modal>
    );
  }
};
