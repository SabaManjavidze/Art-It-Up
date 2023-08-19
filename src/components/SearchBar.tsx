import type { FormEvent } from "react";
import { useState } from "react";
import { api } from "../utils/api";
import type { SearchType } from "./ui/SearchTypeDropDown";
import SearchTypeDropDown from "./ui/SearchTypeDropDown";
import { Loader2 } from "lucide-react";
import SearchResults from "./SearchResults";
import Image from "next/image";
import { useRouter } from "next/router";
import { MultipleSelect } from "./ui/MultipleSelect";
import type { Tags } from "@prisma/client";
import { nanoid } from "nanoid";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<SearchType>({
    id: nanoid(),
    title: "Users",
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { data: tags, isLoading: tagsLoading } = api.getTags.useQuery();
  const {
    data: users,
    mutateAsync: searchUsers,
    isLoading: usersLoading,
  } = api.user.searchUsers.useMutation();
  const router = useRouter();

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchType.title == "Users") {
      await searchUsers({ name: searchTerm });
    } else {
      const names = [];
      if (tags) {
        for (let i = 0; i < tags.length; i++) {
          const element = tags[i] as Tags;
          if (selectedTags.find((tag) => tag == element.id))
            names.push(element);
        }
      }
      router.push(
        `/search-results/${searchTerm}?tags=${
          selectedTags.length > 0 ? names.join(", ") : ""
        }`
      );
    }
  };
  return (
    <div className="relative flex h-10 w-full">
      <SearchTypeDropDown
        selected={searchType}
        handleSelectItem={setSearchType}
        options={[
          { id: "1", title: "Products" },
          { id: "2", title: "Users" },
        ]}
        className="rounded-none text-xs md:text-sm"
      />
      <form className="flex w-full" onSubmit={(e) => handleSearch(e)}>
        <Input
          type="text"
          placeholder="Search..."
          className="z-10 w-full rounded-none border border-l-0 duration-150
           focus-visible:ring-opacity-100 focus-visible:ring-offset-0 md:border-x-0"
          value={searchTerm}
          required
          autoFocus
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          isLoading={usersLoading}
          className="hidden rounded-none text-secondary-foreground md:block"
        >
          Search
        </Button>
        {searchType.title == "Products" && tags ? (
          <MultipleSelect
            tags={tags}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            className="rounded-none"
          />
        ) : null}
      </form>
      {usersLoading ? (
        <></>
      ) : users ? (
        <div className="absolute top-0 z-10 w-full translate-y-full bg-secondary">
          <SearchResults users={users} />
        </div>
      ) : null}
    </div>
  );
};

export default SearchBar;
