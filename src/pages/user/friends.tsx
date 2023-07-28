import React, { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import { api } from "../../utils/api";
import { Loader2 } from "lucide-react";
import { nanoid } from "nanoid";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RowNames = ["Image", "Name", "Status"];
const TabList = ["Received Requests", "Sent Requests", "Friends"] as const;
function UserFriendsPage() {
  const [activeTab, setActiveTab] = useState("Received Requests");
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
    <Layout title="Friends">
      <div className="min-h-screen bg-background p-5 text-primary-foreground">
        <h1 className="mb-4 text-2xl font-bold">My Friends</h1>
        <Tabs
          className="mt-10 flex flex-col items-center rounded-lg border border-gray-200"
          onValueChange={setActiveTab}
          defaultValue="Received Requests"
        >
          <TabsList className="flex w-full justify-center rounded-lg bg-secondary p-2">
            {TabList.map((tab, i) => (
              <TabsTrigger
                key={nanoid()}
                value={tab}
                className={`mr-2 flex-1 rounded-md bg-secondary px-3 py-4 text-sm font-medium text-secondary-foreground hover:bg-background focus:outline-none ${
                  tab == activeTab ? "ring-2 ring-indigo-400" : null
                } 
	    duration-150`}
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="Recieved Requests" className="w-full pb-4">
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
              {receivedRequestsLoading ? (
                <Loader2 size={20} color="white" />
              ) : receivedRequests && receivedRequests.length > 0 ? (
                receivedRequests.map((receivedReq) => (
                  <div
                    key={receivedReq.friendId}
                    className="flex items-center justify-around"
                  >
                    <div className="flex flex-1 justify-center">
                      <Image
                        src={receivedReq?.user?.image || ""}
                        width={50}
                        height={50}
                        className=" rounded-full"
                        alt="user profile image"
                      />
                    </div>
                    <div className="flex flex-1 justify-center">
                      <h3 className="text-skin-base text-lg">
                        {receivedReq?.user?.name}
                      </h3>
                    </div>
                    <div className="flex flex-1 justify-center">
                      <button
                        className="rounded-md border-2 border-white p-2 duration-150 hover:bg-white/20 active:bg-white/40 disabled:border-gray-400  
	    disabled:text-gray-400 disabled:hover:bg-transparent"
                        onClick={() =>
                          handleAcceptRequest(
                            receivedReq.id,
                            receivedReq.user.name,
                            "ACCEPTED"
                          )
                        }
                      >
                        {reqLoading == "accept" ? (
                          <Loader2 color="white" size={20} />
                        ) : (
                          "Accept"
                        )}
                      </button>
                      <button
                        className="rounded-md border-2 border-white p-2 duration-150 hover:bg-white/20 active:bg-white/40 disabled:border-gray-400  
	    disabled:text-gray-400 disabled:hover:bg-transparent"
                        onClick={() =>
                          handleAcceptRequest(
                            receivedReq.id,
                            receivedReq.user.name,
                            "REJECTED"
                          )
                        }
                      >
                        {reqLoading == "decline" ? (
                          <Loader2 color="white" size={20} />
                        ) : (
                          "Decline"
                        )}
                      </button>
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
                    className="flex items-center justify-around"
                  >
                    <div className="flex flex-1 justify-center">
                      <Image
                        src={sentReq.friend?.image || ""}
                        width={50}
                        height={50}
                        className=" rounded-full"
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
          <TabsContent value="Friends" className="w-full pb-4">
            <div className="px-3">
              {friendsLoading ? (
                <Loader2 size={20} color="white" />
              ) : friends && friends.length > 0 ? (
                friends.map((user) => {
                  const person =
                    user.friendId == session?.data?.user.id
                      ? user.user
                      : user.friend;
                  return (
                    <div
                      key={person?.id}
                      className="flex items-center justify-around border-b-2 border-white py-6"
                    >
                      <div className="flex flex-1 justify-center">
                        <Image
                          src={person?.image || ""}
                          width={50}
                          height={50}
                          className="rounded-full"
                          alt="user profile image"
                        />
                      </div>
                      <div className="flex flex-1 justify-center">
                        <h3 className="text-skin-base text-lg">
                          {person?.name}
                        </h3>
                      </div>
                    </div>
                  );
                })
              ) : (
                "You Have 0 Friends"
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

export default UserFriendsPage;
