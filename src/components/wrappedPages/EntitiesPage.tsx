import type { ChangeEvent } from "react";
import React, { useCallback } from "react";
import Image from "next/image";
import { AiOutlinePlusSquare } from "react-icons/ai";
import type { RouterOutputs } from "../../utils/api";
import { api } from "../../utils/api";
import { useEntities } from "../../hooks/useEntitiesHook";
import Modal from "../ui/Modal";
import ImageInput from "../ImageInput";
import GallerySection from "../EntitiesPageComponents/GallerySection";
import { PacmanLoader } from "react-spinners";
import EntityCard from "../EntitiesPageComponents/EntityCard";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

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
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setName(value);
  };
  return (
    <div
      className={`text-skin-base min-h-screen w-full overflow-y-hidden bg-background ${
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
              <Input
                className="w-full rounded-md py-2 text-lg
                 text-primary-foreground duration-150 focus:ring-2 focus:ring-white"
                placeholder={"Entity Name"}
                value={name}
                onChange={handleNameChange}
                type="text"
              />
              <div className={"mt-3 text-primary-foreground"}>
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

              <Button
                className="mt-4 rounded-md py-2 px-4 text-secondary-foreground"
                onClick={handleCreateEntitySubmit}
              >
                Submit
              </Button>
            </div>
          </div>
        </Modal>
        {showGalleryUpload ? (
          <GallerySection />
        ) : (
          <Button
            onClick={handleAddEntityClick}
            className="duration-300 hover:scale-[0.98]"
          >
            <AiOutlinePlusSquare size={30} color="white" />
            <h2 className="ml-3 text-lg text-secondary-foreground">
              Add New Entity
            </h2>
          </Button>
        )}
        {!showGalleryUpload && entities && (
          <section className="mt-16 w-1/2">
            <label className="text-3xl">Entities</label>
            <div className="mt-16 ml-5 grid grid-cols-1 gap-y-5 2xl:grid-cols-3 ">
              {entities.map((entity) => (
                <EntityCard key={entity.id} entity={entity} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
