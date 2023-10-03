import type { Dispatch, ReactNode, SetStateAction } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import type { SearchType } from "@/components/ui/SearchTypeDropDown";

type SearchContextProps = {
  setSelectedTags: Dispatch<string[]>;
  selectedTags: string[];
  setSearchType: Dispatch<SearchType>;
  searchType: SearchType;
  searchTerm: string;
  setSearchTerm: Dispatch<string>;
  closeSearchBar: () => void;
  showSearchBar: boolean;
  setShowSearchBar: Dispatch<boolean>;
};
export const SearchContext = createContext<SearchContextProps>({
  searchTerm: "",
  setSearchTerm: () => { },
  searchType: { id: "1", title: "Products" },
  setSearchType: () => { },
  selectedTags: [],
  setSelectedTags: () => { },
  closeSearchBar: () => { },
  showSearchBar: false,
  setShowSearchBar: () => { },
});
export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<SearchType>({
    id: "1",
    title: "Products",
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showSearchBar, setShowSearchBar] = useState(false);

  const closeSearchBar = () => setShowSearchBar(false);
  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        searchType,
        setSearchType,
        selectedTags,
        setSelectedTags,
        closeSearchBar,
        showSearchBar,
        setShowSearchBar,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
