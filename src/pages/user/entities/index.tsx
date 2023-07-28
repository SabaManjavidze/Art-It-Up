import React from "react";
import { api } from "../../../utils/api";
import { Loader2 } from "lucide-react";
import { EntityProvider } from "../../../hooks/useEntitiesHook";
import EntitiesPage from "../../../components/WrappedPages/EntitiesPage";
import { useRouter } from "next/router";

export default function EntitiesPageContainer() {
  const {
    data: entities,
    isLoading: entitiesLoading,
    error: entityError,
  } = api.entity.getEntities.useQuery({});
  const router = useRouter();
  if (entitiesLoading)
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <Loader2 size={200} color={"white"} />
      </div>
    );
  if (entityError?.data?.code == "UNAUTHORIZED") {
    router.push("/");
  }

  return (
    <EntityProvider>
      <EntitiesPage entities={entities} />
    </EntityProvider>
  );
}
