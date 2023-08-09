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
        <Button variant="outline">Edit</Button>
        <Button onClick={handleRemoveAddress} variant={"destructive"}>
          {isLoading ? <Loader2 size={20} /> : "Remove"}
        </Button>
      </CardFooter>
    </Card>
  );
}
