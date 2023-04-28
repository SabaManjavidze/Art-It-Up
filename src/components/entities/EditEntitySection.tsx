import Image from "next/image";
import React from "react";
import { useEntities } from "../../hooks/useEntitiesHook";
import { BLANK_PROFILE_URL } from "../../pages/_app";

export default function EditEntitySection({
  handleCancelEntity,
}: {
  handleCancelEntity: () => void;
}) {
  const { entityImg, handleAddEntityClick, name } = useEntities();
  return (
    <section>
      <div className="flex items-center ">
        <div className="flex h-20 overflow-hidden rounded-md border-2 border-white pr-5 ">
          <div className="relative flex w-32 rounded-md">
            <Image
              alt="Entity Image"
              src={
                entityImg[0]
                  ? URL.createObjectURL(entityImg[0])
                  : BLANK_PROFILE_URL
              }
              width={400}
              height={400}
              className="absolute top-0 rounded-md object-cover"
            />
          </div>
          <div className="flex items-center">
            <h3 className="ml-4 text-lg">{name}</h3>
          </div>
        </div>
        <button
          className="ml-4 rounded-md bg-black py-2 px-4 text-white duration-150 hover:bg-gray-800
          focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
          onClick={handleAddEntityClick}
        >
          Edit
        </button>
        <button
          className="ml-4 rounded-md bg-gray-600 py-2 px-4 text-white duration-150 hover:bg-gray-500
          focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
          onClick={handleCancelEntity}
        >
          Cancel
        </button>
      </div>
    </section>
  );
}
