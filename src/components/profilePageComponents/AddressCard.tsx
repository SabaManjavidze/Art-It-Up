import React, { useState } from "react";
import type { UserAddress } from "@prisma/client";
import { Button } from "../ui/button";
import Link from "next/link";
import { formatAddress, limitTxt } from "@/utils/general/utils";
import { HiHashtag, HiLocationMarker } from "react-icons/hi";
import { TbPencil } from "react-icons/tb";

const ICON_SIZE = 22;
const userAddressesArr = [
  {
    title: "Country",
    icon: <HiLocationMarker size={ICON_SIZE} />,
    val: "country",
  },
  { title: "ZipCode", icon: <HiHashtag size={ICON_SIZE} />, val: "zip" },
  {
    title: "City/Region",
    icon: <HiLocationMarker size={ICON_SIZE} />,
    val: "region",
  },
  {
    title: "Address",
    icon: <HiLocationMarker size={ICON_SIZE} />,
    val: "address1",
  },
] as const;
export default function AddressCard({
  userAddress,
}: {
  userAddress: UserAddress;
}) {
  return (
    <div className="mt-6 flex w-full justify-between first-of-type:mt-0 md:w-1/2">
      <div>
        {userAddressesArr.map((address) => (
          <div className="flex items-center py-2" key={address.val}>
            {address.icon}
            <div className="ml-4 flex flex-col justify-center">
              <h4 className="text-muted-foreground">{address.title}</h4>
              <h4 className="">{userAddress[address.val] ?? "not provided"}</h4>
            </div>
          </div>
        ))}
      </div>
      <div>
        <Link href={`/edit-shipping-address/?${formatAddress(userAddress)}`}>
          <Button
            variant="ghost"
            className="flex items-center text-sm text-accent-foreground sm:text-lg"
          >
            <TbPencil size={20} />
            <h3 className="ml-1">Edit address</h3>
          </Button>
        </Link>
      </div>
    </div>
  );
}
