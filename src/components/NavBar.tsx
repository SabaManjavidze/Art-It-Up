import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { FiShoppingCart, FiHeart, FiLogIn, FiSearch } from "react-icons/fi";
import { IoPersonAddOutline } from "react-icons/io5";
import { TfiGallery } from "react-icons/tfi";
import { Loader2 } from "lucide-react";
import UserProfileButton from "./UserProfileButton";
import SearchBar from "./SearchBar";
import { useAutoAnimate } from "@formkit/auto-animate/react";

const buttons = [
  {
    href: "/user/entities",
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
  {
    href: "/user/friends",
    icon: <IoPersonAddOutline size={20} />,
  },
];
const Navbar = () => {
  const { data: session, status } = useSession();
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [divRef] = useAutoAnimate<HTMLDivElement>();

  return (
    <nav className="flex items-center justify-between bg-secondary p-4 text-secondary-foreground">
      {/* Logo */}
      <Link href="/" className="text-lg font-medium">
        Online Clothing Store
      </Link>

      {/* Buttons */}
      <div className="flex w-3/5 min-w-[5vh] items-center justify-around">
        <div
          ref={divRef}
          className={`${
            session?.user ? "mr-12" : ""
          } flex w-full items-center justify-around`}
        >
          {showSearchBar ? <SearchBar /> : null}

          <button
            className="hover:text-skin-secondary duration-150 hover:scale-110"
            onClick={() => setShowSearchBar(!showSearchBar)}
          >
            <FiSearch size={20} />
          </button>
          {showSearchBar
            ? null
            : buttons.map((button) => (
                <a
                  href={button.href}
                  className="hover:text-skin-secondary duration-150 hover:scale-110"
                  key={button.href}
                >
                  {button.icon}
                </a>
              ))}
        </div>
        <div className="flex w-32 flex-col items-center">
          {status === "loading" ? (
            <Loader2 color="white" />
          ) : session?.user ? (
            <div className="mr-12 w-full">
              <UserProfileButton
                userPicture={session.user.image as string}
                username={session.user?.name as string}
              />
            </div>
          ) : (
            <a href={"/api/auth/signin"} className="hover:text-skin-secondary ">
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
