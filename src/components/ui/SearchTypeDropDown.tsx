import type { Dispatch } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HiChevronUpDown as UpDownIcon } from "react-icons/hi2";
import { Loader2 } from "lucide-react";
import { Button } from "./button";

// turn sizes array into hashmap where the id is the key and size is the value

export type SearchType = {
	id: string;
	title: "Users" | "Products" | string;
};
type SearchTypeDropDownPropType = {
	selected: SearchType;
	handleSelectItem: (option: SearchType) => void;
	options?: SearchType[];
	handleOpenClick?: () => void;
	isLoading?: boolean;
	className?: string;
};
export default function SearchTypeDropDown({
	selected,
	handleSelectItem,
	options,
	handleOpenClick,
	isLoading = false,
	className = "",
}: SearchTypeDropDownPropType) {
	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<Button
					onClick={handleOpenClick}
					variant={"outline"}
					className={
						className +
						"flex items-center justify-center text-primary-foreground"
					}
				>
					{isLoading ? (
						<Loader2 className="text-primary-foreground" size={10} />
					) : (
						`${selected?.title?.[0]?.toUpperCase()}${selected?.title?.slice(1)}`
					)}
					<div className="ml-3">
						<UpDownIcon className="-mr-1 h-4 w-4 " aria-hidden="true" />
					</div>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-32">
				<DropdownMenuGroup>
					{options?.map((option) => (
						<DropdownMenuItem key={option.id} className="p-0">
							<button
								onClick={() => handleSelectItem(option)}
								className={
									"flex w-full justify-start px-4 py-2 text-sm hover:opacity-80"
								}
							>
								{option.title}
							</button>
						</DropdownMenuItem>
					))}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}