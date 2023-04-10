import React from "react";
import Image from "next/image";
import { api } from "../utils/api";
import { ClipLoader } from "react-spinners";
import { useSession } from "next-auth/react";

type SearchResultsPropType = {
  users: { id: string; name: string; image: string | null }[];
};
export default function SearchResults({ users }: SearchResultsPropType) {
  const { mutateAsync: sendFriendReq, isLoading } =
    api.friends.sendFriendRequest.useMutation();
  const handleSendFriendRequest = async (userId: string) => {
    await sendFriendReq({ addressantId: userId });
  };
  const session = useSession()
  return (
    <div className="p-5">
      {users.map((user) => (
        <div key={user.id} className="flex items-center justify-around">
          <Image
            src={user?.image||""}
            width={50}
            height={50}
            className="h-auto w-auto rounded-full"
            alt="user profile image"
          />
          <h3 className="text-lg text-skin-base">{user.name}</h3>
          <button
            disabled={user.id == session.data?.user.id}
            className="rounded-md border-2 border-white p-2 duration-150 hover:bg-white/20 active:bg-white/40 disabled:border-gray-400  disabled:text-gray-400 
	    disabled:hover:bg-transparent"
            onClick={() => handleSendFriendRequest(user.id)}
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
