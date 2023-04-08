import Image from "next/image";
import React, { useState } from "react";

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
