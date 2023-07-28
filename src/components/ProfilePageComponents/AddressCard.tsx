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

export default function AddressCard({ details }: { details: UserAddress }) {
  return (
    <Card className="w-[350px]">
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
        <Button variant={"destructive"}>Remove</Button>
      </CardFooter>
    </Card>
  );
}
