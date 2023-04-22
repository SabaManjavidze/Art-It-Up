import React from "react";
import { api } from "../../utils/api";
import { ClipLoader } from "react-spinners";
import Image from "next/image";
import { AiFillPlusSquare, AiOutlinePlusSquare } from "react-icons/ai";
import { EntityProvider } from "../../hooks/useEntitiesHook";
import EntitiesPage from "../../components/wrappedPages/EntitiesPage";

export default function EntitiesPageContainer() {
  const { data: entities, isLoading: entitiesLoading } =
    api.entity.getEntities.useQuery();
  if (entitiesLoading)
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-skin-main">
        <ClipLoader size={200} color={"white"} />
      </div>
    );
  return (
    <div className="absolute min-h-screen w-full bg-skin-main text-skin-base ">
      <EntityProvider>
        <EntitiesPage entities={entities} />
      </EntityProvider>
    </div>
  );
}
