import React, { Dispatch } from "react";
import { useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { Tags } from "@prisma/client";
import { AiOutlineCheck } from "react-icons/ai";

type MultipleSelectPropType = {
  tags: Tags[];
  selectedTags: Tags[];
  setSelectedTags: Dispatch<Tags[]>;
};
export const MultipleSelect = ({
  tags,
  selectedTags,
  setSelectedTags,
}: MultipleSelectPropType) => {
  return (
    <Listbox
      value={selectedTags}
      onChange={setSelectedTags}
      as="div"
      multiple
      className="relative z-30 inline-block h-full rounded-md rounded-r-none border-[1px] border-gray-400 
    bg-skin-light-secondary text-left text-white"
    >
      <Listbox.Button
        className="flex h-full min-w-[150px] items-center justify-center gap-x-1.5 rounded-md px-3 text-sm font-semibold shadow-sm 
	hover:bg-skin-light-secondary"
      >
        {selectedTags.length > 0
          ? `${selectedTags[0]?.name}${
              selectedTags[1] ? ", " + selectedTags[1].name : ""
            }`
          : null}
      </Listbox.Button>
      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Listbox.Options
          className="absolute left-0 z-10 mt-2 max-h-72 w-full origin-top-left overflow-y-scroll 
        rounded-md bg-skin-light-secondary shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          {tags.map((tag) => (
            <Listbox.Option
              key={tag.id}
              value={tag}
              className={
                "flex cursor-pointer px-4 py-2 text-sm hover:opacity-80"
              }
            >
              {selectedTags.find((selectedTag) => selectedTag == tag) ? (
                <AiOutlineCheck size={20} color="white" />
              ) : null}
              {tag.name}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Transition>
    </Listbox>
  );
};
