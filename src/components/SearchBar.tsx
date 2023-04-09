import { useState } from "react";
import { api } from "../utils/api";
import SearchTypeDropDown from "./SearchTypeDropDown";

export type SearchTypeType="users"|"products"

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<SearchTypeType>("users");
  const {data,mutateAsync:searchUsers,isLoading} = api.user.searchUsers.useMutation()

  const handleSearch =async () => {
    const users=await searchUsers({name:searchTerm})
    console.log({users})
  };

  return (
    <div className="flex h-10">
    <SearchTypeDropDown searchType={searchType} setSearchType={setSearchType} />
      <input
        type="text"
        placeholder="Search..."
        className="w-full py-2 pl-10 pr-3 text-white placeholder-gray-400 bg-skin-light-secondary border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button
        className="px-3 text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
