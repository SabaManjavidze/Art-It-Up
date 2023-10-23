import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { BiRadioCircle, BiRadioCircleMarked } from "react-icons/bi";
import { RiCheckboxFill, RiCheckboxBlankLine } from "react-icons/ri";

export function SelectableCard({
  children,
  isSelected,
  handleSelect,
}: {
  handleSelect: () => void;
  isSelected: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current && ref2.current) {
      const h1 = ref.current.offsetHeight;
      ref2.current.style.height = `${h1}px`;
    }
  }, [ref.current, ref2.current]);

  return (
    <div className="relative flex w-full items-start bg-transparent">
      <div
        ref={ref2}
        className="flex items-center justify-center sm:w-20 sm:px-4"
      >
        <button
          onClick={handleSelect}
          className="absolute bottom-5 right-4 z-20 p-0 sm:static"
        >
          {isSelected ? (
            <RiCheckboxFill size={30} className="text-accent " />
          ) : (
            <RiCheckboxBlankLine size={30} className="text-primary" />
          )}
        </button>
      </div>
      <div className="w-full" ref={ref}>
        {children}
      </div>
    </div>
  );
}
