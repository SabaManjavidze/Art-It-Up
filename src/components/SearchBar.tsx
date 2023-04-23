import type { FormEvent } from "react";
import { useState } from "react";
import { api } from "../utils/api";
import SearchTypeDropDown from "./UI/SearchTypeDropDown";
import { ClipLoader } from "react-spinners";
import SearchResults from "./SearchResults";
import Image from "next/image";
import { useRouter } from "next/router";
import { MultipleSelect } from "./UI/MultipleSelect";
import type { Tags } from "@prisma/client";

export type SearchTypeType = "users" | "products";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<SearchTypeType>("users");
  const [selectedTags, setSelectedTags] = useState<Tags[]>([]);
  const { data: tags, isLoading: tagsLoading } = api.getTags.useQuery();
  const {
    data: users,
    mutateAsync: searchUsers,
    isLoading: usersLoading,
  } = api.user.searchUsers.useMutation();
  const router = useRouter();

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchType == "users") {
      await searchUsers({ name: searchTerm });
    } else {
      router.push(
        `/search-results/${searchTerm}?tags=${selectedTags
          .map((item) => item.name)
          .join(", ")}`
      );
    }
  };
  return (
    <div className="relative flex h-10">
      <SearchTypeDropDown
        searchType={searchType}
        setSearchType={setSearchType}
      />
      <form className="flex" onSubmit={(e) => handleSearch(e)}>
        <input
          type="text"
          placeholder="Search..."
          className="w-full rounded-none border-[1px] border-r-0 border-gray-400 bg-skin-light-secondary py-2 pl-5 pr-3 text-white placeholder-gray-400 
	focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="rounded-l-none bg-blue-500 px-3 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Search
        </button>
        {searchType == "products" && tags ? (
          <MultipleSelect
            tags={tags}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          />
        ) : null}
      </form>
      {usersLoading ? (
        <ClipLoader size={20} />
      ) : users ? (
        <div className="absolute top-0 z-10 w-full translate-y-full bg-skin-light-secondary">
          <SearchResults users={users} />
        </div>
      ) : null}
    </div>
  );
};

export default SearchBar;
