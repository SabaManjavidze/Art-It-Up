import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { BiRadioCircle, BiRadioCircleMarked } from "react-icons/bi";

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
    <div className="flex w-full items-start bg-transparent">
      <div ref={ref2} className="flex w-20 items-center justify-center px-4">
        <button onClick={handleSelect}>
          {isSelected ? (
            <BiRadioCircleMarked size={30} className="text-primary" />
          ) : (
            <BiRadioCircle size={30} className="text-primary" />
          )}
        </button>
      </div>
      <div className="w-full" ref={ref}>
        {children}
      </div>
    </div>
  );
}
