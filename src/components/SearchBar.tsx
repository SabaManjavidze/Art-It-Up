import { useState } from "react";
import { api } from "../utils/api";
import SearchTypeDropDown from "./SearchTypeDropDown";
import { ClipLoader } from "react-spinners";
import SearchResults from "./SearchResults";
import Image from "next/image";

export type SearchTypeType = "users" | "products";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<SearchTypeType>("users");
  const {
    data: users,
    mutateAsync: searchUsers,
    isLoading,
  } = api.user.searchUsers.useMutation();

  const handleSearch = async () => {
    const users = await searchUsers({ name: searchTerm });
    console.log({ users });
  };
  return (
    <div className="relative flex h-10">
      <SearchTypeDropDown
        searchType={searchType}
        setSearchType={setSearchType}
      />
      <form className="flex" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search..."
          className="w-full rounded-none border-[1px] border-r-0 border-gray-400 bg-skin-light-secondary py-2 pl-5 pr-3 text-white placeholder-gray-400 
	focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="rounded-l-none bg-blue-500 px-3 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleSearch}
        >
          Search
        </button>
      </form>
      {isLoading ? (
        <ClipLoader size={20} />
      ) : users ? (
        <div className="absolute z-10 w-full translate-y-full bg-skin-light-secondary">
          <SearchResults users={users} />
        </div>
      ) : null}
    </div>
  );
};

export default SearchBar;
