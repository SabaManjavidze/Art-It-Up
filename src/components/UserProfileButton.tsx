import Image from "next/image";
import Link from "next/link";
import React, { useState, Fragment } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

type UserProfileButtonPropTypes = {
  userPicture: string;
  username: string;
};

const UserProfileButton = ({
  userPicture,
  username,
}: UserProfileButtonPropTypes) => {
  const [showModal, setShowModal] = useState(false);
  const profileOptions = [
    { title: "Profile", path: "/user/profile" },
    { title: "My Orders", path: "/user/orders" },
    { title: "Settings", path: "/user/settings" },
  ];
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button className="m-0 p-0 !outline-none">
          <div className="flex flex-col items-center justify-center">
            <Image
              src={userPicture}
              width={50}
              height={50}
              className="rounded-full"
              alt="user profile image"
            />
            <h3 className="text-skin-base text-md whitespace-nowrap">
              {username}
            </h3>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          {profileOptions.map((item) => (
            <DropdownMenuItem key={item.path}>
              <Link href={item.path}>{item.title}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileButton;
