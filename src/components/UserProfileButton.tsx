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
import { useProfile } from "@/hooks/useProfileHook";
import { HiBadgeCheck } from "react-icons/hi";

type UserProfileButtonPropTypes = {
  userPicture: string;
  username: string;
  credits: number;
  whitelist: boolean;
};

const UserProfileButton = ({
  userPicture,
  username,
  credits,
  whitelist = false,
}: UserProfileButtonPropTypes) => {
  const profileOptions = [
    { title: "Profile", path: "/user/profile" },
    { title: "Gallery", path: "/user/gallery" },
    { title: "My Orders", path: "/user/orders" },
  ];
  const { changes, setChanges } = useProfile();
  return (
    <DropdownMenu modal={false} onOpenChange={() => setChanges(0)}>
      <DropdownMenuTrigger asChild>
        <button className="p-0 !outline-none">
          <div className="relative flex items-center justify-center">
            <Image
              src={userPicture}
              width={30}
              height={30}
              className={`rounded-full border-[3px] ${
                whitelist ? "border-yellow-300" : "border-primary-foreground/70"
              }`}
              alt="user profile image"
            />
            {whitelist ? (
              <HiBadgeCheck className="absolute top-0 left-0 text-yellow-300" />
            ) : null}
            {changes > 0 ? (
              <div className="absolute top-1 right-0 translate-x-1/2 -translate-y-1/2">
                <h4 className="flex h-5 w-5 items-center justify-center rounded-full bg-accent font-serif leading-3 text-secondary-foreground">
                  {changes}
                </h4>
              </div>
            ) : null}
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel className="flex w-full flex-col items-center">
          <h3 className="text-md mx-3 whitespace-nowrap">
            {username.slice(0, 20)}
          </h3>
          <div className="flex items-center justify-center">
            <h3 className="text-md mr-1 whitespace-nowrap rounded-lg border-2 border-accent-foreground px-1 py-[2px] text-accent-foreground">
              {credits}
            </h3>
            <h3 className="text-md whitespace-nowrap">Credits</h3>
          </div>
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
