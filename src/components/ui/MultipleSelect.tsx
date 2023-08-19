import type { Dispatch } from "react";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Button } from "./button";
import type { Tags } from "@prisma/client";
import { twMerge } from "tailwind-merge";
import { HiChevronUpDown } from "react-icons/hi2";

type MultipleSelectPropType = {
  tags: Tags[];
  selectedTags: string[];
  setSelectedTags: Dispatch<string[]>;
  className?: string;
};
export const MultipleSelect = ({
  tags,
  selectedTags,
  setSelectedTags,
  className = "",
}: MultipleSelectPropType) => {
  const tagIsChecked = (tagId: string) =>
    !!selectedTags.find((tag) => tag == tagId);
  return (
    <DropdownMenu modal={true}>
      <DropdownMenuTrigger asChild>
        <Button className={twMerge("", className)} variant={"outline"}>
          <p className="mr-0 rounded-full bg-muted-foreground/80 px-2 py-[3px] text-secondary-foreground sm:mr-1">
            {selectedTags.length}
          </p>
          <p className="hidden sm:block">Tags</p>
          <HiChevronUpDown className="h-4 w-4 sm:ml-3 " aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-3 max-h-52 w-48 overflow-y-auto md:w-56 lg:mr-0">
        <DropdownMenuLabel>Tags</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {tags.map((item) => (
          <DropdownMenuCheckboxItem
            checked={!!tagIsChecked(item.id)}
            key={item.id}
            className="px-4"
            onClick={(e) =>
              tagIsChecked(item.id)
                ? setSelectedTags(selectedTags.filter((tag) => tag !== item.id))
                : setSelectedTags(selectedTags.concat([item.id]))
            }
          >
            {item.name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
