import Image from "next/image";
import React from "react";
import { useEntities } from "../../hooks/useEntitiesHook";
import { BLANK_PROFILE_URL } from "../../pages/_app";
import { Button } from "../ui/button";

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
              className="absolute top-1/2 -translate-y-1/2 rounded-md object-contain"
            />
          </div>
          <div className="flex items-center">
            <h3 className="ml-4 text-lg">{name}</h3>
          </div>
        </div>
        <Button onClick={handleAddEntityClick}>Edit</Button>
        <Button
          className="ml-5"
          variant="secondary"
          onClick={handleCancelEntity}
        >
          Cancel
        </Button>
      </div>
    </section>
  );
}
