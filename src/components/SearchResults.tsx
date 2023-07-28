import React, { useState } from "react";
import Image from "next/image";
import type { RouterOutputs } from "../utils/api";
import { api } from "../utils/api";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Modal from "./ui/Modal";

type SearchResultsPropType = {
  users: RouterOutputs["user"]["searchUsers"];
};
export default function SearchResults({ users }: SearchResultsPropType) {
  const [isOpen, setIsOpen] = useState(true);
  const context = api.useContext();
  const { mutateAsync: sendFriendReq, isLoading } =
    api.friends.sendFriendRequest.useMutation({
      onSuccess() {
        context.friends.getSentRequests.invalidate();
      },
    });

  const handleSendFriendRequest = async (userId: string, username: string) => {
    await sendFriendReq({ addressantId: userId });
    toast.success(`sent friend request to ${username}`);
  };
  const session = useSession();
  return (
    <div>
      <Modal isOpen={isOpen} closeModal={() => setIsOpen(false)} title="Users">
        {users.map((user) => (
          <div
            key={user.id}
            className="mt-5 flex items-center justify-around text-primary-foreground"
          >
            <Image
              src={user?.image || ""}
              width={50}
              height={50}
              className="rounded-full"
              alt="user profile image"
            />
            <h3 className="text-skin-base text-lg">{user.name}</h3>
            <button
              disabled={user.id == session.data?.user.id || user.isFriend}
              className="rounded-md border-2 border-white p-2 duration-150 hover:bg-white/20 active:bg-white/40 disabled:border-gray-400  disabled:text-gray-400 
	    disabled:hover:bg-transparent"
              onClick={() => handleSendFriendRequest(user.id, user.name)}
            >
              {isLoading ? (
                <Loader2 color="white" />
              ) : (
                <p className="text-md text-center">Add To Friends</p>
              )}
            </button>
          </div>
        ))}
      </Modal>
    </div>
  );
}
