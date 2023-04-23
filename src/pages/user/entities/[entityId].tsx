import React from "react";
import Image from "next/image";
import { api } from "../../../utils/api";

interface EntityDetailsPagePropType {
  entityId: string;
}
export default function EntityDetailsPage({
  entityId,
}: EntityDetailsPagePropType) {
  const { data: entity } = api.entity.getEntity.useQuery({ entityId });
  return (
    <div className="flex min-h-screen justify-center bg-skin-main px-1.5">
      <div
        className="grid grid-cols-2 grid-rows-2 py-32 sm:grid-cols-2 sm:flex-row 
      sm:justify-center md:grid-cols-3 lg:grid-cols-4"
      >
        {entity?.gallery.map((image, index) => (
          <div
            key={image.id}
            className="relative flex h-64 w-48 justify-center "
          >
            <Image
              src={image.url}
              alt=""
              sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
              priority
              fill
              className="w-full rounded-md object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
import { GetServerSideProps } from "next";
import { appRouter } from "../../../server/api/root.router";
import { createContextInner } from "../../../server/api/trpc";
import superjson from "superjson";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner(),
    transformer: superjson,
  });

  const entityId = context?.params?.entityId as string;
  await ssg.entity.getEntity.prefetch({ entityId });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      entityId,
    },
  };
};
