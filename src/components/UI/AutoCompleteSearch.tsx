import React, { Fragment, InputHTMLAttributes, useMemo, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { nanoid } from "nanoid";
import { AiOutlineCheck } from "react-icons/ai";
import { HiChevronUpDown } from "react-icons/hi2";
import { RefCallBack } from "react-hook-form";

interface AutoCompleteSearchPropType
  extends InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
  arr: Array<{ name: string }>;
  innerRef: RefCallBack;
}
export default function AutoCompleteSearch({
  arr,
  placeholder,
  innerRef,
  ...args
}: AutoCompleteSearchPropType) {
  const [selected, setSelected] = useState<{ name: string }>({ name: "" });
  const [query, setQuery] = useState("");
  const filteredArr = useMemo(() => {
    return query === ""
      ? arr
      : arr.filter((item) =>
          item.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );
  }, [query]);
  return (
    <Combobox value={selected} onChange={setSelected}>
      <div className="relative w-full">
        <div
          className="relative w-full cursor-default overflow-hidden rounded-sm border-2 border-gray-400 
        bg-skin-secondary py-1 text-left
        shadow-md focus:outline-none sm:text-sm"
        >
          <Combobox.Input
            {...args}
            ref={innerRef}
            className="w-full rounded-sm border-none bg-skin-secondary 
              pl-3 pr-10 text-lg leading-5 focus:ring-0"
            displayValue={(item) => (item as unknown as { name: string }).name}
            placeholder={placeholder}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <HiChevronUpDown
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options
            className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-skin-secondary py-1 text-base shadow-lg 
          ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            {filteredArr.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                Nothing found.
              </div>
            ) : (
              filteredArr.map((item) => (
                <Combobox.Option
                  key={nanoid()}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-teal-600 text-white" : "text-white"
                    }`
                  }
                  value={item}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {item.name}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? "text-white" : "text-teal-600"
                          }`}
                        >
                          <AiOutlineCheck
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
}
