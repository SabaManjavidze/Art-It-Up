import React, { Fragment, useState } from "react";
import Image from "next/image";
import { Tab } from "@headlessui/react";
import { api } from "../../utils/api";
import { ClipLoader } from "react-spinners";
import { nanoid } from "nanoid";

const tabClassName = `mr-2 px-3 py-4 font-medium text-sm rounded-md flex-1 bg-skin-secondary hover:bg-skin-main focus:outline-none focus:ring-2 
focus:ring-indigo-500 duration-150`;
const RowNames = ["Image", "Name", "Status"];
function UserFriendsPage() {
  const [activeTab, setActiveTab] = useState(1);
  const { data: receivedRequests, isLoading: receivedRequestsLoading } =
    api.friends.getRecievedRequests.useQuery();
  const { data: sentRequests, isLoading: sentRequestsLoading } =
    api.friends.getSentRequests.useQuery();
  const { data: friends, isLoading: friendsLoading } =
    api.friends.getFriends.useQuery();
  const { mutateAsync: acceptRequest, isLoading: acceptReqLoading } =
    api.friends.acceptFriendRequest.useMutation();

  const handleAcceptRequest = async (requestId: string) => {
    await acceptRequest({ requestId });
  };

  return (
    <div className="min-h-screen bg-skin-main p-5 text-white">
      <h1 className="mb-4 text-2xl font-bold">My Friends</h1>
      <Tab.Group
        className="mt-10 flex flex-col items-center rounded-lg border border-gray-200"
        as="div"
        onChange={setActiveTab}
        defaultIndex={activeTab}
      >
        <Tab.List className="flex w-full justify-center rounded-lg bg-skin-light-secondary p-2">
          <Tab className={tabClassName}>Received Requests</Tab>
          <Tab className={tabClassName}>Sent Requests</Tab>
          <Tab className={tabClassName}>Friends</Tab>
        </Tab.List>
        <Tab.Panel className="w-full pb-4">
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
              <ClipLoader size={20} color="white" />
            ) : receivedRequests && receivedRequests.length > 0 ? (
              receivedRequests.map((receivedReq) => (
                <div
                  key={receivedReq.friend_id}
                  className="flex items-center justify-around"
                >
                  <div className="flex flex-1 justify-center">
                    <Image
                      src={receivedReq.user?.image||""}
                      width={50}
                      height={50}
                      className="h-auto w-auto rounded-full"
                      alt="user profile image"
                    />
                  </div>
                  <div className="flex flex-1 justify-center">
                    <h3 className="text-lg text-skin-base">
                      {receivedReq?.user?.name}
                    </h3>
                  </div>
                  <div className="flex flex-1 justify-center">
                    <button
                      className="rounded-md border-2 border-white p-2 duration-150 hover:bg-white/20 active:bg-white/40 disabled:border-gray-400  
	    disabled:text-gray-400 disabled:hover:bg-transparent"
                      onClick={() => handleAcceptRequest(receivedReq.id)}
                    >
                      Accept
                    </button>
                  </div>
                </div>
              ))
            ) : (
              "No Requests Received"
            )}
          </div>
        </Tab.Panel>
        <Tab.Panel className="w-full pb-4">
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
              <ClipLoader size={20} color="white" />
            ) : sentRequests && sentRequests.length > 0 ? (
              sentRequests.map((sentReq) => (
                <div
                  key={sentReq.friend_id}
                  className="flex items-center justify-around"
                >
                  <div className="flex flex-1 justify-center">
                    <Image
                      src={sentReq.friend?.image||""}
                      width={50}
                      height={50}
                      className="h-auto w-auto rounded-full"
                      alt="user profile image"
                    />
                  </div>
                  <div className="flex flex-1 justify-center">
                    <h3 className="text-lg text-skin-base">
                      {sentReq?.friend?.name}
                    </h3>
                  </div>
                  <div className="flex flex-1 justify-center">
                    <h3 className="text-lg text-skin-base">
                      {sentReq.status.toString()}
                    </h3>
                  </div>
                </div>
              ))
            ) : (
              "No Requests Sent."
            )}
          </div>
        </Tab.Panel>
        <Tab.Panel className="w-full pb-4">
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
            {friendsLoading ? (
              <ClipLoader size={20} color="white" />
            ) : friends && friends.length > 0 ? (
              friends.map((user) => (
                <div
                  key={user.friend.id}
                  className="flex items-center justify-around"
                >
                  <div className="flex flex-1 justify-center">
                    <Image
                      src={user.friend?.image||""}
                      width={50}
                      height={50}
                      className="h-auto w-auto rounded-full"
                      alt="user profile image"
                    />
                  </div>
                  <div className="flex flex-1 justify-center">
                    <h3 className="text-lg text-skin-base">
                      {user.friend.name}
                    </h3>
                  </div>
                </div>
              ))
            ) : (
              "You Have 0 Friends"
            )}
          </div>
        </Tab.Panel>
      </Tab.Group>
    </div>
  );
}

export default UserFriendsPage;
