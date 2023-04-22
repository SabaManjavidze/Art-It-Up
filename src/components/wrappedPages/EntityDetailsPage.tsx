import React from "react";
import { RouterOutputs, api } from "../../utils/api";
import Image from "next/image";

interface EntityDetailsPagePropType {
  entityId: string;
}
export default function EntityDetailsPage({
  entityId,
}: EntityDetailsPagePropType) {
  const { data: entity, isLoading: entityLoading } =
    api.entity.getEntity.useQuery({ entityId });
  return (
    <div className="min-h-screen bg-skin-main px-1.5">
      <div className="flex justify-center pt-16">
        {entityLoading
          ? "loading..."
          : entity?.gallery.map((image, index) => (
              <div key={image.id} className="relative h-64 w-48">
                {/* <button className="absolute top-0 right-0 z-10 h-6 w-6 text-gray-400 hover:text-red-500">
                  &#10005;
                </button> */}
                <Image
                  src={image.url}
                  alt=""
                  fill
                  className="w-full rounded-md object-contain"
                />
              </div>
            ))}
      </div>
    </div>
  );
}
