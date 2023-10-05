import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/utils/shadcnUtils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Capitalize } from "@/utils/general/utils";
import { countriesArr, countriesObj } from "@/utils/countriesArray";

interface ComboboxPropType extends React.InputHTMLAttributes<HTMLInputElement> {
  searchResults: { label: string; value: string }[];
  placeholder: string;
  value: string;
  setValue: React.Dispatch<string>;
}
export function Combobox({
  searchResults,
  placeholder,
  value,
  setValue,
  ...inputArgs
}: ComboboxPropType) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="text-md w-full justify-between border-2 font-normal text-primary-foreground"
        >
          {value ? Capitalize(value) : placeholder}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="">
        <Command>
          <CommandInput
            placeholder={placeholder}
            {...inputArgs}
            className="h-9"
          />
          <CommandEmpty>Not found.</CommandEmpty>
          <CommandGroup className="max-h-[132px] overflow-y-auto">
            {searchResults.map((framework) => (
              <CommandItem
                key={framework.value}
                onSelect={(currentValue) => {
                  setValue(currentValue);
                  setOpen(false);
                }}
              >
                {framework.label}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === framework.value ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
