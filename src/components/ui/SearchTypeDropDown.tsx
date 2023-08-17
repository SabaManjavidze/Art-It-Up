import type { Dispatch } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HiChevronUpDown } from "react-icons/hi2";
import { Loader2 } from "lucide-react";
import { Button } from "./button";
import { twMerge } from "tailwind-merge";
import { Capitalize } from "@/utils/utils";

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
          isLoading={isLoading}
          className={twMerge(
            "flex items-center justify-center text-primary-foreground",
            className
          )}
        >
          {Capitalize(selected?.title)}
          <div className="ml-3">
            <HiChevronUpDown className="-mr-1 h-4 w-4 " aria-hidden="true" />
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
