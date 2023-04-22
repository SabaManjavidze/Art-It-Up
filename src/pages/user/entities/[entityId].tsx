import { useRouter } from "next/router";
import React from "react";
import { ClipLoader } from "react-spinners";
import EntityDetailsPage from "../../../components/wrappedPages/EntityDetailsPage";

export default function EntityDetailsContainer() {
  const router = useRouter();
  const { entityId } = router.query;

  if (!entityId)
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-skin-main">
        <ClipLoader size={200} color={"white"} />
      </div>
    );
  return <EntityDetailsPage entityId={entityId.toString()} />;
}
