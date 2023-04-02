import { useSession } from "next-auth/react";
import Link from "next/link";
import { FiShoppingCart, FiHeart, FiLogIn } from "react-icons/fi";
import { TfiGallery } from "react-icons/tfi";
import { ClipLoader } from "react-spinners";
import UserProfileButton from "./UserProfileButton";
import { ToastContainer } from "react-toastify";

const buttons = [
  {
    href: "/user/gallery",
    icon: <TfiGallery size={20} />,
  },
  {
    href: "/user/wishlist",
    icon: <FiHeart size={20} />,
  },
  {
    href: "/user/cart",
    icon: <FiShoppingCart size={20} />,
  },
];
const Navbar = () => {
  const { data: session, status } = useSession();

  return (
    <nav className="flex items-center justify-between bg-skin-secondary p-4 text-white">
      {/* Logo */}
      <Link href="/" className="text-skin-primary text-lg font-medium">
        Online Clothing Store
      </Link>

      {/* Buttons */}
      <div className="flex min-w-[5vh] items-center justify-around">
        <div
          className={`${
            session?.user ? "mr-12" : ""
          } flex w-32 items-center justify-around`}
        >
          {buttons.map((button) => (
            <a
              href={button.href}
              className="text-skin-primary hover:text-skin-secondary duration-150 hover:scale-110"
              key={button.href}
            >
              {button.icon}
            </a>
          ))}
        </div>
        <div className="flex w-32 flex-col items-center">
          {status === "loading" ? (
            <ClipLoader color="white" />
          ) : session?.user ? (
            <div className="mr-12 w-full">
              <UserProfileButton
                userPicture={session.user.image as string}
                username={session.user?.name as string}
              />
            </div>
          ) : (
            <a
              href={"/api/auth/signin"}
              className="text-skin-primary hover:text-skin-secondary "
            >
              <FiLogIn size={20} />
              LogIn
            </a>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
