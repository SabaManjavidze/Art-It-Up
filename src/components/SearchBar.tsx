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
      <input
        type="text"
        placeholder="Search..."
        className="w-full rounded-none border-r-0 border-[1px] border-gray-400 bg-skin-light-secondary py-2 pl-5 pr-3 text-white placeholder-gray-400 
	focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button
        className="bg-blue-500 px-3 text-white rounded-l-none hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={handleSearch}
      >
        Search
      </button>
      {isLoading ? (
        <ClipLoader size={20} />
      ) : (
        users && (
          <div className="absolute z-10 w-full translate-y-full bg-skin-light-secondary">
            <SearchResults users={users} />
          </div>
        )
      )}
    </div>
  );
};

export default SearchBar;
