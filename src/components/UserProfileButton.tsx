import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Modal from "react-modal";

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
    <button
      //   href={"/user/profile"}
      onClick={handleModalClick}
      className="text-skin-primary hover:text-skin-secondary relative flex flex-col items-center"
    >
      <Modal
        isOpen={showModal}
        onRequestClose={handleModalClick}
        contentLabel="Share Post Link"
        className={"h-full"}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        style={{
          overlay: {
            backgroundColor: "transparent",
          },
          content: {
            backgroundColor: "transparent",
            border: "none",
          },
        }}
      >
        <ul className="absolute right-[115px] top-[115px] rounded-lg ">
          {profileOptions.map((item) => (
            <li key={item.path}>
              <Link href={item.path}>
                <div
                  className="cursor-pointer bg-skin-secondary  px-12
                py-4 text-sm duration-150 ease-in-out hover:bg-skin-light-secondary"
                >
                  <h3 className="text-lg text-gray-200">{item.title}</h3>
                </div>
              </Link>
            </li>
          ))}
          <li key={"logout"}>
            <button
              onClick={() => signOut()}
              className="w-full cursor-pointer bg-skin-secondary px-10
                py-4 text-sm duration-150 ease-in-out hover:bg-skin-light-secondary"
            >
              <h3 className="text-lg text-gray-200">Logout</h3>
            </button>
          </li>
        </ul>
      </Modal>
      <Image
        src={userPicture}
        width={50}
        height={50}
        className="h-auto w-auto rounded-full"
        alt="user profile image"
      />
      <h3 className="text-lg text-skin-base">{username}</h3>
    </button>
  );
};

export default UserProfileButton;
