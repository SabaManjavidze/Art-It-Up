import React, { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import { RouterOutputs, api } from "../../utils/api";
import { Loader2 } from "lucide-react";
import { nanoid } from "nanoid";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Layout from "../Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import type { Session } from "next-auth";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { BsPersonDash } from "react-icons/bs";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

const RowNames = ["Image", "Name", "Status"];
const TabList = ["Friends", "Received Requests", "Sent Requests"] as const;
function FriendsSection() {
  const [activeTab, setActiveTab] = useState("Friends");
  const { data: receivedRequests, isLoading: receivedRequestsLoading } =
    api.friends.getRecievedRequests.useQuery();
  const { data: sentRequests, isLoading: sentRequestsLoading } =
    api.friends.getSentRequests.useQuery();
  const { data: friends, isLoading: friendsLoading } =
    api.friends.getFriends.useQuery();
  const trpc = api.useContext();
  const { mutateAsync: acceptRequest } =
    api.friends.acceptFriendRequest.useMutation({
      onSuccess() {
        trpc.friends.getRecievedRequests.invalidate();
        trpc.friends.getFriends.invalidate();
      },
    });

  const session = useSession();
  const [reqLoading, setReqLoading] = useState<"decline" | "accept" | "static">(
    "static"
  );

  const handleAcceptRequest = async (
    requestId: string,
    userName: string,
    status: "ACCEPTED" | "REJECTED"
  ) => {
    setReqLoading(status == "ACCEPTED" ? "accept" : "decline");
    await acceptRequest({ requestId, status });
    setReqLoading("static");
    if (status == "ACCEPTED") {
      toast.success(`added ${userName} to friends`);
      return;
    }
    toast.success(`declined ${userName}'s request`);
  };

  return (
    <div className="bg-background text-primary-foreground">
      <Tabs
        className="flex flex-col items-center rounded-lg border border-gray-200"
        onValueChange={setActiveTab}
        defaultValue="Friends"
        value={activeTab}
      >
        <TabsList className="flex w-full justify-center rounded-lg p-2">
          {TabList.map((tab, i) => (
            <TabsTrigger
              key={nanoid()}
              value={tab}
              className="sm:text-md rounded-none border-r-2 border-primary-foreground/30 text-sm last-of-type:border-r-0 md:text-lg"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="Friends" className="w-full pb-4">
          <div className="grid gap-4 gap-x-10 px-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {friendsLoading ? (
              <Loader2 size={20} color="white" />
            ) : friends && friends.length > 0 ? (
              friends.map((user) => {
                const [person, type] =
                  user.friendId == session?.data?.user.id
                    ? [user.user, "sender" as const]
                    : [user.friend, "receiver" as const];
                return (
                  <FriendCard key={person.id} person={person} type={type} />
                );
              })
            ) : (
              "You Have 0 Friends. Congrats!"
            )}
          </div>
        </TabsContent>
        <TabsContent value="Received Requests" className="w-full pb-4">
          <div className="flex items-center justify-around pb-12">
            {RowNames.map((name) => (
              <div
                className="text-md h-full flex-1 border-2 border-gray-300 text-center md:text-xl"
                key={nanoid()}
              >
                {name}
              </div>
            ))}
          </div>
          <div className="px-3">
            {receivedRequestsLoading ? (
              <Loader2 size={20} />
            ) : receivedRequests && receivedRequests.length > 0 ? (
              receivedRequests.map((receivedReq) => (
                <div
                  key={receivedReq.friendId}
                  className="flex items-center justify-around rounded-md border border-primary-foreground/30 py-4"
                >
                  <div className="flex flex-1 justify-center">
                    <Image
                      src={receivedReq?.user?.image || ""}
                      width={70}
                      height={70}
                      className="rounded-full border border-primary-foreground/70"
                      alt="user profile image"
                    />
                  </div>
                  <div className="flex flex-1 justify-center">
                    <h3 className="text-skin-base text-md md:text-lg">
                      {receivedReq?.user?.name}
                    </h3>
                  </div>
                  <div className="flex flex-1 justify-around">
                    <Button
                      isLoading={reqLoading == "accept"}
                      className="md:text-md h-9 px-4  text-[13px] md:h-10 md:py-2"
                      onClick={() =>
                        handleAcceptRequest(
                          receivedReq.id,
                          receivedReq.user.name,
                          "ACCEPTED"
                        )
                      }
                    >
                      <p className="hidden md:block">Accept</p>
                      <AiOutlineCheck className="block md:hidden" />
                    </Button>
                    <Button
                      isLoading={reqLoading == "decline"}
                      variant={"destructive"}
                      className="md:text-md h-9 px-4 text-[13px] md:h-10 md:px-4 md:py-2"
                      onClick={() =>
                        handleAcceptRequest(
                          receivedReq.id,
                          receivedReq.user.name,
                          "REJECTED"
                        )
                      }
                    >
                      <p className="hidden md:block">Decline</p>
                      <AiOutlineClose className="block md:hidden" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              "No Requests Received"
            )}
          </div>
        </TabsContent>
        <TabsContent value="Sent Requests" className="w-full pb-4">
          <div className="flex items-center justify-around pb-12">
            {RowNames.map((name) => (
              <div
                className="h-full flex-1 border-2 border-gray-300 text-center text-xl"
                key={nanoid()}
              >
                {name}
              </div>
            ))}
          </div>
          <div className="px-3">
            {sentRequestsLoading ? (
              <Loader2 size={20} color="white" />
            ) : sentRequests && sentRequests.length > 0 ? (
              sentRequests.map((sentReq) => (
                <div
                  key={sentReq.friendId}
                  className="flex items-center justify-around rounded-md border border-primary-foreground/30 py-4"
                >
                  <div className="flex flex-1 justify-center">
                    <Image
                      src={sentReq.friend?.image || ""}
                      width={50}
                      height={50}
                      className="rounded-full border border-primary-foreground/70"
                      alt="user profile image"
                    />
                  </div>
                  <div className="flex flex-1 justify-center">
                    <h3 className="text-skin-base text-lg">
                      {sentReq?.friend?.name}
                    </h3>
                  </div>
                  <div className="flex flex-1 justify-center">
                    <h3 className="text-skin-base text-lg">
                      {sentReq.status.toString()}
                    </h3>
                  </div>
                </div>
              ))
            ) : (
              "No Requests Sent."
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function FriendCard({
  person,
  type,
}: {
  person: Session["user"];
  type: "sender" | "receiver";
}) {
  const context = api.useContext();
  const { mutateAsync: removeFriend, isLoading } =
    api.friends.removeFriend.useMutation({
      onSuccess() {
        context.friends.getFriends.invalidate();
        context.user.getPersonalDetails.setData(undefined, (oldData) => {
          return {
            firstName: oldData?.firstName as string,
            lastName: oldData?.lastName as string,
            phone: oldData?.phone as number,
            friendCount: (oldData?.friendCount as number) - 1,
          };
        });
      },
    });
  const session = useSession();
  const handleRemoveFriendClick = async () => {
    const myId = session.data?.user.id as string;
    let userId = "";
    let friendId = "";
    if (type == "sender") {
      userId = person.id;
      friendId = myId;
    } else {
      userId = myId;
      friendId = person.id;
    }
    await removeFriend({ friendId, userId });
  };
  return (
    <Card className="border-primary-foreground/40">
      <CardContent className="flex flex-col items-center justify-between pt-8">
        <Image
          src={person?.image || ""}
          width={100}
          height={100}
          className="rounded-full border-2 border-primary-foreground/70"
          alt="user profile image"
        />
        <div className="flex justify-center">
          <h3 className="text-skin-base text-lg">{person?.name}</h3>
        </div>
      </CardContent>
      <CardFooter className="px-4">
        <Button
          isLoading={isLoading}
          onClick={handleRemoveFriendClick}
          className="w-full"
        >
          <BsPersonDash size={20} />
          <h3 className="ml-3">Remove Friend</h3>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default FriendsSection;
