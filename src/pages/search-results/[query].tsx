import { useRouter } from "next/router";
import { SearchResultsPage } from "../../components/WrappedPages/SearchResultsPage";
import React from "react";
import { ClipLoader } from "react-spinners";

export default function SearchResultsPageContainer() {
  const router = useRouter();
  const query = router.query.query;
  const tags = router.query.tags;

  if (!query)
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-skin-main">
        <ClipLoader size={200} color={"white"} />
      </div>
    );

  return (
    <SearchResultsPage
      tags={tags ? tags.toString().split(", ") : undefined}
      query={query.toString()}
    />
  );
}
