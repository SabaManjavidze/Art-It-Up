import React, { useState } from "react";
import {
	AccordionItem,
	AccordionItemButton,
	AccordionItemHeading,
	AccordionItemPanel,
} from "react-accessible-accordion";
import { AiOutlineCaretDown, AiOutlineCaretRight } from "react-icons/ai";
import type { UserAddress } from "@prisma/client";
import { nanoid } from "nanoid";
import { PublicKeys } from "../WrappedPages/ProfilePage";

export default function AddressCard({ details }: { details: UserAddress }) {
	const [expanded, setExpanded] = useState("");
	const handleItemExpand = () => {
		const id = expanded ? "" : details.id;
		setExpanded(id);
	};
	return (
		<AccordionItem key={details.id} onClick={handleItemExpand}>
			<AccordionItemHeading>
				<AccordionItemButton
					className="flex w-full items-center rounded-md 
                  border-none bg-skin-secondary p-4 text-left"
				>
					{expanded == details.id ? (
						<AiOutlineCaretDown color="white" size={30} />
					) : (
						<AiOutlineCaretRight color="white" size={30} />
					)}
					<p className="ml-3 text-lg">{details.title}</p>
				</AccordionItemButton>
			</AccordionItemHeading>
			<AccordionItemPanel className="animate-fadein p-5">
				{(Object.keys(details) as (keyof UserAddress)[]).map((key) => {
					if ((PublicKeys as any)[key])
						return (
							<p key={nanoid()}>
								{key}: {details[key]}
							</p>
						);
				})}
			</AccordionItemPanel>
		</AccordionItem>
	);
}
