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
import { signOut } from "next-auth/react";

type UserProfileButtonPropTypes = {
  userPicture: string;
  username: string;
};

const UserProfileButton = ({
  userPicture,
  username,
}: UserProfileButtonPropTypes) => {
  const profileOptions = [
    { title: "Profile", path: "/user/profile" },
    { title: "Gallery", path: "/user/entities" },
    { title: "Friends", path: "/user/friends" },
    { title: "My Orders", path: "/user/orders" },
    { title: "Settings", path: "/user/settings" },
  ];
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button className="m-0 p-0 !outline-none">
          <div className="flex items-center justify-center">
            <Image
              src={userPicture}
              width={30}
              height={30}
              className="rounded-full"
              alt="user profile image"
            />
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>
          <h3 className="text-md mx-3 whitespace-nowrap">
            {username.slice(0, 20)}
          </h3>
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          {profileOptions.map((item) => (
            <DropdownMenuItem
              className="hover:!bg-primary/[.08]"
              key={item.path}
            >
              <Link href={item.path} className="w-full">
                {item.title}
              </Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem className="hover:!bg-primary/[.08]">
            <button
              onClick={() => signOut()}
              className="m-0 flex w-full justify-start p-0"
            >
              Logout
            </button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileButton;
