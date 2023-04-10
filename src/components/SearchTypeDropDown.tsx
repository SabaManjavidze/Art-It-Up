import type {Dispatch} from "react";
import {useState,Fragment} from "react"
import type {SearchTypeType} from "./SearchBar"
import {HiChevronUpDown as UpDownIcon} from "react-icons/hi2"
import {Menu,Transition} from "@headlessui/react"
import {nanoid} from "nanoid"



const SearchTypeOptions=["Users","Products"] as const

type SearchTypeDropDownPropType={
	searchType:SearchTypeType,
	setSearchType:Dispatch<SearchTypeType>
}
export default function SearchTypeDropDown({searchType,setSearchType}:SearchTypeDropDownPropType) {

  return (
    <Menu as="div" className="relative inline-block border-[1px] border-gray-400 rounded-r-none rounded-md text-left h-full bg-skin-light-secondary text-white" >
      <div className="flex h-full">

        <Menu.Button className="flex w-full justify-center items-center gap-x-1.5 rounded-md px-3 h-full text-sm font-semibold shadow-sm 
	hover:bg-skin-light-secondary">
	<div className="flex justify-center items-center">
		{searchType[0]&&searchType[0].toUpperCase()+searchType.slice(1)}
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
        <Menu.Items className="absolute left-0 z-10 mt-2 w-full origin-top-left rounded-md bg-skin-light-secondary shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" >
          <div className="py-1">
	  {SearchTypeOptions.map(option=>(

            <Menu.Item key={nanoid()}>
                <button
		onClick={()=>setSearchType(option.toLowerCase() as SearchTypeType)}
                  className={'block px-4 py-2 text-sm hover:opacity-80'}
                >
                  {option}
                </button>
            </Menu.Item>
	    ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

