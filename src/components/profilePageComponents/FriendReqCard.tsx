import type { RouterOutputs} from "@/utils/api";
import { api } from "@/utils/api";
import { BLANK_PROFILE_URL } from "@/utils/general/constants";
import Image from "next/image";
import { Button } from "../ui/button";
import { useState } from "react";
import { toast } from "react-toastify";

export default function FriendReqCard({
  req,
}: {
  req: RouterOutputs["friends"]["getRecievedRequests"][number];
}) {
  const [loading, setLoading] = useState<"accept" | "decline" | "none">("none");

  const trpc = api.useContext();
  const { mutateAsync: acceptRequest } =
    api.friends.acceptFriendRequest.useMutation({
      onSuccess() {
        trpc.user.getPersonalDetails.invalidate();
        trpc.friends.getRecievedRequests.invalidate();
      },
    });
  const handleAcceptRequest = async (status: "accept" | "decline") => {
    const requestId = req.id;
    const userName = req.user.name;

    setLoading(status);
    const dbStatus = status == "accept" ? "ACCEPTED" : "REJECTED";
    await acceptRequest({ requestId, status: dbStatus });
    setLoading("none");
    if (status == "accept") {
      toast.success(`added ${userName} to friends`);
      return;
    }
    toast.success(`declined ${userName}'s request`);
  };
  return (
    <div className="mt-5 flex flex-col items-start">
      <div>
        <div className="flex w-1/5 items-center">
          <Image
            src={req.user.image || BLANK_PROFILE_URL}
            width={50}
            height={50}
            quality={60}
            className="border-3 rounded-lg border-primary-foreground/70 object-contain"
            alt="User Profile Picture rounded-full"
          />
          <div className="w-4/5">
            <h3 className="text-md ml-3 whitespace-nowrap font-medium">
              {req.user.name}
            </h3>
          </div>
        </div>
      </div>
      <div className="mt-3 flex w-4/5 whitespace-nowrap ">
        <Button
          variant={"accent"}
          className="mr-1 w-full py-5"
          isLoading={loading == "accept"}
          onClick={() => handleAcceptRequest("accept")}
        >
          Accept Request
        </Button>
        <Button
          variant="outline"
          className="ml-1 w-full border-primary py-5 "
          isLoading={loading == "decline"}
          onClick={() => handleAcceptRequest("decline")}
        >
          Decline Request
        </Button>
      </div>
    </div>
  );
}
