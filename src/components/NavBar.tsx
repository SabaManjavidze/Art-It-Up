import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { FiShoppingCart, FiHeart, FiLogIn, FiSearch } from "react-icons/fi";
import { IoPersonAddOutline } from "react-icons/io5";
import { Loader2 } from "lucide-react";
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
	const [divRef] = useAutoAnimate<HTMLDivElement>();

	return (
		<nav
			className="sticky top-0 z-20 flex w-full items-center justify-around border 
    border-l-0 border-r-0 border-primary/20 bg-background p-4 py-2 text-foreground"
		>
			{/* Logo */}
			<div className="w-[15%]">
				<Link href="/" className="text-lg font-medium">
					Art It Up
				</Link>
			</div>
			<div className="flex w-3/5 justify-center">
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
										Re-usable components built using Radix UI and Tailwind CSS.
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

			{/* Buttons */}
			<div className="flex w-[15%] items-center ">
				<div
					ref={divRef}
					className={`flex w-full items-center justify-around`}
				// className={`${
				//   session?.user ? "mr-12" : ""
				// } flex w-full items-center justify-around`}
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
							<Link
								href={button.href}
								className="hover:text-skin-secondary duration-150 hover:scale-110"
								key={button.href}
							>
								{button.icon}
							</Link>
						))}
					<div className="flex flex-col items-center">
						{status === "loading" ? (
							<Loader2 className="text-primary-foreground" />
						) : session?.user ? (
							<UserProfileButton
								userPicture={session.user.image as string}
								username={session.user?.name as string}
							/>
						) : (
							<Link
								href={"/api/auth/signin"}
								className="hover:text-skin-secondary "
							>
								<FiLogIn size={20} />
							</Link>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
