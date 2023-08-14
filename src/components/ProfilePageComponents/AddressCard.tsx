import React, { useState } from "react";
import type { UserAddress } from "@prisma/client";
import { nanoid } from "nanoid";
import { PublicKeys } from "../WrappedPages/ProfilePage";
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
import { Loader2 } from "lucide-react";
import Link from "next/link";

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

export default function AddressCard({ details }: { details: UserAddress }) {
  const [removed, setRemoved] = useState(false);
  const { mutateAsync: removeAddress, isLoading } =
    api.address.removeAddress.useMutation();
  const handleRemoveAddress = async () => {
    await removeAddress({ addressId: details.id });
    setRemoved(true);
  };
  return (
    <Card className={`w-[350px] ${removed && "hidden"}`}>
      <CardHeader>
        <CardTitle>{details.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {(Object.keys(details) as (keyof UserAddress)[]).map((key) => {
          if ((PublicKeys as any)[key])
            return (
              <p key={nanoid()}>
                {key}: {details[key]}
              </p>
            );
        })}
      </CardContent>
      <CardFooter className="flex justify-between">
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
    </Card>
  );
}
