import type { Dispatch, ReactNode, SetStateAction} from "react";
import { useState } from "react";
import React from "react";
import { RadioGroup } from "@headlessui/react";

interface RadioGroupPropType {
  children: ReactNode;
  selected: number[];
  setSelected: Dispatch<SetStateAction<number[]>>;
}

export default function RadioGroupSelect({
  children,
  selected,
  setSelected,
}: RadioGroupPropType) {
  return (
    <div className="w-full px-4 py-16">
      <div className="mx-auto w-full max-w-md">
        <RadioGroup value={selected} onChange={setSelected}>
          {children}
        </RadioGroup>
      </div>
    </div>
  );
}
