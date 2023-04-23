import React from "react";
import Image from "next/image";
import { AiOutlinePlusSquare } from "react-icons/ai";
import type { RouterOutputs } from "../../utils/api";
import { useEntities } from "../../hooks/useEntitiesHook";
import Modal from "../UI/Modal";
import ImageInput from "../ImageInput";
import GallerySection from "../entities/GallerySection";
import { BLANK_PROFILE_URL } from "../../pages/_app";
import { BarLoader, PacmanLoader } from "react-spinners";

interface EntitiesPagePropType {
  entities?: RouterOutputs["entity"]["getEntities"];
}
export default function EntitiesPage({ entities }: EntitiesPagePropType) {
  const {
    handleAddEntityClick,
    handleCreateEntitySubmit,
    isOpen,
    closeModal,
    entityImg,
    setEntityImg,
    setName,
    name,
    showGalleryUpload,
    galleryUploadLoading,
  } = useEntities();
  return (
    <div
      className={`min-h-screen w-full overflow-y-hidden bg-skin-main text-skin-base ${
        isOpen && "overflow-y-hidden"
      } `}
    >
      {galleryUploadLoading && (
        <div className="fixed inset-0 z-20 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm">
          <h3 className="text-6xl">Uploading Images</h3>
          <PacmanLoader size={50} color={"white"} className="mt-16" />
        </div>
      )}
      <div className="ml-20 pt-20">
        <Modal
          title={showGalleryUpload ? "Edit Entity" : "Create a new Entity"}
          isOpen={isOpen}
          closeModal={closeModal}
        >
          <div className="mt-16 flex w-full justify-center">
            <div className="w-1/2">
              <input
                className="w-full rounded-md bg-skin-secondary py-2 text-lg
                 text-white duration-150 focus:ring-2 focus:ring-white"
                placeholder={"Entity Name"}
                value={name}
                onChange={(e) => {
                  e.preventDefault();
                  setName(e.currentTarget.value);
                }}
                type="text"
              />
              <div className={"mt-3 text-white"}>
                <div className={"pt-1 pb-3"}>
                  <label className="text-lg">Entity Profile Picture</label>
                </div>
                <ImageInput
                  images={entityImg}
                  setImages={setEntityImg}
                  multiple={false}
                  showButton={false}
                  onImagesSelected={() => console.log("selected")}
                />
              </div>

              <button
                className="mt-4 rounded-md bg-black py-2 px-4 text-white hover:bg-gray-800 
          focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
                onClick={handleCreateEntitySubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </Modal>
        {showGalleryUpload ? (
          <GallerySection />
        ) : (
          <button
            onClick={handleAddEntityClick}
            className="flex w-52 items-center justify-between
        rounded-sm border-2 border-white px-3 py-2 duration-150
        hover:bg-white/20 active:scale-[0.98] active:bg-white/40"
          >
            <AiOutlinePlusSquare size={30} color="white" />
            <h2 className="text-lg text-white">Add New Entity</h2>
          </button>
        )}
        {!showGalleryUpload && entities && (
          <section className="mt-16 w-1/2">
            <label className="text-3xl">Entities</label>
            <div className="mt-16 ml-5 grid grid-cols-1 gap-y-5 2xl:grid-cols-3 ">
              {entities?.map((entity) => (
                <a
                  key={entity.id}
                  href={`/user/entities/${entity.id}`}
                  className="box-content flex w-36 cursor-pointer items-center rounded-md
                  border-2 py-1 pl-5 pr-8 duration-150 hover:bg-white/20"
                >
                  <div className="relative h-16 w-16 rounded-full ">
                    <Image
                      alt="Entity Picture"
                      className="rounded-full object-cover"
                      fill
                      src={entity?.picture || BLANK_PROFILE_URL}
                    />
                  </div>
                  <h3 className="ml-5 whitespace-nowrap text-xl">
                    {entity.name}
                  </h3>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
