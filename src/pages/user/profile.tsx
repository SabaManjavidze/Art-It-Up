import React, { useState } from "react";
import { api } from "../../utils/api";
import { Loader2 } from "lucide-react";
import PersonalDetailsSection from "@/components/ProfilePageComponents/PersonalDetailsSection";
import { BsPeople } from "react-icons/bs";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Profile() {
  const {
    data: userAddresses,
    isLoading,
    error: addressesError,
  } = api.user.getUserAddress.useQuery();
  const {
    data: personalDetails,
    isLoading: detailsLoading,
    error: detailsError,
  } = api.user.getPersonalDetails.useQuery();

  const [expanded, setExpanded] = useState("");
  const [clicked, setClicked] = useState(false);

  const handleHeaderClick = async (id: string) => {
    setExpanded(expanded == id ? "" : id);
  };
  const session = useSession();

  if (isLoading || detailsLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 color="white" />
      </div>
    );
  }
  if (addressesError || detailsError || session.status == "unauthenticated") {
    return <div>{addressesError?.message}</div>;
  }

  return (
    <div className="container-xl min-h-screen bg-background px-3 text-primary-foreground lg:px-5">
      <div className="relative mt-8 flex flex-col items-center md:flex-row">
        <div className="flex flex-col">
          <Image
            src={session.data?.user.image || ""}
            width={296}
            height={296}
            quality={100}
            className="rounded-full border-2 border-primary-foreground/70 object-contain"
            alt="User Profile Picture rounded-full"
          />
          <div className="mt-8 text-center md:text-start">
            <h2 className="text-2xl font-bold">
              {personalDetails.firstName} {personalDetails.lastName}
            </h2>
            <h2 className="text-xl font-normal text-muted-foreground">
              {session.data?.user.name}
            </h2>
          </div>
          <div className="mt-4 flex items-center justify-center text-muted-foreground md:justify-start">
            <div className="flex items-center">
              <BsPeople size={20} />
              <h2 className="mx-1 text-center font-medium text-primary-foreground">
                {personalDetails.friendCount}
              </h2>
              <h2>{personalDetails.friendCount <= 1 ? "Friend" : "Friends"}</h2>
            </div>
          </div>
          <Link href="/user/entities">
            <Button
              isLoading={clicked}
              onClick={() => setClicked(true)}
              className="mt-5 w-full"
            >
              Add New Entity
            </Button>
          </Link>
        </div>
        <div className="ml-0 w-[70%] md:ml-32">
          <PersonalDetailsSection />
        </div>
      </div>
      <section className="mt-12 flex flex-col border-b-2 border-white pb-10">
        <label className="block py-10 text-3xl font-medium">
          Your Addresses
        </label>
        <div className="grid grid-cols-1 gap-x-10 sm:grid-cols-2 md:grid-cols-2  md:gap-x-20 lg:grid-cols-3 xl:grid-cols-4">
          {userAddresses?.map((details) => (
            <div
              key={details.id}
              className="mt-2 flex justify-center first-of-type:mt-0 sm:mt-0"
            >
              <AddressCard
                expanded={expanded == details.id}
                handleHeaderClick={() => handleHeaderClick(details.id)}
                details={details}
              />
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Link
            href="/shipping-address"
            className="hover:text-accent-foreground"
          >
            + add address
          </Link>
        </div>
      </section>
      <section>
        <label className="block py-10 text-3xl font-medium">Your Friends</label>
        <FriendsSection />
      </section>
    </div>
  );
}

import type { GetServerSideProps } from "next";
import superjson from "superjson";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { getServerAuthSession } from "../../server/auth";
import { appRouter } from "../../server/api/root.router";
import { createContextInner } from "../../server/api/trpc";
import { SIGNIN_ROUTE } from "@/utils/constants";
import AddressCard from "@/components/ProfilePageComponents/AddressCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import FriendsSection from "../../components/ProfilePageComponents/FriendsSection";
import { Router } from "next/router";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession({
    req: context.req,
    res: context.res,
  });
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner({ session }),
    transformer: superjson,
  });

  await ssg.user.getPersonalDetails.prefetch();
  await ssg.user.getUserAddress.prefetch();
  await ssg.friends.getRecievedRequests.prefetch();
  await ssg.friends.getRecievedRequests.prefetch();
  await ssg.friends.getRecievedRequests.prefetch();
  let redirect: { permanent: boolean; destination: string } | undefined;
  if (!session) {
    redirect = {
      permanent: false,
      destination: SIGNIN_ROUTE,
    };
  }
  return {
    redirect,
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};
