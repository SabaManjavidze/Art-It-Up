import type { FormEvent } from "react";
import React, { useEffect, useState } from "react";
import { api } from "@/utils/api";
import SearchTypeDropDown from "./ui/SearchTypeDropDown";
import SearchResults from "./SearchResults";
import { useRouter } from "next/router";
import { MultipleSelect } from "./ui/MultipleSelect";
import type { Tags } from "@prisma/client";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useSearch } from "@/hooks/useSearchHook";

const SearchBar = () => {
  const {
    searchTerm,
    setSearchTerm,
    searchType,
    setSearchType,
    selectedTags,
    setSelectedTags,
    closeSearchBar,
  } = useSearch();
  const { data: tags, isLoading: tagsLoading } = api.getTags.useQuery();
  const {
    data: users,
    mutateAsync: searchUsers,
    isLoading: usersLoading,
  } = api.user.searchUsers.useMutation();
  const router = useRouter();
  useEffect(() => {
    const { query } = router.query;
    if (query && searchType.title == "Products") {
      setSearchTerm(query as string);
    }
  }, []);
  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchType.title == "Products") closeSearchBar();
    if (searchType.title == "Users") {
      await searchUsers({ name: searchTerm });
    } else {
      const names: string[] = [];
      if (tags) {
        for (let i = 0; i < tags.length; i++) {
          const element = tags[i] as Tags;
          if (selectedTags.find((tag) => tag == element.id))
            names.push(element.name);
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
            isLoading={tagsLoading}
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
