import Image from "next/image";
import Link from "next/link";
import React, { useState, Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { nanoid } from "nanoid";
import { signOut } from "next-auth/react";

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
    { title: "Settings", path: "/user/settings" },
  ];
  const handleModalClick = () => setShowModal(!showModal);
  return (
    <Menu
      as="div"
      className="relative inline-block h-full text-left text-white"
    >
      <div className="flex h-full">
        <Menu.Button
          onClick={handleModalClick}
          className="text-skin-primary hover:text-skin-secondary relative flex flex-col items-center"
        >
          <div className="flex flex-col items-center justify-center">
            <Image
              src={userPicture}
              width={50}
              height={50}
              className=" rounded-full"
              alt="user profile image"
            />
            <h3 className="text-lg text-skin-base">{username}</h3>
          </div>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className="absolute right-1/2 z-10 mt-6 w-24 origin-top-left translate-x-1/2 rounded-md bg-skin-light-secondary shadow-lg ring-1 ring-black 
	ring-opacity-5 focus:outline-none"
        >
          <div>
            {profileOptions.map((option) => (
              <Menu.Item key={nanoid()}>
                <Link
                  href={option.path}
                  className={
                    "text-md block rounded-md px-4 py-3 text-center duration-150 hover:bg-skin-secondary hover:opacity-80"
                  }
                >
                  {option.title}
                </Link>
              </Menu.Item>
            ))}
            <Menu.Item>
              <button
                onClick={() => signOut()}
                className={
                  "text-md block w-full rounded-md px-4 py-3 text-center duration-150 hover:bg-skin-secondary hover:opacity-80"
                }
              >
                Log Out
              </button>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default UserProfileButton;
