import type { Dispatch } from "react";
import { Fragment } from "react";
import { HiChevronUpDown as UpDownIcon } from "react-icons/hi2";
import { Menu, Transition } from "@headlessui/react";
import { nanoid } from "nanoid";
import { ClipLoader } from "react-spinners";

// turn sizes array into hashmap where the id is the key and size is the value

export type DropDownItemType = {
	id: number, title: string
}
type SearchTypeDropDownPropType = {
	selected: DropDownItemType;
	setSelected: Dispatch<DropDownItemType>;
	options?: DropDownItemType[];
	handleOpenClick?: () => void;
	isLoading?: boolean;
	className?: string;
};
export default function SearchTypeDropDown({
	selected,
	setSelected,
	options,
	handleOpenClick,
	isLoading = false, className = ""
}: SearchTypeDropDownPropType) {
	return (
		<Menu
			as="div"
			className={className + " relative hover:bg-skin-light-secondary inline-block h-full rounded-md border-[1px] border-gray-400 bg-skin-light-secondary text-left text-white"}
		>
			<div className="flex h-full">
				<Menu.Button
					onClick={handleOpenClick}
					className="flex h-full w-full items-center justify-center gap-x-1.5 rounded-md px-3 text-sm font-semibold shadow-sm 
	"
				>
					<div className="flex items-center justify-center">
						{isLoading ? <ClipLoader color="white" size={10} /> : `${selected?.title?.[0]?.toUpperCase()}${selected?.title?.slice(1)}`}
						<div className="ml-3">
							<UpDownIcon className="-mr-1 h-4 w-4 " aria-hidden="true" />
						</div>
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
				<Menu.Items className="absolute left-0 z-10 mt-2 w-full origin-top-left rounded-md bg-skin-light-secondary shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className="py-1">
						{options?.map((option) => (
							<Menu.Item key={nanoid()}>
								<button
									onClick={() =>
										setSelected(option)
									}
									className={"block px-4 py-2 text-sm hover:opacity-80"}
								>
									{option.title}
								</button>
							</Menu.Item>
						))}
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
}
