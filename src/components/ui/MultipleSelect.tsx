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
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button className={twMerge("", className)} variant={"outline"}>
          <p className="mr-1 rounded-full bg-muted-foreground/80 px-2 py-[3px] text-secondary-foreground">
            {selectedTags.length}
          </p>
          Tags
          <div className="ml-3">
            <HiChevronUpDown className="-mr-1 h-4 w-4 " aria-hidden="true" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-52 w-56 overflow-y-scroll">
        <DropdownMenuLabel>Tags</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {tags.map((item) => (
          <DropdownMenuCheckboxItem
            checked={!!tagIsChecked(item.id)}
            key={item.id}
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
