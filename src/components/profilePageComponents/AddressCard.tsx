import React, { useState } from "react";
import type { UserAddress } from "@prisma/client";
import { nanoid } from "nanoid";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { api } from "@/utils/api";
import { HiChevronUpDown } from "react-icons/hi2";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { PublicKeys } from "@/utils/general/constants";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { limitTxt } from "@/utils/general/utils";

const formatAddress = (details: UserAddress) => {
  const { selected, userId, ...realDetails } = details;
  let str = "";
  Object.entries(realDetails).forEach(([key, value]) => {
    const realValue = value ?? "";
    if (str.length == 0) {
      str += `${key}=${realValue}`;
    } else {
      str += `&${key}=${realValue}`;
    }
  });
  return str;
};

export default function AddressCard({
  details,
  expanded,
  handleHeaderClick,
}: {
  handleHeaderClick: () => void;
  expanded: boolean;
  details: UserAddress;
}) {
  const [removed, setRemoved] = useState(false);
  const { mutateAsync: removeAddress, isLoading } =
    api.address.removeAddress.useMutation();
  const handleRemoveAddress = async () => {
    await removeAddress({ addressId: details.id });
    setRemoved(true);
  };
  const [cardRef] = useAutoAnimate();
  return (
    <Card className={`${removed ? "hidden" : ""} relative w-64`}>
      <CardHeader
        className="flex cursor-pointer flex-row justify-between border py-3 transition-colors hover:bg-primary/5"
        onClick={handleHeaderClick}
      >
        <CardTitle className="select-none text-xl">{details.title}</CardTitle>
        <HiChevronUpDown size={20} className="text-primary-foreground" />
      </CardHeader>

      <div
        className="absolute right-0 left-0 bottom-0 z-10 translate-y-full border bg-background py-3 "
        hidden={!expanded}
      >
        <div className="ml-3" ref={cardRef}>
          {(Object.keys(details) as (keyof UserAddress)[]).map((key) => {
            if ((PublicKeys as any)[key])
              return (
                <p key={nanoid()}>
                  {key}: {limitTxt(details?.[key]?.toString() || "", 15)}
                </p>
              );
          })}
        </div>
        <CardFooter
          className={`${
            expanded ? "flex" : "hidden"
          } mt-4 w-full justify-between p-0 px-3`}
        >
          <Link href={`/edit-shipping-address?${formatAddress(details)}`}>
            <Button variant="outline">Edit</Button>
          </Link>
          <Button
            isLoading={isLoading}
            onClick={handleRemoveAddress}
            variant={"destructive"}
          >
            Remove
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
