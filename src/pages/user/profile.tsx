import React, { useEffect, useState } from "react";
import { RouterOutputs, api } from "../../utils/api";
import { Loader2 } from "lucide-react";
import PersonalDetailsSection from "@/components/profilePageComponents/PersonalDetailsSection";
import { SIGNIN_ROUTE } from "@/utils/general/constants";
import { BsPeople } from "react-icons/bs";
import {
  HiMail,
  HiPhone,
  HiCake,
  HiPlusCircle,
  HiUserCircle,
} from "react-icons/hi";
import { TbPencil } from "react-icons/tb";
import { useSession } from "next-auth/react";
import Image from "next/image";

const ICON_SIZE = 22;
export const personalDetailsArr = [
  {
    title: "FirstName",
    icon: <HiUserCircle size={ICON_SIZE} />,
    val: "firstName",
  },
  {
    title: "LastName",
    icon: <HiUserCircle size={ICON_SIZE} />,
    val: "lastName",
  },
  { title: "Email Address", icon: <HiMail size={ICON_SIZE} />, val: "email" },
  { title: "Phone Number", icon: <HiPhone size={ICON_SIZE} />, val: "phone" },
  { title: "Birthday", icon: <HiCake size={ICON_SIZE} />, val: "birthday" },
] as const;
export default function Profile() {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);

  const {
    data: userAddresses,
    isLoading,
    error: addressesError,
  } = api.address.getUserAddress.useQuery();
  const { data: friendRequests, isLoading: friendReqsLoading } =
    api.friends.getRecievedRequests.useQuery();

  const {
    data: gallery,
    isLoading: galleryLoading,
    error,
    fetchNextPage,
  } = api.gallery.getUserGallery.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  const {
    data: personalDetails,
    isLoading: detailsLoading,
    error: detailsError,
  } = api.user.getPersonalDetails.useQuery();

  const [activeTab, setActiveTab] = useState("My Collections");

  const session = useSession();

  if (isLoading || detailsLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 />
      </div>
    );
  }
  if (
    addressesError ||
    detailsError ||
    session.status == "unauthenticated" ||
    !session.data
  ) {
    return <div>{addressesError?.message}</div>;
  }

  return (
    <div className="container flex min-h-screen w-full flex-col items-center bg-background px-3 pt-32 text-primary-foreground md:flex-row md:items-start lg:px-5">
      <EditDetailsModal isOpen={detailsOpen} setIsOpen={setDetailsOpen} />
      <AddAddressModal isOpen={addressOpen} setIsOpen={setAddressOpen} />
      <div className="flex w-full flex-col items-center md:w-1/4 md:items-start">
        <div className="flex w-4/5 flex-col items-center justify-start">
          <Image
            src={session.data.user.image || ""}
            width={130}
            height={130}
            quality={100}
            className="rounded-full border-2 border-primary-foreground/70 object-contain"
            alt="User Profile Picture rounded-full"
          />
          <h2 className="pt-3 text-2xl font-semibold">
            {session.data.user.name}
          </h2>
          <div className="flex items-center">
            <BsPeople size={20} />

            <h2 className="ml-2 text-center font-medium text-primary-foreground">
              {personalDetails.friendCount}
            </h2>
            <h2 className="ml-2">
              {personalDetails.friendCount <= 1 ? "Friend" : "Friends"}
            </h2>
          </div>
          <Button variant={"accent"} className="mt-6 w-full" size="lg">
            Add new entity
          </Button>
          <Button className="mt-2 w-full" size="lg">
            Add friends
          </Button>
        </div>
        <div className="mt-6 w-4/5 md:w-full">
          <h3 className="text-md font-medium">Friend requests</h3>
          {friendRequests?.map((req) => (
            <FriendReqCard req={req} key={req.id} />
          ))}
        </div>
      </div>
      <div className="mt-6 w-full md:mt-0 md:w-3/4">
        <div className="flex w-full text-lg">
          <Tabs
            className="flex w-full flex-col items-center rounded-lg"
            onValueChange={setActiveTab}
            defaultValue="My Collections"
            value={activeTab}
          >
            <TabsList className="flex w-full justify-start rounded-lg bg-muted p-2 py-0 pl-0">
              <TabsTrigger
                key={nanoid()}
                value={"My Collections"}
                className="sm:text-md rounded-l-lg border-primary-foreground/30 text-sm md:text-lg xl:text-xl"
              >
                My Collections
              </TabsTrigger>
              <TabsTrigger
                key={nanoid()}
                value={"Personal Information"}
                className="sm:text-md rounded-none border-primary-foreground/30 text-sm md:text-lg"
              >
                Personal Information
              </TabsTrigger>
            </TabsList>
            <TabsContent value="My Collections" className="w-full pb-4">
              {galleryLoading || error ? null : (
                <PaginationProvider
                  fetchNextPage={fetchNextPage as any}
                  pagesData={gallery?.pages}
                >
                  <UserGalleryTab gallery={gallery} />
                </PaginationProvider>
              )}
            </TabsContent>
            <TabsContent value="Personal Information" className="w-full pb-4">
              <div className="flex flex-col">
                <div className="p-10">
                  <div className="flex w-full items-center justify-between md:w-1/2">
                    <h2 className="text-2xl font-medium">Personal Details</h2>
                    <Button
                      variant="ghost"
                      className="flex items-center text-sm text-accent-foreground sm:text-lg"
                      onClick={() => setDetailsOpen(true)}
                    >
                      <TbPencil size={20} />
                      <h3 className="ml-1">Edit Details</h3>
                    </Button>
                  </div>
                  <div className="mt-4">
                    {personalDetails
                      ? personalDetailsArr.map((detail) => (
                          <div
                            className="flex items-center py-2"
                            key={detail.val}
                          >
                            {detail.icon}
                            <div className="ml-4 flex flex-col justify-center">
                              <h4 className="text-muted-foreground">
                                {detail.title}
                              </h4>
                              <h4>
                                {personalDetails[detail.val] ?? "not provided"}
                              </h4>
                            </div>
                          </div>
                        ))
                      : null}
                  </div>
                </div>
                <div className="p-10">
                  <h2 className="text-2xl font-medium">Your Address</h2>
                  <div className="mt-4">
                    {userAddresses
                      ? userAddresses.map((userAddress) => {
                          return (
                            <AddressCard
                              userAddress={userAddress}
                              key={userAddress.id}
                            />
                          );
                        })
                      : null}
                  </div>
                  <Button
                    onClick={() => setAddressOpen(true)}
                    className="mt-8 flex items-center"
                  >
                    <HiPlusCircle size={20} />
                    <h3 className="ml-1">
                      {userAddresses?.length == 0
                        ? "Add address"
                        : "Add another address"}
                    </h3>
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

import type { GetServerSideProps } from "next";
import superjson from "superjson";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { getServerAuthSession } from "../../server/auth";
import { appRouter } from "../../server/api/root.router";
import { createContextInner } from "../../server/api/trpc";
import AddressCard from "@/components/profilePageComponents/AddressCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TabsList } from "@radix-ui/react-tabs";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { nanoid } from "nanoid";
import FriendReqCard from "@/components/profilePageComponents/FriendReqCard";
import { EditDetailsModal } from "@/components/profilePageComponents/EditDetailsModal";
import AddAddressModal from "@/components/profilePageComponents/AddAddressModal";
import { PaginationProvider, usePagination } from "@/hooks/usePaginationHook";
import UserGalleryTab from "@/components/profilePageComponents/UserGalleryTab";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession({
    req: context.req,
    res: context.res,
  });
  let redirect: { permanent: boolean; destination: string } | undefined;
  if (!session) {
    redirect = {
      permanent: false,
      destination: SIGNIN_ROUTE,
    };
  }
  return {
    redirect,
    props: {},
  };
};
