import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { FiShoppingCart, FiHeart, FiLogIn, FiSearch } from "react-icons/fi";
import UserProfileButton from "./UserProfileButton";
import SearchBar from "./SearchBar";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  ListItem,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "./ui/button";
import { Loader2, MenuIcon } from "lucide-react";
import { AiOutlineArrowsAlt } from "react-icons/ai";
import Modal from "./ui/modal";

const buttons = [
  {
    href: "/user/wishlist",
    icon: <FiHeart size={20} />,
  },
  {
    href: "/user/cart",
    icon: <FiShoppingCart size={20} />,
  },
];

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
];
const Navbar = () => {
  const { data: session, status } = useSession();
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [navIsOpen, setNavIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [btnIsOpen, setBtnIsOpen] = useState({
    getStarted: false,
    components: false,
  });
  const [divRef] = useAutoAnimate<HTMLDivElement>();

  return (
    <nav
      className="sticky top-0 z-20 flex w-full flex-col items-center justify-around border 
    border-l-0 border-r-0 border-primary/20 bg-background p-4 py-2 text-foreground"
    >
      <Modal
        isOpen={modalOpen}
        title="Sign In"
        closeModal={() => setModalOpen(false)}
      >
        <div className="flex flex-col items-center justify-center py-12">
          <Button
            onClick={() => signIn("google")}
            className="flex h-16 w-72 cursor-pointer items-center justify-center rounded bg-blue-500 py-3 px-4 text-sm font-bold text-gray-100 shadow hover:bg-blue-600 hover:text-white"
          >
            <svg
              viewBox="0 0 24 24"
              className="mr-3 h-6 w-[10%] fill-current"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
            </svg>
            <span className="mr-1 block h-6 w-1 border-l border-white"></span>
            <span className="w-[90%] pl-3 text-lg">Sign up with Google</span>
          </Button>

          <Button
            onClick={() => signIn("facebook")}
            className="mt-2 flex h-16  w-72 cursor-pointer items-center justify-center rounded bg-indigo-600 py-3 px-4 text-sm font-bold text-gray-100 shadow hover:bg-indigo-700 hover:text-white"
          >
            <svg
              viewBox="0 0 24 24"
              className="mr-3 h-6 w-[10%] fill-current"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M23.998 12c0-6.628-5.372-12-11.999-12C5.372 0 0 5.372 0 12c0 5.988 4.388 10.952 10.124 11.852v-8.384H7.078v-3.469h3.046V9.356c0-3.008 1.792-4.669 4.532-4.669 1.313 0 2.686.234 2.686.234v2.953H15.83c-1.49 0-1.955.925-1.955 1.874V12h3.328l-.532 3.469h-2.796v8.384c5.736-.9 10.124-5.864 10.124-11.853z" />
            </svg>
            <span className="mr-1 block h-6 w-1 border-l border-white"></span>
            <span className="w-[90%] pl-3 text-lg">Sign up with Facebook</span>
          </Button>
        </div>
      </Modal>
      <div className="flex w-full justify-around">
        {/* Logo */}
        <div className="flex w-[25%] items-center justify-start md:hidden">
          <button
            onClick={() => setNavIsOpen(!navIsOpen)}
            className="my-0 flex items-center p-0"
          >
            <MenuIcon />
          </button>
        </div>
        <div className="flex w-1/2 items-center justify-center text-center md:w-[15%]">
          <Link href="/" className="text-lg font-medium">
            Art It Up
          </Link>
        </div>
        <div
          className={`hidden w-1/2 justify-center md:${
            showSearchBar ? "hidden" : "flex"
          }`}
        >
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/"
                        >
                          {/* <Icons.logo className="h-6 w-6" /> */}
                          <div className="mb-2 mt-4 text-lg font-medium">
                            shadcn/ui
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Beautifully designed components built with Radix UI
                            and Tailwind CSS.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/docs" title="Introduction">
                      Re-usable components built using Radix UI and Tailwind
                      CSS.
                    </ListItem>
                    <ListItem href="/docs/installation" title="Installation">
                      How to install dependencies and structure your app.
                    </ListItem>
                    <ListItem
                      href="/docs/primitives/typography"
                      title="Typography"
                    >
                      Styles for headings, paragraphs, lists...etc
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Components</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {components.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                      >
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/docs" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Documentation
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {showSearchBar ? (
          <div className="flex w-full justify-center">
            <SearchBar />
          </div>
        ) : null}
        {/* Buttons */}
        <div
          className={`flex w-[25%] items-center justify-between md:w-[15%] `}
        >
          <div
            ref={divRef}
            className={`flex w-full items-center justify-around`}
          >
            <button
              className="hover:text-skin-secondary duration-150 hover:scale-110"
              onClick={() => setShowSearchBar(!showSearchBar)}
            >
              <FiSearch size={20} />
            </button>
            {showSearchBar
              ? null
              : buttons.map((button) => (
                  <Link
                    href={button.href}
                    key={button.href}
                    className={`hover:text-skin-secondary ${
                      status == "unauthenticated"
                        ? "pointer-events-none text-muted-foreground"
                        : ""
                    } duration-150 hover:scale-110`}
                  >
                    {button.icon}
                  </Link>
                ))}
            <div
              className={`${
                showSearchBar ? "hidden" : "flex"
              } flex-col items-center`}
            >
              {status === "loading" ? (
                <Loader2 className="text-primary-foreground" />
              ) : session?.user ? (
                <UserProfileButton
                  userPicture={session.user.image as string}
                  username={session.user?.name as string}
                />
              ) : (
                <Button
                  onClick={() => setModalOpen(true)}
                  variant={"link"}
                  className="hover:text-skin-secondary m-0 p-0"
                >
                  <FiLogIn size={20} />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        className={`mt-3 ${navIsOpen ? "block" : "hidden"} w-full md:hidden`}
      >
        <div className="w-full flex-col items-center">
          <div className="flex w-full flex-col items-center justify-center">
            <Button
              onClick={() =>
                setBtnIsOpen({
                  ...btnIsOpen,
                  getStarted: !btnIsOpen.getStarted,
                })
              }
              variant={"ghost"}
              className="relative w-full"
            >
              Getting started
              <AiOutlineArrowsAlt className="absolute right-5" />
            </Button>
            <ul
              className={`${
                btnIsOpen.getStarted ? "grid" : "hidden"
              } gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]`}
            >
              <li className="row-span-3">
                <Link
                  className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                  href="/"
                >
                  {/* <Icons.logo className="h-6 w-6" /> */}
                  <div className="mb-2 mt-4 text-lg font-medium">shadcn/ui</div>
                  <p className="text-sm leading-tight text-muted-foreground">
                    Beautifully designed components built with Radix UI and
                    Tailwind CSS.
                  </p>
                </Link>
              </li>
              <ListItem href="/docs" title="Introduction">
                Re-usable components built using Radix UI and Tailwind CSS.
              </ListItem>
              <ListItem href="/docs/installation" title="Installation">
                How to install dependencies and structure your app.
              </ListItem>
              <ListItem href="/docs/primitives/typography" title="Typography">
                Styles for headings, paragraphs, lists...etc
              </ListItem>
            </ul>
          </div>
          <div className="flex flex-col items-center justify-center">
            <Button
              onClick={() =>
                setBtnIsOpen({
                  ...btnIsOpen,
                  components: !btnIsOpen.components,
                })
              }
              variant={"ghost"}
              className="relative w-full"
            >
              Components
              <AiOutlineArrowsAlt className="absolute right-5" />
            </Button>
            <ul
              className={`${
                btnIsOpen.components ? "grid" : "hidden"
              } w-[400px] gap-3 p-4 sm:w-[500px] md:grid-cols-2 lg:w-[600px] `}
            >
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </div>
          <div>
            <Link href="/docs" legacyBehavior passHref>
              <Button variant={"ghost"} className="relative w-full">
                Documentation
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
