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
import { Tags } from "@prisma/client";

type MultipleSelectPropType = {
  tags: Tags[];
  selectedTags: string[];
  setSelectedTags: Dispatch<string[]>;
};
export const MultipleSelect = ({
  tags,
  selectedTags,
  setSelectedTags,
}: MultipleSelectPropType) => {
  const tagIsChecked = (tagId: string) =>
    !!selectedTags.find((tag) => tag == tagId);
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button className="text-secondary-foreground">Tags</Button>
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
