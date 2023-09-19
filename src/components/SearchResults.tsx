import React, { useState } from "react";
import Image from "next/image";
import type { RouterOutputs } from "../utils/api";
import { api } from "../utils/api";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Modal from "./ui/modal";
import { Button } from "./ui/button";

type SearchResultsPropType = {
  users: RouterOutputs["user"]["searchUsers"];
};
function ResultCard({
  id,
  image,
  disabled,
  name,
}: {
  id: string;
  name: string;
  image: string;
  disabled: boolean;
}) {
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

  return (
    <div className="mt-5 flex items-center justify-around text-primary-foreground">
      <Image
        src={image}
        width={50}
        height={50}
        className="w-[15%] rounded-full border border-primary-foreground/70"
        alt="user profile image"
      />
      <h3 className="text-skin-base w-1/2 pl-6 text-start text-lg">{name}</h3>
      <Button
        disabled={disabled}
        variant="outline"
        isLoading={isLoading}
        className="w-[35%]"
        onClick={() => handleSendFriendRequest(id, name)}
      >
        <p className="text-md text-center">Add To Friends</p>
      </Button>
    </div>
  );
}
export default function SearchResults({ users }: SearchResultsPropType) {
  const [isOpen, setIsOpen] = useState(true);
  const session = useSession();
  return (
    <div>
      <Modal isOpen={isOpen} closeModal={() => setIsOpen(false)} title="Users">
        {users.map((user) => (
          <ResultCard
            key={user.id}
            id={user.id}
            name={user.name}
            image={user?.image || ""}
            disabled={user.id == session.data?.user.id || user.isFriend}
          />
        ))}
      </Modal>
    </div>
  );
}
