import React from "react";
import Image from "next/image";
import { AiOutlinePlusSquare } from "react-icons/ai";
import type { RouterOutputs } from "../../utils/api";
import { useEntities } from "../../hooks/useEntitiesHook";
import Modal from "../UI/Modal";
import ImageInput from "../ImageInput";
import GallerySection from "../entities/GallerySection";
import { BLANK_PROFILE_URL } from "../../pages/_app";

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
  } = useEntities();
  return (
    <div className="absolute min-h-screen w-full bg-skin-main text-skin-base ">
      <div className="m-20">
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
      </div>
      {entities?.map((entity) => (
        <div key={entity.id}>
          <Image
            alt="Entity Picture"
            width={40}
            height={40}
            src={entity?.picture || BLANK_PROFILE_URL}
          />
          <h3>{entity.name}</h3>
        </div>
      ))}
    </div>
  );
}
