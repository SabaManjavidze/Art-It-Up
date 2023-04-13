import React from "react";
import Image from "next/image";
import type { RouterOutputs} from "../utils/api";
import { api } from "../utils/api";
import { ClipLoader } from "react-spinners";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

type SearchResultsPropType = {
  users: RouterOutputs["user"]["searchUsers"];
};
export default function SearchResults({ users }: SearchResultsPropType) {
  const { mutateAsync: sendFriendReq, isLoading } =
    api.friends.sendFriendRequest.useMutation();
  const handleSendFriendRequest = async (userId: string, username: string) => {
    await sendFriendReq({ addressantId: userId });
    toast.success(`sent friend request to ${username}`);
  };
  const session = useSession();
  return (
    <div className="p-5">
      {users.map((user) => (
        <div key={user.id} className="flex items-center justify-around">
          <Image
            src={user?.image || ""}
            width={50}
            height={50}
            className="h-auto w-auto rounded-full"
            alt="user profile image"
          />
          <h3 className="text-lg text-skin-base">{user.name}</h3>
          <button
            disabled={user.id == session.data?.user.id || user.isFriend}
            className="rounded-md border-2 border-white p-2 duration-150 hover:bg-white/20 active:bg-white/40 disabled:border-gray-400  disabled:text-gray-400 
	    disabled:hover:bg-transparent"
            onClick={() => handleSendFriendRequest(user.id, user.name)}
          >
            {isLoading ? (
              <ClipLoader color="white" />
            ) : (
              <p className="text-md text-center">Add To Friends</p>
            )}
          </button>
        </div>
      ))}
    </div>
  );
}
