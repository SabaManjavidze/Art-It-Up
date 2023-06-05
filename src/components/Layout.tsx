import { Menu } from "@headlessui/react";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { ToastContainer } from "react-toastify";

export default function Layout({
	title,
	children,
}: {
	title: string;
	children: React.ReactElement | React.ReactElement[] | null;
}) {
	return (
		<>
			<Head>
				<title>{title ? title + " - Art It Up" : "Art It Up"}</title>
				<meta name="description" content="Ecommerce Website" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div className="flex min-h-screen flex-col justify-between bg-skin-main text-white">
				<main className="container m-auto mt-4 px-4">{children}</main>
				<footer className="flex h-10 items-center justify-center shadow-inner">
					<p>Copyright © 2022 Art It Up</p>
				</footer>
			</div>
		</>
	);
}
