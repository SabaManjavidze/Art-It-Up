import type { Entity } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BLANK_PROFILE_URL } from "../../pages/_app";
import { useEntities } from "../../hooks/useEntitiesHook";
import { ClipLoader } from "react-spinners";
import { IoClose } from "react-icons/io5";
import { api } from "../../utils/api";

export default function EntityCard({ entity }: { entity: Entity }) {
  const utils = api.useContext();
  const { mutateAsync: deleteEntity, isLoading: deleteEntityLoading } =
    api.entity.deleteEntity.useMutation({
      onSuccess() {
        utils.entity.getEntities.invalidate();
      },
    });
  const handleRemoveEntity = async (id: string) => {
    await deleteEntity({ entityId: id });
  };
  return (
    <div
      className="relative box-content flex w-36 cursor-pointer items-center
                  rounded-md border-2 py-1 pl-5 pr-8 duration-150 hover:bg-white/20"
    >
      <Link key={entity.id} href={`/user/entities/${entity.id}`}>
        <div className="relative h-16 w-16 rounded-full ">
          <Image
            alt="Entity Picture"
            className="rounded-full object-cover"
            fill
            src={entity?.picture || BLANK_PROFILE_URL}
          />
        </div>
      </Link>
      <h3 className="ml-5 whitespace-nowrap text-xl">{entity.name}</h3>
      <button
        className="absolute top-0 right-0 z-10 h-6 w-6 text-gray-400 hover:text-red-500"
        onClick={() => handleRemoveEntity(entity.id)}
      >
        {deleteEntityLoading ? (
          <ClipLoader size={20} color="white" />
        ) : (
          <IoClose size={20} />
        )}
      </button>
    </div>
  );
}
