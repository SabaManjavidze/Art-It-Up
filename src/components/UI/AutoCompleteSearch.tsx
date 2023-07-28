import type { InputHTMLAttributes } from "react";
import React, { Fragment, useMemo, useState } from "react";
import type { RefCallBack } from "react-hook-form";
import { Combobox } from "./combobox";

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
    <Combobox
      results={filteredArr.map(({ name }) => {
        return { label: name, value: name };
      })}
      placeholder="Search country..."
    />
  );
}
